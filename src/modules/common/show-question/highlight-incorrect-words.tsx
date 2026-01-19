import { Button, Tag } from "antd";
import React from "react";
import { DeleteOutlined } from "@ant-design/icons";

interface HighlightIncorrectWordsProps {
  questions: any[];
  onDelete?: (id: string) => void;
}

function HighlightIncorrectWords({ questions, onDelete }: HighlightIncorrectWordsProps) {
  const renderTextWithHighlightedWords = (text: string, incorrectWords: string[]) => {
    const words = text.split(/\s+/);
    
    return words.map((word, index) => {
      const cleanWord = word.replace(/[^\w\s]/gi, '').toLowerCase();
      const isIncorrect = incorrectWords.some(incorrectWord => 
        cleanWord === incorrectWord.toLowerCase()
      );
      
      return (
        <span
          key={index}
          className={`${isIncorrect ? 'bg-red-200 text-red-800 font-bold underline' : 'text-gray-700'} mx-1`}
        >
          {word}{index < words.length - 1 ? ' ' : ''}
        </span>
      );
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
        
        const text = itemData.text || itemData.script || "";
        const incorrectWords = extraData?.incorrectWords || itemData.incorrectWords || [];

        return (
          <div
            key={item.id}
            className="text-black border border-dashed border-pink-700 bg-pink-50 p-[6px] rounded-2xl f14 relative"
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
              <p className="text-gray-600 mb-2">Transcript with Incorrect Words Highlighted:</p>
              <div className="bg-white p-4 rounded border border-gray-200 leading-relaxed">
                {renderTextWithHighlightedWords(text, incorrectWords)}
              </div>
            </div>

            <div>
              <p className="text-gray-600 mb-2">Incorrect Words to Identify:</p>
              <div className="flex flex-wrap gap-2 p-3 bg-red-50 border border-red-200 rounded">
                {incorrectWords.length === 0 ? (
                  <p className="text-gray-400 text-sm">No incorrect words specified</p>
                ) : (
                  incorrectWords.map((word: string, idx: number) => (
                    <Tag key={idx} color="red" className="text-base py-1">
                      {word}
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

export default HighlightIncorrectWords;
