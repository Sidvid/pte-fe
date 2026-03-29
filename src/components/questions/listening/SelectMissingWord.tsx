import React, { useState } from "react";
import { Radio, Space, Card, Alert, Typography } from "antd";
import QuestionLayout from "../QuestionLayout";
import AudioPlayer from "../AudioPlayer";

const { Text } = Typography;

const SelectMissingWord = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
}) => {
  const [phase, setPhase] = useState("listen"); // listen | answer
  const [selected, setSelected] = useState(null);

  const choices = question?.data?.choices || question?.data?.options || [];

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

  return (
    <QuestionLayout
      type="smw"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      instructions="You will hear a recording about an academic subject. At the end of the recording, the last word or group of words has been replaced by a beep. Select the correct option to complete the recording."
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <AudioPlayer
          src={question?.data?.audio}
          autoPlay={true}
          maxPlays={1}
          onPlayComplete={handleAudioComplete}
        />

        {phase === "listen" && (
          <Alert
            type="info"
            showIcon
            message="Listen carefully"
            description="The options will be available after the audio finishes."
          />
        )}

        {phase === "answer" && (
          <Alert
            type="warning"
            showIcon
            message="Select the missing word"
            description="Choose the option that best completes the recording."
          />
        )}

        <Radio.Group
          onChange={handleChange}
          value={selected}
          style={{ width: "100%" }}
          disabled={phase !== "answer"}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            {choices.map((choice, index) => (
              <Card
                key={index}
                size="small"
                onClick={() =>
                  phase === "answer" &&
                  handleChange({ target: { value: index } })
                }
                style={{
                  cursor: phase === "answer" ? "pointer" : "not-allowed",
                  border:
                    selected === index
                      ? "2px solid #1890ff"
                      : "1px solid #d9d9d9",
                  background: selected === index ? "#e6f7ff" : "#fff",
                  opacity: phase === "answer" ? 1 : 0.7,
                }}
              >
                <Radio value={index}>
                  <span style={{ fontSize: "15px" }}>{choice}</span>
                </Radio>
              </Card>
            ))}
          </Space>
        </Radio.Group>

        {selected !== null && (
          <Text type="secondary">Selected option index: {selected}</Text>
        )}
      </Space>
    </QuestionLayout>
  );
};

export default SelectMissingWord;
