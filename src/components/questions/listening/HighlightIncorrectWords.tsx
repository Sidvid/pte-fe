import React, { useState } from "react";
import { Space, Alert, Typography, Card } from "antd";
import QuestionLayout from "../QuestionLayout";
import AudioPlayer from "../AudioPlayer";

const { Text } = Typography;

const HighlightIncorrectWords = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
}) => {
  const [phase, setPhase] = useState("listen");
  const [selectedWords, setSelectedWords] = useState([]);

  const words = question.data?.text?.split(/\s+/) || [];

  const handleAudioComplete = () => {
    setPhase("select");
  };

  const handleWordClick = (index) => {
    if (phase !== "select") return;

    const updated = selectedWords.includes(index)
      ? selectedWords.filter((i) => i !== index)
      : [...selectedWords, index];

    setSelectedWords(updated);
    onResponse?.({
      question_id: question?.id,
      dts_id: localStorage.getItem("current_dts_id"),
      response: {
        type: "inputs",
        inputs: updated.map((i) => i.toString()),
      },
    });
  };

  const getWordStyle = (index) => {
    const isSelected = selectedWords.includes(index);

    return {
      padding: "4px 8px",
      margin: "4px",
      borderRadius: "4px",
      cursor: phase === "select" ? "pointer" : "default",
      display: "inline-block",
      transition: "all 0.2s",
      background: isSelected ? "#ff4d4f" : "transparent",
      color: isSelected ? "#fff" : "#000",
      border: isSelected ? "2px solid #ff4d4f" : "2px solid transparent",
      userSelect: "none",
    };
  };

  return (
    <QuestionLayout
      type="hiw"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      instructions="Listen to the recording while reading the transcript. Click on the words that are different from the audio."
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
            description="After the audio ends, select the incorrect words."
            type="info"
            showIcon
          />
        )}

        {phase === "select" && (
          <Alert
            message="Select Incorrect Words"
            description={`Selected: ${selectedWords.length} word(s)`}
            type="warning"
            showIcon
          />
        )}

        <Card style={{ background: "#fafafa", minHeight: "150px" }}>
          <div
            style={{
              fontSize: "18px",
              lineHeight: "2.5",
              textAlign: "justify",
            }}
          >
            {words.map((word, index) => (
              <span
                key={index}
                onClick={() => handleWordClick(index)}
                style={getWordStyle(index)}
              >
                {word}
              </span>
            ))}
          </div>
        </Card>

        {selectedWords.length > 0 && (
          <Card size="small" title="Selected Words">
            <Space wrap>
              {selectedWords.map((index) => (
                <Text
                  key={index}
                  onClick={() => handleWordClick(index)}
                  style={{
                    background: "#ff4d4f",
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {words[index]}
                </Text>
              ))}
            </Space>
          </Card>
        )}
      </Space>
    </QuestionLayout>
  );
};

export default HighlightIncorrectWords;
