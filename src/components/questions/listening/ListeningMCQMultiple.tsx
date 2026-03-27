import React, { useState } from "react";
import { Checkbox, Space, Typography, Card, Alert } from "antd";
import QuestionLayout from "../QuestionLayout";
import AudioPlayer from "../AudioPlayer";

const { Paragraph, Text } = Typography;

const ListeningMCQMultiple = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
}) => {
  const [selected, setSelected] = useState([]);
  const [phase, setPhase] = useState("listen");

  const handleAudioComplete = () => {
    setPhase("answer");
  };

  const handleToggle = (index) => {
    if (phase !== "answer") return;

    const updated = selected.includes(index)
      ? selected.filter((i) => i !== index)
      : [...selected, index];

    setSelected(updated);
    onResponse?({
      question_id: question?.id,
      dts_id: localStorage.getItem("current_dts_id"),
      response: {
        type: "selected",
        selected: updated,
      },
    });
  };

  const options = question.data?.options || question.data?.choices || [];

  return (
    <QuestionLayout
      type="lmcma"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      instructions="Listen to the recording and answer the question by selecting all the correct responses."
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
            message="Listen First"
            description="You can select answers after the audio ends."
            type="info"
            showIcon
          />
        )}

        {question.data?.question && (
          <Paragraph strong style={{ fontSize: "16px" }}>
            {question.data.question}
          </Paragraph>
        )}

        <Alert message="Select all correct answers" type="warning" showIcon />

        <Space direction="vertical" style={{ width: "100%" }}>
          {options.map((option, index) => (
            <Card
              key={index}
              size="small"
              style={{
                cursor: phase === "answer" ? "pointer" : "not-allowed",
                border: selected.includes(index)
                  ? "2px solid #1890ff"
                  : "1px solid #d9d9d9",
                background: selected.includes(index) ? "#e6f7ff" : "#fff",
                opacity: phase === "answer" ? 1 : 0.7,
              }}
              onClick={() => handleToggle(index)}
            >
              <Checkbox checked={selected.includes(index)}>
                <span style={{ fontSize: "15px" }}>{option}</span>
              </Checkbox>
            </Card>
          ))}
        </Space>

        <Text type="secondary">Selected: {selected.length} option(s)</Text>
      </Space>
    </QuestionLayout>
  );
};

export default ListeningMCQMultiple;
