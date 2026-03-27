import React, { useState } from "react";
import { Radio, Space, Typography, Card } from "antd";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../../../hooks/useQuestionTimer";

const { Paragraph } = Typography;

const MCQSingleAnswer = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
  timeLimit = 120,
  type = "rmcsa", // rmcsa or lmcsa
}) => {
  const [selected, setSelected] = useState(null);

  const timer = useQuestionTimer(timeLimit, () => {
    onResponse?.({ selected });
  });

  React.useEffect(() => {
    timer.start();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSelected(value);
    onResponse?.({
      question_id: question?.id,
      dts_id: localStorage.getItem("current_dts_id"),
      response: {
        type: "selected",
        selected: value,
      },
    });
  };

  const options = question.data?.options || [];

  return (
    <QuestionLayout
      type={type}
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      timeRemaining={timer.formatTime()}
      instructions="Read the text and answer the question by selecting the correct response."
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

        {/* Options */}
        <Radio.Group
          onChange={handleChange}
          value={selected}
          style={{ width: "100%" }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            {options.map((option, index) => (
              <Card
                key={index}
                size="small"
                style={{
                  cursor: "pointer",
                  border:
                    selected === index
                      ? "2px solid #1890ff"
                      : "1px solid #d9d9d9",
                  background: selected === index ? "#e6f7ff" : "#fff",
                }}
                onClick={() => handleChange({ target: { value: index } })}
              >
                <Radio value={index}>
                  <span style={{ fontSize: "15px" }}>{option}</span>
                </Radio>
              </Card>
            ))}
          </Space>
        </Radio.Group>
      </Space>
    </QuestionLayout>
  );
};

export default MCQSingleAnswer;
