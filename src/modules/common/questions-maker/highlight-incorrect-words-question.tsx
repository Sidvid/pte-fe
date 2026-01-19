import { Input, Button, Tag, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useCreateQuestion } from "@/store/use-create-question";

const { TextArea } = Input;

function HighlightIncorrectWordsQuestion() {
  const [text, setText] = useState<string>("");
  const [incorrectWords, setIncorrectWords] = useState<string[]>([]);
  const [newWord, setNewWord] = useState<string>("");
  
  const { setCreateQuestionData, questionData } = useCreateQuestion();

  useEffect(() => {
    const questionPayload = {
      text,
      incorrectWords,
    };
    
    setCreateQuestionData({ 
      text: JSON.stringify(questionPayload), 
      type: "text",
      extra: JSON.stringify({ incorrectWords })
    });
  }, [text, incorrectWords]);

  useEffect(() => {
    if (!questionData.text) {
      setText("");
      setIncorrectWords([]);
      setNewWord("");
    }
  }, [questionData.text]);

  const handleAddWord = () => {
    if (newWord.trim() && !incorrectWords.includes(newWord.trim())) {
      setIncorrectWords([...incorrectWords, newWord.trim()]);
      setNewWord("");
    }
  };

  const handleRemoveWord = (index: number) => {
    setIncorrectWords(incorrectWords.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="mb-2">
        <label className="block text-base font-bold text-gray-800 mb-2">
          Audio Transcript/Script
        </label>
        <p className="text-sm text-gray-600">
          Students will listen to the audio and identify incorrect words in this transcript.
        </p>
      </div>
      
      <TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter the full transcript of the audio..."
        rows={10}
        showCount
        maxLength={2000}
        className="text-base p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
      />
      
      <div className="mt-6">
        <label className="block text-base font-bold text-gray-800 mb-2">
          Incorrect Words to Highlight
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Add words that are pronounced incorrectly in the audio. Students need to identify these.
        </p>
        
        <Space.Compact style={{ width: '100%' }}>
          <Input
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onPressEnter={handleAddWord}
            placeholder="Enter an incorrect word..."
            className="flex-1 text-base p-2"
          />
          <Button 
            type="primary" 
            onClick={handleAddWord}
            className="h-10"
          >
            Add Word
          </Button>
        </Space.Compact>
        
        <div className="flex flex-wrap gap-2 p-4 bg-red-50 border border-red-200 rounded-lg min-h-[60px] mt-3">
          {incorrectWords.length === 0 ? (
            <p className="text-gray-400 text-base">No incorrect words added yet. Add words that appear incorrectly in the transcript.</p>
          ) : (
            incorrectWords.map((word, index) => (
              <Tag
                key={index}
                color="red"
                closable
                onClose={() => handleRemoveWord(index)}
                className="text-base py-2 px-3"
              >
                {word}
              </Tag>
            ))
          )}
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-base font-semibold text-gray-700 mb-2">About Highlight Incorrect Words:</p>
        <p className="text-gray-600">
          Students listen to an audio with mispronounced words and highlight the incorrect words in the transcript.
          Typically 10-15 words to identify in a 15-20 second audio clip.
        </p>
      </div>
    </div>
  );
}

export default HighlightIncorrectWordsQuestion;
