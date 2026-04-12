import React, { useEffect, useState } from "react";
import { Input, Space, Typography, Card, Progress, Alert } from "antd";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../../../hooks/useQuestionTimer";

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

const WriteEssay = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
  timeLimit = 20 * 60,
  isOnlyViewQuestions,
}) => {
  const [text, setText] = useState("");

  const timer = useQuestionTimer(timeLimit, () => {
    onResponse?.({ text });
  });

  useEffect(() => {
    timer.start();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    onResponse?.({
      type: "input",
      input: value,
    });
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const minWords = 200;
  const maxWords = 300;

  const getColor = () => {
    if (wordCount < minWords) return "#faad14";
    if (wordCount > maxWords) return "#ff4d4f";
    return "#52c41a";
  };

  return (
    <QuestionLayout
      type="we"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      timeRemaining={timer.formatTime()}
      isOnlyViewQuestions={isOnlyViewQuestions}
      instructions="You will have 20 minutes to plan, write and revise an essay about the topic below."
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Alert
          message="Essay Guidelines"
          description="Write between 200 and 300 words. Focus on content, structure, grammar, and vocabulary."
          type="info"
          showIcon
        />

        <Card style={{ background: "#f6ffed", border: "1px solid #b7eb8f" }}>
          <Paragraph style={{ fontSize: "16px", margin: 0 }}>
            {question.data?.prompt || question.data?.text}
          </Paragraph>
        </Card>

        <TextArea
          value={text}
          onChange={handleChange}
          rows={12}
          placeholder="Write your essay here..."
          style={{ fontSize: "16px", lineHeight: "1.8" }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space>
            <Text>Word Count:</Text>
            <Text strong style={{ color: getColor(), fontSize: "18px" }}>
              {wordCount}
            </Text>
            <Text type="secondary">
              Recommended: {minWords}-{maxWords} words
            </Text>
          </Space>

          <Progress
            percent={Math.min((wordCount / maxWords) * 100, 100)}
            showInfo={false}
            strokeColor={getColor()}
            style={{ width: 220 }}
          />
        </div>
      </Space>
    </QuestionLayout>
  );
};

export default WriteEssay;
