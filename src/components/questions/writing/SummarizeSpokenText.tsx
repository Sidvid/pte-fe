import React, { useEffect, useState } from "react";
import { Input, Space, Typography, Alert } from "antd";
import QuestionLayout from "../QuestionLayout";
import AudioPlayer from "../AudioPlayer";
import { useQuestionTimer } from "../../../hooks/useQuestionTimer";

const { TextArea } = Input;
const { Text } = Typography;

const SummarizeSpokenText = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
  writingTime = 10 * 60,
  isOnlyViewQuestions,
}) => {
  const [phase, setPhase] = useState("listen"); // listen | write
  const [text, setText] = useState("");

  const timer = useQuestionTimer(writingTime, () => {
    onResponse?.({ text });
  });

  const handleAudioComplete = () => {
    setPhase("write");
    timer.start();
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);

    onResponse?.({
      type: "input",
      input: value,
    });
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <QuestionLayout
      type="sst"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      timeRemaining={phase === "write" ? timer.formatTime() : null}
      isOnlyViewQuestions={isOnlyViewQuestions}
      instructions="You will hear a short lecture. Write a summary for a fellow student who was not present."
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <AudioPlayer
          src={question.data?.audio}
          autoPlay={true}
          maxPlays={1}
          onPlayComplete={handleAudioComplete}
        />

        {phase === "listen" && (
          <Alert
            message="Listen Carefully"
            description="The audio will play automatically. After it ends, write your summary."
            type="info"
            showIcon
          />
        )}

        {phase === "write" && (
          <>
            <Alert
              message="Write Summary"
              description="Summarize the lecture in your own words."
              type="warning"
              showIcon
            />

            <TextArea
              value={text}
              onChange={handleChange}
              rows={8}
              placeholder="Write your summary here..."
              style={{ fontSize: "16px", lineHeight: "1.8" }}
              autoFocus
            />

            <Space>
              <Text>Word Count:</Text>
              <Text strong>{wordCount}</Text>
            </Space>
          </>
        )}
      </Space>
    </QuestionLayout>
  );
};

export default SummarizeSpokenText;
