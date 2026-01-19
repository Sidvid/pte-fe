import { Input } from "antd";
import React, { useEffect, useState } from "react";
import { useCreateQuestion } from "@/store/use-create-question";

const { TextArea } = Input;

function ReadAloudQuestion() {
  const [text, setText] = useState<string>("");
  const { setCreateQuestionData, questionData } = useCreateQuestion();

  useEffect(() => {
    setCreateQuestionData({ text, type: "text" });
  }, [text]);

  useEffect(() => {
    if (!questionData.text) {
      setText("");
    }
  }, [questionData.text]);

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="mb-2">
        <label className="block text-base font-bold text-gray-800 mb-2">
          Question Text
        </label>
        <p className="text-sm text-gray-600">
          Enter the passage that students need to read aloud.
        </p>
      </div>
      
      <TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter the text for Read Aloud question..."
        rows={8}
        className="text-base p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        showCount
        maxLength={500}
      />
      
      <div className="mt-2 text-sm text-gray-500">
        <span className="text-gray-400">Max: 500 characters</span>
      </div>
    </div>
  );
}

export default ReadAloudQuestion;