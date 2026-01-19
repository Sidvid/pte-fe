import { Upload, message, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useCreateQuestion } from "@/store/use-create-question";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

const { Dragger } = Upload;
const { TextArea } = Input;

function WriteFromDictationQuestion() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [script, setScript] = useState<string>("");
  
  const { setCreateQuestionData, questionData } = useCreateQuestion();

  useEffect(() => {
    if (audioFile) {
      setCreateQuestionData({ 
        text: script || "Listen to the audio and write what you hear", 
        type: audioFile,
        extra: JSON.stringify({ script })
      });
    }
  }, [audioFile, script]);

  useEffect(() => {
    if (!questionData.type) {
      setAudioFile(null);
      setScript("");
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

  return (
    <div className="flex flex-col gap-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="mb-2">
        <label className="block text-base font-bold text-gray-800 mb-2">
          Upload Audio
        </label>
        <p className="text-sm text-gray-600">
          Upload an audio file for students to listen to and write what they hear.
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
          Audio Script (For Reference)
        </label>
        <p className="text-sm text-gray-600 mb-3">
          This is the correct text that students should write. Used for scoring reference.
        </p>
        
        <TextArea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Enter the text that will be spoken in the audio..."
          rows={8}
          showCount
          maxLength={500}
          className="text-base p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />
      </div>
      
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-base font-semibold text-gray-700 mb-2">About Write From Dictation:</p>
        <p className="text-gray-600">
          Students listen to an audio and write exactly what they hear. 
          The audio plays only once, and they need to reproduce the sentence accurately.
        </p>
      </div>
    </div>
  );
}

export default WriteFromDictationQuestion;
