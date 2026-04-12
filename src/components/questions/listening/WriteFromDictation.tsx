import React, { useState } from "react";
import { Input, Space, Alert, Typography } from "antd";
import QuestionLayout from "../QuestionLayout";
import AudioPlayer from "../AudioPlayer";
import { useQuestionTimer } from "../../../hooks/useQuestionTimer";

const { TextArea } = Input;
const { Text } = Typography;

const WriteFromDictation = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
  timeLimit = 60,
  isOnlyViewQuestions,
}) => {
  const [phase, setPhase] = useState("listen"); // listen | write
  const [text, setText] = useState("");

  const timer = useQuestionTimer(timeLimit, () => {
    onResponse?.({ text });
  });

  const handleAudioComplete = () => {
    setPhase("write");
    timer.start();
  };

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    onResponse?.({
      type: "input",
      input: newText,
    });
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <QuestionLayout
      type="wfd"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      timeRemaining={phase === "write" ? timer.formatTime() : null}
      isOnlyViewQuestions={isOnlyViewQuestions}
      instructions="You will hear a sentence. Type the sentence in the box below exactly as you hear it."
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        {/* Audio Player */}
        <AudioPlayer
          src={question.data?.audio}
          autoPlay={true}
          maxPlays={1}
          onPlayComplete={handleAudioComplete}
        />

        {/* Phase Indicator */}
        {phase === "listen" && (
          <Alert
            message="Listen Carefully"
            description="The audio will play automatically. Listen carefully and remember the sentence."
            type="info"
            showIcon
          />
        )}

        {/* Text Input */}
        {phase === "write" && (
          <>
            <TextArea
              value={text}
              onChange={handleChange}
              placeholder="Type the sentence here..."
              rows={3}
              style={{ fontSize: "16px" }}
              autoFocus
            />
            <Text type="secondary">Word count: {wordCount}</Text>
          </>
        )}
      </Space>
    </QuestionLayout>
  );
};

export default WriteFromDictation;
