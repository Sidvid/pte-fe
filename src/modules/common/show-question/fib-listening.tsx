import { Button, Tag } from "antd";
import React from "react";
import { DeleteOutlined, PlayCircleOutlined } from "@ant-design/icons";

interface FibListeningProps {
  questions: any[];
  onDelete?: (id: string) => void;
}

function FibListening({ questions, onDelete }: FibListeningProps) {
  const getAudioUrl = (audioPath: string) => {
    const baseUrl = 'http://localhost:3000';
    return `${baseUrl}/${audioPath}`;
  };

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
        const audioPath = itemData.audio || "";
        const answers = extraData?.answers || [];

        return (
          <div
            key={item.id}
            className="text-black border border-dashed border-indigo-700 bg-indigo-50 p-[6px] rounded-2xl f14 relative"
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
            
            {audioPath && (
              <div className="mb-4">
                <p className="text-gray-600 mb-2 flex items-center gap-2">
                  <PlayCircleOutlined /> Audio:
                </p>
                <div className="bg-white p-4 rounded-lg">
                  <audio
                    controls
                    src={getAudioUrl(audioPath)}
                    className="w-full"
                    onError={(e) => {
                      console.error('Failed to load audio:', audioPath);
                    }}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Audio Path: {audioPath}
                </p>
              </div>
            )}

            <div className="mb-4">
              <p className="text-gray-600 mb-2">Transcript with Answers:</p>
              <div className="bg-white p-4 rounded border border-gray-200 leading-relaxed">
                {renderTextWithBlanks(text, answers)}
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

export default FibListening;
