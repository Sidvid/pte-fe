import React, { useEffect, useState } from "react";
import { Typography, Card, Space, Alert, message } from "antd";
import QuestionLayout from "../QuestionLayout";
import AudioRecorder from "../AudioRecorder";
import { useQuestionTimer } from "../../../hooks/useQuestionTimer";
import { useMutation } from "@tanstack/react-query";
import useHttp from "@/hooks/use-http";

const { Paragraph, Text } = Typography;

const ReadAloud = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
  prepTime = 30,
  recordTime = 40,
  isPaused = false,
}) => {
  const [phase, setPhase] = useState("prep"); // prep | recording | done
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState("");
  const [uploadedRecordingKey, setUploadedRecordingKey] = useState("");

  const { sendRequest } = useHttp({ type: "auth" });

  const prepTimer = useQuestionTimer(prepTime, () => setPhase("recording"));
  const recordTimer = useQuestionTimer(recordTime, () => setPhase("done"));

  useEffect(() => {
    prepTimer.start();
  }, []);

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

  const handleRecordingComplete = (blob, url) => {
    setAudioBlob(blob);
    setRecordedAudioUrl(url);
    setPhase("done");

    const formData = new FormData();
    formData.append("file", blob, `read-aloud-${Date.now()}.webm`);
    formData.append("question_type", "ra");

    uploadAudioCall.mutate(formData);
  };

  const instructions =
    phase === "prep"
      ? "Look at the text below. In 30 seconds, you must read this text aloud as naturally and clearly as possible."
      : "Begin speaking now.";

  return (
    <QuestionLayout
      type="ra"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      timeRemaining={
        phase === "prep" ? prepTimer.formatTime() : recordTimer.formatTime()
      }
      instructions={instructions}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Card style={{ background: "#fffbe6", border: "1px solid #ffe58f" }}>
          <Paragraph style={{ fontSize: "18px", lineHeight: "1.8", margin: 0 }}>
            {question.data?.text}
          </Paragraph>
        </Card>

        {phase === "prep" && (
          <Alert
            message="Preparation Time"
            description="Read the text silently. Recording will begin automatically."
            type="info"
            showIcon
          />
        )}

        {phase !== "prep" && (
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

export default ReadAloud;
