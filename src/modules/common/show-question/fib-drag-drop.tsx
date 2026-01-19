import { Button, Tag } from "antd";
import React from "react";
import { DeleteOutlined } from "@ant-design/icons";

interface FibDragDropProps {
  questions: any[];
  onDelete?: (id: string) => void;
}

function FibDragDrop({ questions, onDelete }: FibDragDropProps) {
  const renderTextWithBlanks = (text: string, answers: string[]) => {
    const parts = text.split(/(\}\{)/g);
    let blankIndex = 0;
    
    return parts.map((part, index) => {
      if (part === "}{") {
        const answer = answers[blankIndex] || "___";
        blankIndex++;
        return (
          <span
            key={index}
            className="inline-block mx-1 px-3 py-1 bg-green-100 border-2 border-green-400 rounded text-green-700 font-semibold"
          >
            {answer}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col gap-[20px]">
      {questions?.map((item) => {
        const itemData =
          typeof item.data === "string"
            ? JSON.parse(item.data)
            : item.data;
        
        const extraData = 
          typeof item.extra === "string"
            ? JSON.parse(item.extra)
            : item.extra;
        
        const text = itemData.text || "";
        const choices = itemData.choices || [];
        const answers = extraData?.answers || [];

        return (
          <div
            key={item.id}
            className="text-black border border-dashed border-orange-700 bg-orange-50 p-[6px] rounded-2xl f14 relative"
          >
            {onDelete && (
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete(item.id)}
                style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
                title="Delete question"
              />
            )}
            <p className="font-semibold mb-3">{`Question ${item.sNo}`}</p>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Text with Answers:</p>
              <div className="bg-white p-4 rounded border border-gray-200 leading-relaxed">
                {renderTextWithBlanks(text, answers)}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 mb-2">Word Choices ({choices.length}):</p>
              <div className="flex flex-wrap gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
                {choices.length === 0 ? (
                  <p className="text-gray-400 text-sm">No choices provided</p>
                ) : (
                  choices.map((choice: string, idx: number) => (
                    <Tag key={idx} color="blue" className="text-base py-1">
                      {choice}
                    </Tag>
                  ))
                )}
              </div>
            </div>

            <div>
              <p className="text-gray-600 mb-2">Correct Answers (In Order):</p>
              <div className="flex flex-wrap gap-2 p-3 bg-green-50 border border-green-200 rounded">
                {answers.length === 0 ? (
                  <p className="text-gray-400 text-sm">No answers provided</p>
                ) : (
                  answers.map((answer: string, idx: number) => (
                    <Tag key={idx} color="green" className="text-base py-1">
                      {idx + 1}. {answer}
                    </Tag>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FibDragDrop;
