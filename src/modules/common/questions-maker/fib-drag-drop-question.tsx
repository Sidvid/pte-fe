import { Input, Tag, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useCreateQuestion } from "@/store/use-create-question";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";

const { TextArea } = Input;

function FibDragDropQuestion() {
  const [text, setText] = useState<string>("");
  const [choices, setChoices] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [newChoice, setNewChoice] = useState<string>("");
  const [newAnswer, setNewAnswer] = useState<string>("");
  
  const { setCreateQuestionData, questionData } = useCreateQuestion();

  useEffect(() => {
    const questionPayload = {
      text,
      choices,
    };
    
    setCreateQuestionData({ 
      text: JSON.stringify(questionPayload), 
      type: "text",
      extra: JSON.stringify({ answers })
    });
  }, [text, choices, answers]);

  useEffect(() => {
    if (!questionData.text) {
      setText("");
      setChoices([]);
      setAnswers([]);
      setNewChoice("");
      setNewAnswer("");
    }
  }, [questionData.text]);

  const handleAddChoice = () => {
    if (newChoice.trim()) {
      setChoices([...choices, newChoice.trim()]);
      setNewChoice("");
    }
  };

  const handleRemoveChoice = (index: number) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  const handleAddAnswer = () => {
    if (newAnswer.trim()) {
      setAnswers([...answers, newAnswer.trim()]);
      setNewAnswer("");
    }
  };

  const handleRemoveAnswer = (index: number) => {
    setAnswers(answers.filter((_, i) => i !== index));
  };

  const blankCount = (text.match(/\}\{/g) || []).length;

  return (
    <div className="flex flex-col gap-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="mb-2">
        <label className="block text-base font-bold text-gray-800 mb-2">
          Question Text with Blanks
        </label>
        <p className="text-sm text-gray-600">
          Enter the text with blanks for students to fill using drag and drop.
        </p>
      </div>
      
      <TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text with }{ for blanks. Example: The cat }{ on the mat."
        rows={8}
        showCount
        maxLength={1000}
        className="text-base p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
      />
      <p className="text-sm text-gray-600">
        Use <code className="bg-gray-100 px-2 py-1 rounded text-sm">{'}{'} </code> to mark where blanks should appear. 
        Current blanks: <strong>{blankCount}</strong>
      </p>
      
      <div className="mt-6">
        <label className="block text-base font-bold text-gray-800 mb-2">
          Word Choices (Drag Options)
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Add word choices that students can drag to fill the blanks.
        </p>
        
        <div className="flex gap-2 mb-3">
          <Input
            value={newChoice}
            onChange={(e) => setNewChoice(e.target.value)}
            onPressEnter={handleAddChoice}
            placeholder="Enter a word choice..."
            className="flex-1 text-base p-2"
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddChoice}
            className="h-10"
          >
            Add
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg min-h-[60px]">
          {choices.length === 0 ? (
            <p className="text-gray-400 text-base">No choices added yet. Add word options above.</p>
          ) : (
            choices.map((choice, index) => (
              <Tag
                key={index}
                closable
                onClose={() => handleRemoveChoice(index)}
                className="text-base py-2 px-3"
              >
                {choice}
              </Tag>
            ))
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Add more choices than blanks to make it challenging. Include distractors (incorrect options).
        </p>
      </div>

      <div className="mt-6">
        <label className="block text-base font-bold text-gray-800 mb-2">
          Correct Answers (In Order)
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Add the correct answers in the order they appear in the blanks.
        </p>
        
        <div className="flex gap-2 mb-3">
          <Input
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            onPressEnter={handleAddAnswer}
            placeholder="Enter correct answer..."
            className="flex-1 text-base p-2"
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddAnswer}
            className="h-10"
          >
            Add
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 p-4 bg-green-50 border border-green-200 rounded-lg min-h-[60px]">
          {answers.length === 0 ? (
            <p className="text-gray-400 text-base">No answers added yet. Add correct answers in order.</p>
          ) : (
            answers.map((answer, index) => (
              <Tag
                key={index}
                color="green"
                closable
                onClose={() => handleRemoveAnswer(index)}
                className="text-base py-2 px-3"
              >
                {index + 1}. {answer}
              </Tag>
            ))
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Add answers in the order they appear in the blanks. Should match blank count: <strong>{blankCount}</strong>
        </p>
      </div>

      {blankCount !== answers.length && (
        <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
          <p className="text-yellow-700 font-medium">
            ⚠️ Warning: You have <strong>{blankCount}</strong> blanks but <strong>{answers.length}</strong> answers. 
            They should match!
          </p>
        </div>
      )}

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-base font-semibold text-gray-700 mb-2">Preview:</p>
        <p className="text-gray-600">
          Students will see the text with blanks and drag words from the choices to fill them.
        </p>
      </div>
    </div>
  );
}

export default FibDragDropQuestion;
