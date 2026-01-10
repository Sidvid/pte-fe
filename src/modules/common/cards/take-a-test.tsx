import React from "react";
// Importing icons from Ant Design (react-icons/ai)
import {
  AiOutlineClockCircle,
  AiOutlineQuestionCircle,
  AiOutlineLock,
  AiOutlineBarChart,
  AiOutlinePlayCircle,
  AiOutlineArrowRight,
} from "react-icons/ai";

const Card = ({
  title = "FIB - Drop Down",
  code = "FIB_RW",
  questionCount = 10,
  duration = 20,
  status = "start", // 'start', 'resume', 'analytics', 'disabled'
  progress = 0,
}) => {
  // Helper to render the correct button/footer based on status
  const renderFooter = () => {
    switch (status) {
      case "resume":
        return (
          <div className="flex flex-col gap-10">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-link h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center f12 text-primary opacity-70 mb-4">
              <span>{progress}% Completed</span>
            </div>

            {/* Resume Button */}
            <button className="w-full bg-link hover:bg-opacity-90 text-white rounded-lg py-10 px-20 flex items-center justify-center gap-10 transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
              <span className="f14 w600">Resume Test</span>
              <AiOutlineArrowRight size={16} />
            </button>
          </div>
        );

      case "analytics":
        return (
          <button className="w-full border-2 border-link text-link hover:bg-link hover:text-white rounded-lg py-10 px-20 flex items-center justify-center gap-10 transition-all active:scale-95">
            <AiOutlineBarChart size={18} />
            <span className="f14 w600">View Analytics</span>
          </button>
        );

      case "disabled":
        return (
          <button
            disabled
            className="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed rounded-lg py-10 px-20 flex items-center justify-center gap-10"
          >
            <AiOutlineLock size={16} />
            <span className="f14 w600">Locked</span>
          </button>
        );

      case "start":
      default:
        return (
          <button className="w-full bg-link hover:bg-opacity-90 text-white rounded-lg py-10 px-20 flex items-center justify-center gap-10 transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
            <span className="f14 w600">Start Now</span>
            <AiOutlinePlayCircle size={18} />
          </button>
        );
    }
  };

  return (
    <div
      className={`
      relative 
      bg-foreground 
      shadow-card 
      rounded-2xl 
      p-20 
      flex flex-col 
      justify-between 
      gap-20
      border border-transparent
      ${status === "disabled" ? "opacity-70 grayscale" : "hover:border-link/20"}
      transition-all duration-300
    `}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-4">
          <span className="f12 w600 text-link bg-link/10 px-8 py-2 rounded-md self-start">
            {code}
          </span>
          <h3 className="f18 w700 text-primary leading-tight">{title}</h3>
        </div>
        {/* Decorative Circle Icon */}
        <div className="w-40 h-40 rounded-full bg-background flex items-center justify-center text-primary">
          <span className="f16 w700">Q</span>
        </div>
      </div>

      {/* Meta Data Section (Time & Questions) */}
      <div className="flex items-center gap-20 py-10 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-6 text-primary opacity-80">
          <AiOutlineQuestionCircle size={16} className="text-link" />
          <span className="f14 w500">{questionCount} Questions</span>
        </div>
        <div className="flex items-center gap-6 text-primary opacity-80">
          <AiOutlineClockCircle size={16} className="text-link" />
          <span className="f14 w500">{duration} Min</span>
        </div>
      </div>

      {/* Footer / Action Button */}
      <div className="mt-auto">{renderFooter()}</div>
    </div>
  );
};

export default Card;
