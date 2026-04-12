import React, { useEffect, useState } from "react";
import { Space, Alert, Card, Image, Typography, message } from "antd";
import QuestionLayout from "../QuestionLayout";
import AudioPlayer from "../AudioPlayer";
import AudioRecorder from "../AudioRecorder";
import { useQuestionTimer } from "../../../hooks/useQuestionTimer";
import { useMutation } from "@tanstack/react-query";
import useHttp from "@/hooks/use-http";

const { Text } = Typography;

const RetellLecture = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
  recordTime = 40,
  isPaused = false,
  isOnlyViewQuestions,
}) => {
  const [phase, setPhase] = useState("listen"); // listen | recording | done
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState("");
  const [uploadedRecordingKey, setUploadedRecordingKey] = useState("");

  const { sendRequest } = useHttp({ type: "auth" });

  const recordTimer = useQuestionTimer(recordTime, () => {
    setPhase("done");
  });

  useEffect(() => {
    if (isPaused) {
      recordTimer.pause();
    } else if (phase === "recording") {
      recordTimer.start();
    }
  }, [phase, isPaused]);

  const uploadAudioCall = useMutation({
    mutationFn: (payload) =>
      sendRequest({
        url: "uploadAudio",
        method: "POST",
        payload,
      }),
    onSuccess: (data) => {
      const uploadedKey =
        data?.response?.data?.data?.key ||
        data?.response?.data?.key ||
        data?.data?.data?.key ||
        data?.data?.key ||
        data?.key;

      if (!uploadedKey) {
        message.error("Audio uploaded but no file key returned");
        return;
      }

      setUploadedRecordingKey(uploadedKey);

      onResponse?.({
        type: "recording",
        recording: uploadedKey,
      });

      message.success("Audio uploaded successfully");
    },
    onError: (err) => {
      console.error(err);
      message.error(err?.message || "Failed to upload audio");
    },
  });

  const handleAudioComplete = () => {
    setTimeout(() => setPhase("recording"), 1000);
  };

  const handleRecordingComplete = (blob, url) => {
    setAudioBlob(blob);
    setRecordedAudioUrl(url);
    setPhase("done");

    const formData = new FormData();
    formData.append("file", blob, `retell-lecture-${Date.now()}.webm`);
    formData.append("question_type", "rl");

    uploadAudioCall.mutate(formData);
  };

  const instructions =
    phase === "listen"
      ? "You will hear a lecture. After listening to the lecture, please retell what you have just heard in your own words."
      : "Begin speaking now.";

  return (
    <QuestionLayout
      type="rl"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      timeRemaining={phase === "recording" ? recordTimer.formatTime() : null}
      isOnlyViewQuestions={isOnlyViewQuestions}
      instructions={instructions}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        {question.data?.image && (
          <Card style={{ textAlign: "center" }}>
            <Image
              src={question.data.image}
              alt="Lecture visual"
              style={{ maxHeight: "280px", objectFit: "contain" }}
              preview={false}
            />
          </Card>
        )}

        <AudioPlayer
          src={question.data?.audio}
          autoPlay={true}
          maxPlays={1}
          onPlayComplete={handleAudioComplete}
          disabled={phase !== "listen"}
        />

        {phase === "listen" && (
          <Alert
            message="Listen Carefully"
            description="The audio will play automatically. Listen and prepare to retell the lecture."
            type="info"
            showIcon
          />
        )}

        {phase === "recording" && (
          <Alert
            message="Retell the Lecture"
            description="Speak clearly and summarize the main points."
            type="warning"
            showIcon
          />
        )}

        {phase !== "listen" && (
          <AudioRecorder
            maxDuration={recordTime}
            onRecordingComplete={handleRecordingComplete}
            disabled={phase === "done"}
          />
        )}

        {phase === "done" && (
          <>
            <Alert
              message="Recording Complete"
              description="Your retell response has been recorded. You can now listen to your recording."
              type="success"
              showIcon
            />

            {recordedAudioUrl && (
              <Card size="small" title="Your Recorded Response">
                <audio
                  controls
                  src={recordedAudioUrl}
                  style={{ width: "100%" }}
                />
              </Card>
            )}

            {uploadAudioCall.isPending && (
              <Alert
                message="Uploading Audio"
                description="Please wait while your recording is being uploaded."
                type="warning"
                showIcon
              />
            )}

            {uploadedRecordingKey && (
              <Text type="secondary">
                Uploaded successfully: {uploadedRecordingKey}
              </Text>
            )}

            {audioBlob &&
              !uploadedRecordingKey &&
              !uploadAudioCall.isPending && (
                <Text type="secondary">Response captured locally.</Text>
              )}
          </>
        )}
      </Space>
    </QuestionLayout>
  );
};

export default RetellLecture;
