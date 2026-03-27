import React, { useEffect, useMemo, useState } from "react";
import { Select, Space, Typography, Card } from "antd";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../../../hooks/useQuestionTimer";

const { Text } = Typography;
const { Option } = Select;

const ReadingFillBlanks = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
  timeLimit = 120,
}) => {
  const timer = useQuestionTimer(timeLimit, () => {
    onResponse?.({ inputs: answers });
  });

  useEffect(() => {
    timer.start();
  }, []);

  const text = question.data?.text || "";
  const blanks = question.data?.blanks || [];
  const options = question.data?.options || [];

  const [answers, setAnswers] = useState(Array(blanks.length).fill(""));

  const segments = useMemo(() => {
    // If backend uses _____ placeholders
    return text.split("_____");
  }, [text]);

  const handleSelect = (blankIndex, value) => {
    const updated = [...answers];
    updated[blankIndex] = value;
    setAnswers(updated);
    onResponse?({
      question_id: question?.id,
      dts_id: localStorage.getItem("current_dts_id"),
      response: {
        type: "inputs",
        inputs: updated,
      },
    });
  };

  return (
    <QuestionLayout
      type="rfib"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      timeRemaining={timer.formatTime()}
      instructions="Fill in the blanks in the text below."
    >
      <Card style={{ background: "#fafafa" }}>
        <div style={{ fontSize: 16, lineHeight: "2.4" }}>
          {segments.map((segment, index) => (
            <React.Fragment key={index}>
              <span>{segment}</span>
              {index < blanks.length && (
                <Select
                  value={answers[index] || undefined}
                  placeholder="Select"
                  style={{ minWidth: 140, margin: "0 8px" }}
                  onChange={(value) => handleSelect(index, value)}
                >
                  {(options[index] || []).map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>
    </QuestionLayout>
  );
};

export default ReadingFillBlanks;
