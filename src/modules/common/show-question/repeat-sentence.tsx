import { QuestionItem } from "@/utils/model/response-models";
import { useAudioPlayer } from "react-use-audio-player";
import React from "react";
import CustomAudioPlayer from "@/components/organism/audio-player";
interface ReadAloudProps {
  questions: QuestionItem[];
}

function RepeatSentence({ questions }: ReadAloudProps) {
  const { load } = useAudioPlayer();
  const handlePlay = (link: string) => {
    load(link, { initialVolume: 0.75, autoplay: true });
  };
  return (
    <div className=" flex flex-col gap-[20px]">
      {questions?.map((item) => {
        return (
          <div className="text-black border border-dashed border-green-700 bg-green-50 p-[6px] rounded-2xl f14">
            <p>{`Question ${item.sNo}`}</p>
            <p>Text:</p>
            <CustomAudioPlayer key={item.data.audio} src={item.data.audio} />
            <p className="text-black ">
              {typeof item.extra === "object" && item.extra
                ? String((item.extra as Record<string, unknown>).script)
                : ""}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default RepeatSentence;
