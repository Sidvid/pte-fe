import { QuestionItem } from "@/utils/model/response-models";
import React from "react";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
interface ReadAloudProps {
  questions: QuestionItem[];
  onDelete?: (questionId: string) => void;
}
function ReadAloud({ questions, onDelete }: ReadAloudProps) {
  return (
    <div className=" flex flex-col gap-[20px]">
      {questions?.map((item) => {
        const text =
          typeof item.data === "string"
            ? JSON.parse(item.data).text
            : item.data.text;
        console.log("this is =>", text);
        return (
          <div key={item.id} className="text-black border border-dashed border-green-700 bg-green-50 p-[6px] rounded-2xl f14 relative">
            {onDelete && (
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete(item.id)}
                style={{ position: 'absolute', top: 8, right: 8 }}
                title="Delete question"
              />
            )}
            <p>{`Question ${item.sNo}`}</p>
            <p>Text:</p>
            <p className="text-black ">{text}</p>
          </div>
        );
      })}
    </div>
  );
}

export default ReadAloud;
