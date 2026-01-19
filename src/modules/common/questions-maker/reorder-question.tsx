import { useState } from "react";
import { Button, Card, Input } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  HolderOutlined,
} from "@ant-design/icons";
import { AiOutlineCheckCircle } from "react-icons/ai";

import { DragProvider } from "@/components/molecules/drag-and-drop/drag-context";
import { DraggableItem } from "@/components/molecules/drag-and-drop/drag-and-drop";
import { swapItems } from "@/utils/helpers/core-helpers";
import { Option } from "@/utils/model/model";
import QuestionPreview from "../preview/drag-n-drop-preview";

let idCounter = 1;

export default function ReOrderQuestion() {
  const [options, setOptions] = useState<Option[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [question, setQuestion] = useState<Option[]>([]);

  const handleSwap = (from: number, to: number) => {
    setOptions((prev) => swapItems(prev, from, to));
  };

  const correctAnswer = options.map((o) => o.title).join(" ");
  console.log("all q", question);
  return (
    <div className="min-h-screen from-slate-50 to-gray-100 p-6 bg-gray-50">
      <Card className="w-full max-w-4xl mx-auto rounded-2xl shadow-xl bg-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          🧩 Reorder Paragraph - Drag & Arrange Options
        </h2>

        {/* OPTIONS LIST */}
        <DragProvider>
          <div className="space-y-3">
            {options.map((item, index) => (
              <DraggableItem key={item.id} index={index} onSwap={handleSwap}>
                <OptionCard
                  title={item.title}
                  onDelete={() =>
                    setOptions((prev) => prev.filter((o) => o.id !== item.id))
                  }
                />
              </DraggableItem>
            ))}
          </div>
        </DragProvider>

        {/* ADD OPTION */}
        <div className="mt-6 space-y-4">
          <Input.TextArea
            value={inputValue}
            placeholder="Add a paragraph or sentence to reorder..."
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={() => {
              if (!inputValue.trim()) return;
              setOptions((prev) => [
                ...prev,
                { id: idCounter++, title: inputValue },
              ]);
              setInputValue("");
            }}
            className="text-base p-3"
            rows={4}
          />

          <Button
            block
            type="dashed"
            className="mt-4 h-12 text-lg"
            icon={<PlusOutlined />}
            onClick={() => {
              if (!inputValue.trim()) return;
              setOptions((prev) => [
                ...prev,
                { id: idCounter++, title: inputValue },
              ]);
              setQuestion((prev) => [
                ...prev,
                { id: idCounter++, title: inputValue },
              ]);
              setInputValue("");
            }}
          >
            Add Option
          </Button>
        </div>
        <QuestionPreview options={options} />

        {/* CORRECT ANSWER PREVIEW */}
        {options.length > 0 && <CorrectAnswerPreview value={correctAnswer} />}

        <Button type="primary" className="mt-6 w-full h-12 text-lg" size="large">
          Create Question
        </Button>
      </Card>
    </div>
  );
}
const CorrectAnswerPreview = ({ value }: { value: string }) => (
  <div
    className="
      mt-6 p-5 rounded-xl
      bg-gradient-to-r from-purple-100 via-violet-100 to-fuchsia-100
      border border-purple-200
    "
  >
    <div className="flex items-center gap-2">
      <span>
        <AiOutlineCheckCircle className="text-green-800 text-xl" />
      </span>
      <p className="text-base font-semibold text-green-800 ">
        Correct Answer Preview
      </p>
    </div>
    <p className="text-gray-800 font-semibold tracking-wide text-lg mt-2">{value}</p>
  </div>
);
const OptionCard = ({
  title,
  onDelete,
}: {
  title: string;
  onDelete: () => void;
}) => (
  <div
    className="
      flex items-center justify-between gap-3
      p-4 rounded-xl
      bg-white
      border border-gray-200
      shadow-sm
      hover:shadow-md
      transition-all
    "
  >
    <div className="flex items-center gap-3">
      <HolderOutlined className="text-gray-400 cursor-grab text-lg" />
      <span className="text-gray-800 text-lg font-medium">{title}</span>
    </div>

    <DeleteOutlined
      onClick={onDelete}
      className="text-gray-400 hover:text-red-500 cursor-pointer text-lg"
    />
  </div>
);
