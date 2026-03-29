import React, { useEffect, useState } from "react";
import { Input, Space, Alert, Card, Typography } from "antd";
import QuestionLayout from "../QuestionLayout";
import AudioPlayer from "../AudioPlayer";
import { useQuestionTimer } from "../../../hooks/useQuestionTimer";

const { Text } = Typography;

const ListeningFillBlanks = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
  timeLimit = 120,
}) => {
  const [phase, setPhase] = useState("listen"); // listen | write
  const [answers, setAnswers] = useState([]);
  const text = question.data?.text || "";
  const blanksCount = (text.match(/_____/g) || []).length;

  const timer = useQuestionTimer(timeLimit, () => {
    onResponse?.({ inputs: answers });
  });

  const parts = text.split("_____");

  useEffect(() => {
    if (phase === "write") {
      timer.start();
    }
  }, [phase]);

  useEffect(() => {
    if (blanksCount > 0 && answers.length === 0) {
      setAnswers(Array(blanksCount).fill(""));
    }
  }, [blanksCount]);

  const handleAudioComplete = () => {
    setPhase("write");
  };

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
      timeRemaining={phase === "write" ? timer.formatTime() : null}
      instructions="You will hear a recording. Type the missing words in each blank."
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
            description="After the audio finishes, fill in the blanks."
            type="info"
            showIcon
          />
        )}

        <Card style={{ background: "#fafafa" }}>
          <div style={{ fontSize: "16px", lineHeight: "2.6" }}>
            {parts.map((part, index) => (
              <React.Fragment key={index}>
                <span>{part}</span>
                {index < blanksCount && (
                  <Input
                    value={answers[index] || ""}
                    onChange={(e) => handleChange(index, e.target.value)}
                    disabled={phase !== "write"}
                    placeholder={`Blank ${index + 1}`}
                    style={{
                      width: 140,
                      margin: "0 8px",
                      display: "inline-block",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </Card>

        {phase === "write" && (
          <Text type="secondary">
            Fill all blanks based on what you heard in the recording.
          </Text>
        )}
      </Space>
    </QuestionLayout>
  );
};

export default ListeningFillBlanks;
