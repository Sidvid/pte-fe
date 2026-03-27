import React, { useEffect, useMemo, useState } from "react";
import { Select, Card } from "antd";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../../../hooks/useQuestionTimer";

const { Option } = Select;

const parseFibRwText = (text) => {
  const result = [];
  const regex = /\{\{(.*?)\}\}/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const beforeText = text.slice(lastIndex, match.index);
    if (beforeText) {
      result.push({ type: "text", value: beforeText });
    }

    const options = match[1]
      .split("}{")
      .map((opt) => opt.replace(/^\{|\}$/g, ""));

    result.push({
      type: "blank",
      options,
    });

    lastIndex = regex.lastIndex;
  }

  const remainingText = text.slice(lastIndex);
  if (remainingText) {
    result.push({ type: "text", value: remainingText });
  }

  return result;
};

const ReadingWritingFillBlanks = ({
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

  const parsed = useMemo(() => {
    return parseFibRwText(question.data?.text || "");
  }, [question.data?.text]);

  const blankCount = parsed.filter((item) => item.type === "blank").length;
  const [answers, setAnswers] = useState(Array(blankCount).fill(""));

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

  let blankCursor = 0;

  return (
    <QuestionLayout
      type="rwfib"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      timeRemaining={timer.formatTime()}
      instructions="Below is a text with blanks. Select the appropriate words from the dropdown list."
    >
      <Card style={{ background: "#fafafa" }}>
        <div style={{ fontSize: 16, lineHeight: "2.4" }}>
          {parsed.map((item, index) => {
            if (item.type === "text") {
              return <span key={index}>{item.value}</span>;
            }

            const currentBlankIndex = blankCursor++;
            return (
              <Select
                key={index}
                value={answers[currentBlankIndex] || undefined}
                placeholder="Select"
                style={{ minWidth: 150, margin: "0 8px" }}
                onChange={(value) => handleSelect(currentBlankIndex, value)}
              >
                {item.options.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            );
          })}
        </div>
      </Card>
    </QuestionLayout>
  );
};

export default ReadingWritingFillBlanks;
