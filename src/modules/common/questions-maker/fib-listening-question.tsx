import { Upload, message, Input, Tag, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useCreateQuestion } from "@/store/use-create-question";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

const { Dragger } = Upload;
const { TextArea } = Input;

function FibListeningQuestion() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [text, setText] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [newAnswer, setNewAnswer] = useState<string>("");
  
  const { setCreateQuestionData, questionData } = useCreateQuestion();

  useEffect(() => {
    if (audioFile && text) {
      setCreateQuestionData({ 
        text: JSON.stringify({ text, audio: audioFile.name }), 
        type: audioFile,
        extra: JSON.stringify({ answers, script: "" })
      });
    }
  }, [audioFile, text, answers]);

  useEffect(() => {
    if (!questionData.type) {
      setAudioFile(null);
      setText("");
      setAnswers([]);
      setNewAnswer("");
    }
  }, [questionData.type]);

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    accept: "audio/*",
    beforeUpload: (file) => {
      const isAudio = file.type.startsWith("audio/");
      if (!isAudio) {
        message.error("You can only upload audio files!");
        return Upload.LIST_IGNORE;
      }
      
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        message.error("Audio file must be smaller than 50MB!");
        return Upload.LIST_IGNORE;
      }

      setAudioFile(file);
      return false;
    },
    onRemove: () => {
      setAudioFile(null);
      setCreateQuestionData({ text: "", type: "", extra: "" });
    },
    fileList: audioFile ? [
      {
        uid: "-1",
        name: audioFile.name,
        status: "done",
      },
    ] : [],
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
          Upload Audio
        </label>
        <p className="text-sm text-gray-600">
          Upload an audio file for students to listen to and fill in the blanks.
        </p>
      </div>
      
      <Dragger {...uploadProps} className="border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
        <p className="ant-upload-drag-icon">
          <InboxOutlined className="text-3xl" />
        </p>
        <p className="ant-upload-text text-base font-medium">
          Click or drag audio file to this area to upload
        </p>
        <p className="ant-upload-hint text-sm">
          Support for a single audio upload. Accepted formats: MP3, WAV, M4A<br />
          Maximum file size: 50MB
        </p>
      </Dragger>
      
      {audioFile && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-base text-green-700 font-medium">
            ✓ File uploaded: <strong>{audioFile.name}</strong>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Size: {(audioFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <audio 
            controls 
            src={URL.createObjectURL(audioFile)} 
            className="mt-2 w-full rounded border border-gray-300"
          />
        </div>
      )}
      
      <div className="mt-6">
        <label className="block text-base font-bold text-gray-800 mb-2">
          Transcript with Blanks
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Enter the transcript with blanks for students to fill after listening.
        </p>
        
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter transcript with }{ for blanks. Example: The cat }{ on the mat."
          rows={10}
          showCount
          maxLength={2000}
          className="text-base p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />
        <p className="text-sm text-gray-600 mt-2">
          Use <code className="bg-gray-100 px-2 py-1 rounded text-sm">{'}{'} </code> to mark where blanks should appear. 
          Current blanks: <strong>{blankCount}</strong>
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
        <p className="text-base font-semibold text-gray-700 mb-2">About Listening Blanks:</p>
        <p className="text-gray-600">
          Students will listen to the audio and fill in the missing words in the transcript. 
          The audio plays only once, so they need to listen carefully.
        </p>
      </div>
    </div>
  );
}

export default FibListeningQuestion;
