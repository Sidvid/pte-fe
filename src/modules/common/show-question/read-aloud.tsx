import { QuestionItem } from "@/utils/model/response-models";
import React from "react";
interface ReadAloudProps {
  questions: QuestionItem[];
}
function ReadAloud({ questions }: ReadAloudProps) {
  return (
    <div className=" flex flex-col gap-[20px]">
      {questions?.map((item) => {
        const text =
          typeof item.data === "string"
            ? JSON.parse(item.data).text
            : item.data.text;
        console.log("this is =>", text);
        return (
          <div className="text-black border border-dashed border-green-700 bg-green-50 p-[6px] rounded-2xl f14">
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
