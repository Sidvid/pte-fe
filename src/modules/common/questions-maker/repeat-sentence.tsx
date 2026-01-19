import { Button, Input, Upload, UploadProps, message } from "antd";
import React, { useEffect, useState } from "react";
const { Dragger } = Upload;
import { InboxOutlined } from "@ant-design/icons";
import { useCreateQuestion } from "@/store/use-create-question";

function RepeatSentence() {
  const [script, setScript] = useState<string>("");
  const { setCreateQuestionData } = useCreateQuestion();
  const props: UploadProps = {
    name: "file",
    beforeUpload: (file) => {
      setCreateQuestionData({ type: file });
      message.success(`${file.name} selected successfully`);
      return false; // 🚫 STOP auto upload
    },

    onChange(info) {
      const { status } = info.file;
      console.log("File", info.file);
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  useEffect(() => {
    setCreateQuestionData({ text: script });
  }, [script]);

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="mb-2">
        <label className="block text-base font-bold text-gray-800 mb-2">
          Audio File
        </label>
        <p className="text-sm text-gray-600">
          Upload an audio file for students to repeat the sentence they hear.
        </p>
      </div>
      
      <Dragger {...props} className="border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
        <p className="ant-upload-drag-icon">
          <InboxOutlined className="text-3xl" />
        </p>
        <p className="ant-upload-text text-base font-medium">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint text-sm">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </Dragger>
      
      <div className="mt-4">
        <label className="block text-base font-medium text-gray-700 mb-2">
          Transcript
        </label>
        <Input.TextArea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Enter the script that students should repeat..."
          className="text-base p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          rows={4}
        />
      </div>
    </div>
  );
}

export default RepeatSentence;
