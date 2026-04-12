import React, { useState } from "react";
import { Checkbox, Space, Typography, Card, Alert } from "antd";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../../../hooks/useQuestionTimer";

const { Paragraph } = Typography;

const MCQMultipleAnswer = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
  timeLimit = 120,
  isOnlyViewQuestions,
  type = "rmcma", // rmcma or lmcma
}) => {
  const [selected, setSelected] = useState([]);

  const timer = useQuestionTimer(timeLimit, () => {
    onResponse?.({ selected });
  });

  React.useEffect(() => {
    timer.start();
  }, []);

  const handleChange = (index) => {
    const newSelected = selected.includes(index)
      ? selected.filter((i) => i !== index)
      : [...selected, index];

    setSelected(newSelected);
    onResponse?.({
      type: "selected",
      selected: newSelected,
    });
  };

  const options = question.data?.options || [];

  return (
    <QuestionLayout
      type={type}
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      timeRemaining={timer.formatTime()}
      isOnlyViewQuestions={isOnlyViewQuestions}
      instructions="Read the text and answer the question by selecting all the correct responses."
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        {/* Passage */}
        {question.data?.text && (
          <Card style={{ maxHeight: "250px", overflow: "auto" }}>
            <Paragraph
              style={{ fontSize: "15px", lineHeight: "1.8", margin: 0 }}
            >
              {question.data.text}
            </Paragraph>
          </Card>
        )}

        {/* Question */}
        {question.data?.question && (
          <Paragraph strong style={{ fontSize: "16px" }}>
            {question.data.question}
          </Paragraph>
        )}

        <Alert
          message="Select all correct answers"
          type="info"
          showIcon
          style={{ marginBottom: "8px" }}
        />

        {/* Options */}
        <Space direction="vertical" style={{ width: "100%" }}>
          {options.map((option, index) => (
            <Card
              key={index}
              size="small"
              style={{
                cursor: "pointer",
                border: selected.includes(index)
                  ? "2px solid #1890ff"
                  : "1px solid #d9d9d9",
                background: selected.includes(index) ? "#e6f7ff" : "#fff",
              }}
              onClick={() => handleChange(index)}
            >
              <Checkbox checked={selected.includes(index)}>
                <span style={{ fontSize: "15px" }}>{option}</span>
              </Checkbox>
            </Card>
          ))}
        </Space>

        <Paragraph type="secondary">
          Selected: {selected.length} option(s)
        </Paragraph>
      </Space>
    </QuestionLayout>
  );
};

export default MCQMultipleAnswer;
