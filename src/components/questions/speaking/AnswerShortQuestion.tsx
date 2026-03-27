import React, { useEffect, useState } from "react";
import { Space, Alert, Typography } from "antd";
import QuestionLayout from "../QuestionLayout";
import AudioPlayer from "../AudioPlayer";
import AudioRecorder from "../AudioRecorder";
import { useQuestionTimer } from "../../../hooks/useQuestionTimer";

const { Text } = Typography;

const AnswerShortQuestion = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
  recordTime = 10,
}) => {
  const [phase, setPhase] = useState("listen"); // listen | recording | done
  const [audioBlob, setAudioBlob] = useState(null);

  const recordTimer = useQuestionTimer(recordTime, () => {
    setPhase("done");
  });

  useEffect(() => {
    if (phase === "recording") {
      recordTimer.start();
    }
  }, [phase]);

  const handleAudioComplete = () => {
    setTimeout(() => setPhase("recording"), 500);
  };

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
    phase === "listen"
      ? "You will hear a question. Please give a simple and short answer."
      : "Answer now.";

  return (
    <QuestionLayout
      type="asq"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      timeRemaining={phase === "recording" ? recordTimer.formatTime() : null}
      instructions={instructions}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <AudioPlayer
          src={question.data?.audio}
          autoPlay={true}
          maxPlays={1}
          onPlayComplete={handleAudioComplete}
          disabled={phase !== "listen"}
        />

        {phase === "listen" && (
          <Alert
            message="Listen to the Question"
            description="The audio will play automatically. Listen carefully and prepare a short answer."
            type="info"
            showIcon
          />
        )}

        {phase === "recording" && (
          <Alert
            message="Give a Short Answer"
            description="Answer in one or a few words."
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
          <Alert
            message="Recording Complete"
            description="Your short answer has been recorded."
            type="success"
            showIcon
          />
        )}

        {audioBlob && (
          <Text type="secondary">Response captured successfully.</Text>
        )}
      </Space>
    </QuestionLayout>
  );
};

export default AnswerShortQuestion;
