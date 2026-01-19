import { Upload, message, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useCreateQuestion } from "@/store/use-create-question";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

const { Dragger } = Upload;
const { TextArea } = Input;

function RetellLectureQuestion() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [lectureText, setLectureText] = useState<string>("");
  const { setCreateQuestionData, questionData } = useCreateQuestion();

  useEffect(() => {
    if (audioFile) {
      setCreateQuestionData({ 
        text: lectureText || "Listen to the lecture and retell it in your own words", 
        type: audioFile,
        extra: lectureText
      });
    }
  }, [audioFile, lectureText]);

  useEffect(() => {
    if (!questionData.type) {
      setAudioFile(null);
      setLectureText("");
    }
  }, [questionData.type]);

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    accept: "audio/*,video/*",
    beforeUpload: (file) => {
      const isMedia = file.type.startsWith("audio/") || file.type.startsWith("video/");
      if (!isMedia) {
        message.error("You can only upload audio or video files!");
        return Upload.LIST_IGNORE;
      }
      
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        message.error("File must be smaller than 50MB!");
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
          Upload Lecture Audio/Video
        </label>
        <p className="text-sm text-gray-600">
          Upload a lecture audio or video file for students to listen to and retell.
        </p>
      </div>
      
      <Dragger {...uploadProps} className="border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
        <p className="ant-upload-drag-icon">
          <InboxOutlined className="text-3xl" />
        </p>
        <p className="ant-upload-text text-base font-medium">
          Click or drag audio/video file to this area to upload
        </p>
        <p className="ant-upload-hint text-sm">
          Support for a single audio or video upload. Accepted formats: MP3, WAV, M4A, MP4, WebM<br />
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
          {audioFile.type.startsWith("audio/") && (
            <audio 
              controls 
              src={URL.createObjectURL(audioFile)} 
              className="mt-2 w-full rounded border border-gray-300"
            />
          )}
          {audioFile.type.startsWith("video/") && (
            <video 
              controls 
              src={URL.createObjectURL(audioFile)} 
              className="mt-2 w-full max-h-[300px] rounded border border-gray-300"
            />
          )}
        </div>
      )}
      
      <div className="mt-6">
        <label className="block text-base font-bold text-gray-800 mb-2">
          Lecture Transcript/Description (Optional)
        </label>
        <p className="text-sm text-gray-600 mb-3">
          This is optional but helps with scoring and reference. Enter the transcript or a description of the lecture content.
        </p>
        <TextArea
          value={lectureText}
          onChange={(e) => setLectureText(e.target.value)}
          placeholder="Enter the transcript or description of the lecture for reference..."
          rows={8}
          showCount
          maxLength={2000}
          className="text-base p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />
      </div>
      
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-base font-semibold text-gray-700 mb-2">About Retell Lecture:</p>
        <p className="text-gray-600">
          Students will listen to or watch the lecture and then retell it in their own words. 
          The audio/video should be 60-90 seconds long for optimal practice.
        </p>
      </div>
    </div>
  );
}

export default RetellLectureQuestion;
