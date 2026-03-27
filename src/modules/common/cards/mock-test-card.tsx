import React from "react";
import { Card, Button, Switch, Tag, Badge } from "antd";
import {
  AiOutlineAudio,
  AiOutlineRead,
  AiOutlineCustomerService,
  AiOutlineArrowRight,
  AiOutlineClockCircle,
  AiOutlineQuestionCircle,
} from "react-icons/ai";
interface MockTestCardProps {
  title?: string;
  isPublished?: boolean;
  totalTime?: number;
  onTogglePublish?: () => void;
  onExplore?: () => void;
  sections?: {
    id: string;
    title: string;
    type: string;
    questions_count: number;
    duration: number;
  }[];
}
const MockTestCard = ({
  title = "Mock Test 01",
  isPublished = true,
  onTogglePublish,
  onExplore,
  sections = [
    { type: "sw", q: 35, time: 75 },
    { type: "rd", q: 16, time: 25 },
    { type: "ls", q: 16, time: 27 },
  ],
  totalTime = 135,
}: MockTestCardProps) => {
  const getSectionDetails = (type: any) => {
    switch (type) {
      case "sw":
        return {
          label: "Speaking & Writing",
          icon: <AiOutlineAudio size={22} />,
          // Using slightly darker/richer colors for better light-mode visibility
          bgColor: "bg-blue-600",
          lightBg: "bg-blue-50",
          textColor: "text-blue-700",
        };
      case "rd":
        return {
          label: "Reading",
          icon: <AiOutlineRead size={22} />,
          bgColor: "bg-amber-500",
          lightBg: "bg-amber-50",
          textColor: "text-amber-700",
        };
      case "ls":
        return {
          label: "Listening",
          icon: <AiOutlineCustomerService size={22} />,
          bgColor: "bg-cyan-600",
          lightBg: "bg-cyan-50",
          textColor: "text-cyan-700",
        };
      default:
        return {
          label: type,
          icon: <AiOutlineQuestionCircle size={22} />,
          bgColor: "bg-gray-600",
          lightBg: "bg-gray-50",
          textColor: "text-gray-700",
        };
    }
  };

  // const totalTime = sections.reduce((acc, curr) => acc + curr.time, 0);

  return (
    <Card
      hoverable
      bordered={false}
      actions={[
        <div onClick={onTogglePublish}>
          <Switch
            checked={isPublished}
            className={isPublished ? "bg-[#635bc8]" : "bg-gray-300"}
          />
        </div>,
        <Button
          type="primary"
          onClick={onExplore}
          className="bg-[#635bc8] hover:bg-[#5046a0] border-none shadow-lg shadow-indigo-200 text-sm font-bold h-11 px-8"
        >
          Explore Test
        </Button>,
        <Button type="primary" danger>
          Delete
        </Button>,
      ]}
      // Added a subtle border to define edges in light mode + strong shadow on hover
      className="w-full rounded-[24px] overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
      bodyStyle={{ padding: 10 }}
    >
      {/* --- Header --- */}
      <div className="px-10 py-10 border-b border-gray-100 flex justify-between items-start bg-white">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 tracking-tight group-hover:text-[#635bc8] transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1.5 bg-purple-50 px-2.5 py-1 rounded-md">
              <AiOutlineClockCircle className="text-[#635bc8]" size={14} />
              <span className="text-xs font-bold text-[#635bc8] uppercase tracking-wider">
                {totalTime} Mins
              </span>
            </div>
          </div>
        </div>

        {/* Status Pill */}
        <div
          className={`px-3 py-1 rounded-lg text-[10px] flex gap-6 items-center font-bold uppercase tracking-wide border ${
            isPublished
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-gray-50 text-gray-500 border-gray-200"
          }`}
        >
          {isPublished ? <Badge color="green" status="processing" /> : null}
          <p className="mt-2">{isPublished ? "Live" : "Draft"}</p>
        </div>
      </div>

      {/* --- Sections List (Boxed Design) --- */}
      <div className="px-6 py-6 flex flex-col gap-4">
        {sections.map((sec, index) => {
          const details = getSectionDetails(sec.type);
          return (
            <div
              key={index}
              // BOXED ROW: Light gray background to separate from card white
              className="flex items-center justify-between p-3 rounded-2xl bg-[#f8f9fa] border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-md transition-all duration-300"
            >
              {/* Left: Icon & Label */}
              <div className="flex items-center gap-4">
                {/* Icon Container */}
                <div
                  className={`
                  w-20 h-20 p-4 rounded-full flex items-center justify-center flex-shrink-0
                  ${details.bgColor} text-white shadow-md
                `}
                >
                  {details.icon}
                </div>

                <div className="flex flex-col">
                  <span className="text-[15px] font-bold text-gray-800 leading-tight">
                    {details.label}
                  </span>
                  <span
                    className={`text-[11px] font-bold ${details.textColor} mt-1`}
                  >
                    Section {index + 1}
                  </span>
                </div>
              </div>

              {/* Right: Stats (Pills) */}
              <div className="flex items-center gap-2">
                {/* Questions Pill */}
                <div className="flex flex-col items-center justify-center bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm min-w-[50px]">
                  <span className="text-sm font-extrabold text-gray-900">
                    {sec.q}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">
                    Ques
                  </span>
                </div>

                {/* Time Pill */}
                <div className="flex flex-col items-center justify-center bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm min-w-[50px]">
                  <span
                    className={`text-sm font-extrabold ${details.textColor}`}
                  >
                    {sec.time}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">
                    Min
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Footer --- */}
    </Card>
  );
};

export default MockTestCard;
