import React, { useEffect, useState } from "react";
import { Space, Alert, Card, Typography, message } from "antd";
import QuestionLayout from "../QuestionLayout";
import AudioPlayer from "../AudioPlayer";
import AudioRecorder from "../AudioRecorder";
import { useQuestionTimer } from "../../../hooks/useQuestionTimer";
import { useMutation } from "@tanstack/react-query";
import useHttp from "@/hooks/use-http";
// import useHttp from "@/hooks/use-http";

const { Paragraph, Text } = Typography;

const RespondToSituation = ({
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
    setTimeout(() => setPhase("recording"), 800);
  };

  const handleRecordingComplete = (blob, url) => {
    setAudioBlob(blob);
    setRecordedAudioUrl(url);
    setPhase("done");

    const formData = new FormData();
    formData.append("file", blob, `respond-to-situation-${Date.now()}.webm`);
    formData.append("question_type", "rts");

    uploadAudioCall.mutate(formData);
  };

  return (
    <QuestionLayout
      type="rts"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      timeRemaining={phase === "recording" ? recordTimer.formatTime() : null}
      isOnlyViewQuestions={isOnlyViewQuestions}
      instructions="You will hear and/or read a situation. Respond in an appropriate way."
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        {question?.data?.text && (
          <Card style={{ background: "#fafafa" }}>
            <Paragraph
              style={{ margin: 0, fontSize: "16px", lineHeight: "1.8" }}
            >
              {question.data.text}
            </Paragraph>
          </Card>
        )}

        {question?.data?.audio && (
          <AudioPlayer
            src={question.data.audio}
            autoPlay={true}
            maxPlays={1}
            onPlayComplete={handleAudioComplete}
            disabled={phase !== "listen"}
          />
        )}

        {phase === "listen" && (
          <Alert
            type="info"
            showIcon
            message="Listen / Read Carefully"
            description="After the prompt ends, you will respond by speaking."
          />
        )}

        {phase === "recording" && (
          <Alert
            type="warning"
            showIcon
            message="Respond Now"
            description="Speak naturally and respond appropriately to the situation."
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
              type="success"
              showIcon
              message="Response Recorded"
              description="Your spoken response has been captured. You can now listen to your recording."
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
                <Text type="secondary">Audio response captured locally.</Text>
              )}
          </>
        )}
      </Space>
    </QuestionLayout>
  );
};

export default RespondToSituation;
