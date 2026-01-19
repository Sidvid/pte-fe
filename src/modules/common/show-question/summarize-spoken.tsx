import { Button } from "antd";
import React from "react";
import { DeleteOutlined, PlayCircleOutlined } from "@ant-design/icons";

interface SummarizeSpokenProps {
  questions: any[];
  onDelete?: (id: string) => void;
}

function SummarizeSpoken({ questions, onDelete }: SummarizeSpokenProps) {
  const getAudioUrl = (audioPath: string) => {
    const baseUrl = 'http://localhost:3000';
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
        
        const audioPath = itemData.audio;
        const script = extraData?.script || "";

        return (
          <div
            key={item.id}
            className="text-black border border-dashed border-teal-700 bg-teal-50 p-[6px] rounded-2xl f14 relative"
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
            
            {audioPath ? (
              <div className="mb-3">
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
            ) : (
              <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-700 text-sm">
                  ⚠️ No audio file found for this question
                </p>
              </div>
            )}

            {script && (
              <div>
                <p className="text-gray-600 mb-2">Script/Transcript:</p>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {script}
                  </p>
                </div>
              </div>
            )}

            {!script && (
              <p className="text-gray-400 text-sm italic">
                No script provided
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default SummarizeSpoken;
