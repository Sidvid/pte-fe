import React, { useEffect, useState } from "react";
import { Space, Alert, Card, Image, Typography } from "antd";
import QuestionLayout from "../QuestionLayout";
import AudioPlayer from "../AudioPlayer";
import AudioRecorder from "../AudioRecorder";
import { useQuestionTimer } from "../../../hooks/useQuestionTimer";

const { Text } = Typography;

const RetellLecture = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
  recordTime = 40,
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
    setTimeout(() => setPhase("recording"), 1000);
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
      ? "You will hear a lecture. After listening to the lecture, please retell what you have just heard in your own words."
      : "Begin speaking now.";

  return (
    <QuestionLayout
      type="rl"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      timeRemaining={phase === "recording" ? recordTimer.formatTime() : null}
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
          <Alert
            message="Recording Complete"
            description="Your retell response has been recorded."
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

export default RetellLecture;
