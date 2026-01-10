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
    <div className="flex flex-col gap-[10px]">
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </Dragger>
      <Input.TextArea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder="Enter the script..."
        className="mt-[10px]"
      />
    </div>
  );
}

export default RepeatSentence;
