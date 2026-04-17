import { Input, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import { useCreateQuestion } from "@/store/use-create-question";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

const { Dragger } = Upload;

function DescribeImageQuestion() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [script, setScript] = useState<string>("");
  const { setCreateQuestionData, questionData } = useCreateQuestion();

  useEffect(() => {
    if (imageFile) {
      setCreateQuestionData({
        extra: { script },
        type: imageFile,
      });
    }
  }, [imageFile, script]);

  useEffect(() => {
    if (!questionData.type) {
      setImageFile(null);
      setScript("");
    }
  }, [questionData.type]);

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    accept: "image/*",
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return Upload.LIST_IGNORE;
      }

      setImageFile(file);
      return false;
    },
    onRemove: () => {
      setImageFile(null);
      setScript("");
      setCreateQuestionData({ text: "", type: "" });
    },
    fileList: imageFile
      ? [
          {
            uid: "-1",
            name: imageFile.name,
            status: "done",
            url: URL.createObjectURL(imageFile),
          },
        ]
      : [],
  };

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newScript = e.target.value;
    setScript(newScript);

    if (imageFile) {
      setCreateQuestionData({
        extra: { script: newScript },
        type: imageFile,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="mb-2">
        <label className="block text-base font-bold text-gray-800 mb-2">
          Upload Image
        </label>
        <p className="text-sm text-gray-600">
          Upload an image for students to describe. The image will be displayed
          during the test.
        </p>
      </div>

      <Dragger
        {...uploadProps}
        className="border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined className="text-3xl" />
        </p>
        <p className="ant-upload-text text-base font-medium">
          Click or drag image to this area to upload
        </p>
        <p className="ant-upload-hint text-sm">
          Support for a single image upload. Accepted formats: JPG, PNG, WEBP,
          GIF
          <br />
          Maximum file size: 5MB
        </p>
      </Dragger>

      <div className="mt-4">
        <label className="block text-base font-medium text-gray-700 mb-2">
          Script/Description
        </label>
        <Input.TextArea
          value={script}
          onChange={handleScriptChange} // Use new handler
          placeholder="Enter a description or script about the image..."
          className="text-base p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          rows={4}
        />
      </div>

      {imageFile && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="max-w-full max-h-[300px] object-contain rounded-lg border-2 border-gray-200"
          />
        </div>
      )}
    </div>
  );
}

export default DescribeImageQuestion;
