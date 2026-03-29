import React, { useEffect, useMemo, useState } from "react";
import { Card, Select } from "antd";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../../../hooks/useQuestionTimer";

const { Option } = Select;

const ReadingFillBlanks = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
  timeLimit = 120,
}) => {
  const timer = useQuestionTimer(timeLimit, () => {
    onResponse?.({
      type: "inputs",
      inputs: answers,
    });
  });

  useEffect(() => {
    timer.start();
  }, []);

  const text = question?.data?.text || "";
  const choices = question?.data?.choices || [];

  // split text by backend placeholder format: {{}}
  const segments = useMemo(() => {
    return text.split("{{}}");
  }, [text]);

  const blankCount = Math.max(segments.length - 1, 0);

  const [answers, setAnswers] = useState(Array(blankCount).fill(""));

  const handleSelect = (blankIndex, value) => {
    const updated = [...answers];
    updated[blankIndex] = value;
    setAnswers(updated);

    onResponse?.({
      type: "inputs",
      inputs: updated,
    });
  };

  return (
    <QuestionLayout
      type="fib_r"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      timeRemaining={timer.formatTime()}
      instructions="In the text below some words are missing. Drag words from the box below to the appropriate place in the text."
    >
      <Card style={{ background: "#fafafa" }}>
        <div style={{ fontSize: 16, lineHeight: "2.6" }}>
          {segments.map((segment, index) => (
            <React.Fragment key={index}>
              <span>{segment}</span>

              {index < blankCount && (
                <Select
                  value={answers[index] || undefined}
                  placeholder="Select"
                  style={{
                    minWidth: 160,
                    margin: "0 8px",
                    display: "inline-block",
                  }}
                  onChange={(value) => handleSelect(index, value)}
                >
                  {choices.map((choice) => (
                    <Option key={choice} value={choice}>
                      {choice}
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
