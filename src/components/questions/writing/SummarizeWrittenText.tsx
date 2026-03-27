import React, { useEffect, useState } from "react";
import { Input, Space, Typography, Card, Alert } from "antd";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../../../hooks/useQuestionTimer";

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

const SummarizeWrittenText = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
  timeLimit = 10 * 60,
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
      question_id: question?.id,
      dts_id: localStorage.getItem("current_dts_id"),
      response: {
        type: "input",
        input: value,
      },
    });
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <QuestionLayout
      type="swt"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      timeRemaining={timer.formatTime()}
      instructions="Read the passage below and summarize it using one sentence."
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Alert
          message="Important"
          description="Write your summary in one sentence only."
          type="info"
          showIcon
        />

        <Card
          style={{
            maxHeight: "280px",
            overflow: "auto",
            background: "#fafafa",
          }}
        >
          <Paragraph style={{ fontSize: "15px", lineHeight: "1.8", margin: 0 }}>
            {question.data?.text}
          </Paragraph>
        </Card>

        <TextArea
          value={text}
          onChange={handleChange}
          rows={5}
          placeholder="Write your one-sentence summary here..."
          style={{ fontSize: "16px", lineHeight: "1.8" }}
        />

        <Space>
          <Text>Word Count:</Text>
          <Text strong>{wordCount}</Text>
        </Space>
      </Space>
    </QuestionLayout>
  );
};

export default SummarizeWrittenText;
