import { QuestionItem } from "@/utils/model/response-models";
import React from "react";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

interface DictationPredictionProps {
  questions: QuestionItem[];
  onDelete?: (questionId: string) => void;
}

function DictationPrediction({ questions, onDelete }: DictationPredictionProps) {
  const getAudioUrl = (audioPath: string) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/${audioPath}`;
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
        
        const audioPath = itemData.audio || extraData?.audio || extraData?.transcript;
        const script = extraData?.transcript || itemData.script || itemData.text || "";

        return (
          <div 
            key={item.id} 
            className="text-black border border-dashed border-purple-700 bg-purple-50 p-[6px] rounded-2xl f14 relative"
          >
            {onDelete && (
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete(item.id)}
                style={{ position: 'absolute', top: 8, right: 8 }}
                title="Delete question"
              />
            )}
            <p>{`Question ${item.sNo}`}</p>
            
            {audioPath ? (
              <div className="mb-3">
                <p className="text-gray-600 mb-2">Dictation Audio:</p>
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
                  Audio File: {audioPath}
                </p>
              </div>
            ) : (
              <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-700 text-sm">
                  ⚠️ No audio file found for this question
                </p>
              </div>
            )}

            {script && (
              <div>
                <p className="text-gray-600 mb-2">Dictation Text:</p>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {script}
                  </p>
                </div>
              </div>
            )}

            {!script && (
              <p className="text-gray-400 text-sm italic">
                No dictation text provided
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default DictationPrediction;