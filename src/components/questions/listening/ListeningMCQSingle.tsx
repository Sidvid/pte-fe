import React, { useState } from "react";
import { Radio, Space, Typography, Card, Alert } from "antd";
import QuestionLayout from "../QuestionLayout";
import AudioPlayer from "../AudioPlayer";

const { Paragraph } = Typography;

const ListeningMCQSingle = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
}) => {
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState("listen");

  const handleAudioComplete = () => {
    setPhase("answer");
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSelected(value);
    onResponse?({
      question_id: question?.id,
      dts_id: localStorage.getItem("current_dts_id"),
      response: {
        type: "selected",
        selected: value,
      },
    });
  };

  const options = question.data?.options || question.data?.choices || [];

  return (
    <QuestionLayout
      type="lmcsa"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      instructions="Listen to the recording and answer the multiple-choice question by selecting the correct response."
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
            description="The options will be available after the audio ends."
            type="info"
            showIcon
          />
        )}

        {question.data?.question && (
          <Paragraph strong style={{ fontSize: "16px" }}>
            {question.data.question}
          </Paragraph>
        )}

        <Radio.Group
          onChange={handleChange}
          value={selected}
          style={{ width: "100%" }}
          disabled={phase !== "answer"}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            {options.map((option, index) => (
              <Card
                key={index}
                size="small"
                style={{
                  cursor: phase === "answer" ? "pointer" : "not-allowed",
                  border:
                    selected === index
                      ? "2px solid #1890ff"
                      : "1px solid #d9d9d9",
                  background: selected === index ? "#e6f7ff" : "#fff",
                  opacity: phase === "answer" ? 1 : 0.7,
                }}
                onClick={() =>
                  phase === "answer" &&
                  handleChange({ target: { value: index } })
                }
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

export default ListeningMCQSingle;
