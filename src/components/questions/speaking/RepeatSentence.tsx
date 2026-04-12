import React, { useState, useEffect } from "react";
import { Space, Alert, Card, Typography, message } from "antd";
import QuestionLayout from "../QuestionLayout";
import AudioPlayer from "../AudioPlayer";
import AudioRecorder from "../AudioRecorder";
import { useQuestionTimer } from "../../../hooks/useQuestionTimer";
import { useMutation } from "@tanstack/react-query";
import useHttp from "@/hooks/use-http";

const { Text } = Typography;

const RepeatSentence = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
  recordTime = 15,
  isPaused = false,
  isOnlyViewQuestions,
}) => {
  const [phase, setPhase] = useState("listen"); // listen | recording | done
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState("");
  const [uploadedRecordingKey, setUploadedRecordingKey] = useState("");
  const { sendRequest } = useHttp({ type: "auth" });

  const recordTimer = useQuestionTimer(recordTime, () => setPhase("done"));

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
        isFormData: true,
      }),
    onSuccess: (data) => {
      console.log("UPLOAD AUDIO SUCCESS RAW RESPONSE:", data);

      const uploadedKey =
        data?.response?.data?.key || data?.data?.key || data?.key;

      console.log("EXTRACTED uploadedKey:", uploadedKey);

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
    formData.append("file", blob, `repeat-sentence-${Date.now()}.webm`);

    uploadAudioCall.mutate(formData);
  };

  const instructions =
    phase === "listen"
      ? "You will hear a sentence. Please repeat the sentence exactly as you hear it."
      : "Speak now.";

  return (
    <QuestionLayout
      type="rs"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      timeRemaining={phase === "recording" ? recordTimer.formatTime() : null}
      instructions={instructions}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        {/* Original question audio */}
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
            description="The audio will play automatically. Listen carefully to repeat."
            type="info"
            showIcon
          />
        )}

        {phase === "recording" && (
          <AudioRecorder
            maxDuration={recordTime}
            onRecordingComplete={handleRecordingComplete}
          />
        )}

        {phase === "done" && (
          <>
            <Alert
              message="Recording Complete"
              description="Your response has been recorded. You can now listen to your recording."
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
                <Text type="secondary">Recording captured locally.</Text>
              )}
          </>
        )}
      </Space>
    </QuestionLayout>
  );
};

export default RepeatSentence;
