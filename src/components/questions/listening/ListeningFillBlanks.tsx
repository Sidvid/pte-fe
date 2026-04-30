import React, { useState, useEffect } from "react";
import { Space, Card, Input, Alert, Typography } from "antd";
import AudioPlayer from "../AudioPlayer";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "@/hooks/useQuestionTimer";
const { Text } = Typography;

const ListeningFillBlanks = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
  timeLimit = 120,
  isOnlyViewQuestions,
}) => {
  const [answers, setAnswers] = useState([]);

  // PTE format usually has text with {{}} placeholders
  const text = question.data?.text || "";

  // Split text by {{}}
  const parts = text.split("{{}}");
  const blanksCount = parts.length - 1;

  // Start timer immediately in PTE
  const timer = useQuestionTimer(timeLimit, () => {
    onResponse?.({ inputs: answers });
  });

  useEffect(() => {
    timer.start();
  }, []);

  // Initialize answers array based on count
  useEffect(() => {
    if (blanksCount > 0 && answers.length === 0) {
      setAnswers(Array(blanksCount).fill(""));
    }
  }, [blanksCount]);

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
    onResponse?.({
      type: "inputs",
      inputs: updated,
    });
  };

  return (
    <QuestionLayout
      type="fib_l"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      timeRemaining={timer.formatTime()}
      isOnlyViewQuestions={isOnlyViewQuestions}
      instructions="You will hear a recording. Type the missing words in each blank."
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <AudioPlayer src={question.data?.audio} autoPlay={true} maxPlays={1} />

        <Alert
          message="Tip"
          description="You can type in the blanks while listening to the audio."
          type="info"
          showIcon
        />

        <Card style={{ background: "#fafafa" }}>
          <div style={{ fontSize: "16px", lineHeight: "3" }}>
            {parts.map((part, index) => (
              <React.Fragment key={index}>
                <span>{part}</span>
                {index < blanksCount && (
                  <Input
                    value={answers[index] || ""}
                    onChange={(e) => handleChange(index, e.target.value)}
                    placeholder={`Word ${index + 1}`}
                    // Inputs are ALWAYS enabled in PTE
                    disabled={isOnlyViewQuestions}
                    style={{
                      width: 150,
                      margin: "0 8px",
                      border: "none",
                      borderBottom: "1px solid #d9d9d9",
                      borderRadius: 0,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </Card>
      </Space>
    </QuestionLayout>
  );
};

export default ListeningFillBlanks;
