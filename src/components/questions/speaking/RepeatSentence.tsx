import React, { useState } from "react";
import { Space, Alert } from "antd";
import QuestionLayout from "../QuestionLayout";
import AudioPlayer from "../AudioPlayer";
import AudioRecorder from "../AudioRecorder";
import { useQuestionTimer } from "../../../hooks/useQuestionTimer";

const RepeatSentence = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
  recordTime = 15,
}) => {
  const [phase, setPhase] = useState("listen"); // listen | recording | done
  const [audioBlob, setAudioBlob] = useState(null);

  const recordTimer = useQuestionTimer(recordTime, () => setPhase("done"));

  const handleAudioComplete = () => {
    setTimeout(() => setPhase("recording"), 1000); // 1 second gap
  };

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
        {/* Audio Player */}
        <AudioPlayer
          src={question.data?.audio}
          autoPlay={true}
          maxPlays={1}
          onPlayComplete={handleAudioComplete}
          disabled={phase !== "listen"}
        />

        {/* Phase Indicator */}
        {phase === "listen" && (
          <Alert
            message="Listen Carefully"
            description="The audio will play automatically. Listen carefully to repeat."
            type="info"
            showIcon
          />
        )}

        {/* Audio Recorder */}
        {phase === "recording" && (
          <AudioRecorder
            maxDuration={recordTime}
            onRecordingComplete={handleRecordingComplete}
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

export default RepeatSentence;
