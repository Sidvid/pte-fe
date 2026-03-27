import React, { useState } from "react";
import { Typography, Card, Space, Alert } from "antd";
import QuestionLayout from "../QuestionLayout";
import AudioRecorder from "../AudioRecorder";
import { useQuestionTimer } from "../../../hooks/useQuestionTimer";

const { Paragraph } = Typography;

const ReadAloud = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
  prepTime = 30,
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
        {/* Text to Read */}
        <Card style={{ background: "#fffbe6", border: "1px solid #ffe58f" }}>
          <Paragraph style={{ fontSize: "18px", lineHeight: "1.8", margin: 0 }}>
            {question.data?.text}
          </Paragraph>
        </Card>

        {/* Phase Indicator */}
        {phase === "prep" && (
          <Alert
            message="Preparation Time"
            description="Read the text silently. Recording will begin automatically."
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

export default ReadAloud;
