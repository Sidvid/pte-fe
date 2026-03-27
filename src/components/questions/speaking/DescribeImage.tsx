import React, { useState } from "react";
import { Image, Space, Alert, Card } from "antd";
import QuestionLayout from "../QuestionLayout";
import AudioRecorder from "../AudioRecorder";
import { useQuestionTimer } from "../../../hooks/useQuestionTimer";

const DescribeImage = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
  prepTime = 25,
  recordTime = 40,
}) => {
  const [phase, setPhase] = useState("prep"); // prep | recording | done
  const [audioBlob, setAudioBlob] = useState(null);

  const prepTimer = useQuestionTimer(prepTime, () => setPhase("recording"));
  const recordTimer = useQuestionTimer(recordTime, () => setPhase("done"));

  React.useEffect(() => {
    prepTimer.start();
  }, []);

  React.useEffect(() => {
    if (phase === "recording") {
      recordTimer.start();
    }
  }, [phase]);

  const handleRecordingComplete = (blob, url) => {
    setAudioBlob(blob);
    setPhase("done");
    onResponse?.({
      question_id: question?.id,
      dts_id: localStorage.getItem("current_dts_id"),
      response: {
        type: "recording",
        recording: url,
      },
    });
  };

  const instructions =
    phase === "prep"
      ? "Look at the image below. In 25 seconds, please speak into the microphone and describe in detail what the image is showing."
      : "Begin speaking now.";

  return (
    <QuestionLayout
      type="di"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      timeRemaining={
        phase === "prep" ? prepTimer.formatTime() : recordTimer.formatTime()
      }
      instructions={instructions}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        {/* Image */}
        <Card style={{ textAlign: "center" }}>
          <Image
            src={question.data?.image}
            alt="Describe this image"
            style={{ maxHeight: "400px", objectFit: "contain" }}
            preview={false}
          />
        </Card>

        {/* Phase Indicator */}
        {phase === "prep" && (
          <Alert
            message="Preparation Time"
            description="Study the image. Recording will begin automatically."
            type="info"
            showIcon
          />
        )}

        {/* Audio Recorder */}
        {phase !== "prep" && (
          <AudioRecorder
            maxDuration={recordTime}
            onRecordingComplete={handleRecordingComplete}
            disabled={phase === "done"}
          />
        )}

        {phase === "done" && (
          <Alert
            message="Recording Complete"
            description="Your response has been recorded."
            type="success"
            showIcon
          />
        )}
      </Space>
    </QuestionLayout>
  );
};

export default DescribeImage;
