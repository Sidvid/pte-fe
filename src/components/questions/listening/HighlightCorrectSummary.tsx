import React, { useState } from "react";
import { Radio, Space, Card, Alert } from "antd";
import QuestionLayout from "../QuestionLayout";
import AudioPlayer from "../AudioPlayer";

const HighlightCorrectSummary = ({
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
    onResponse?.({
      type: "selected",
      selected: value,
    });
  };

  const options = question.data?.options || question.data?.choices || [];

  return (
    <QuestionLayout
      type="hcs"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      instructions="Listen to the recording and choose the paragraph that best relates to the recording."
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
            message="Listen to the Audio"
            description="Select the best summary after the recording ends."
            type="info"
            showIcon
          />
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
                  <span style={{ fontSize: "15px", lineHeight: "1.8" }}>
                    {option}
                  </span>
                </Radio>
              </Card>
            ))}
          </Space>
        </Radio.Group>
      </Space>
    </QuestionLayout>
  );
};

export default HighlightCorrectSummary;
