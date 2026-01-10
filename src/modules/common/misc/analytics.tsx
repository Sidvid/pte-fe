import Card from "@/components/molecules/card/card";
import CircularScore from "@/components/molecules/scores/circular-score";
import SkillBar from "@/components/molecules/scores/skill-bar";
import React from "react";

import {
  AiOutlineUser,
  AiOutlineIdcard,
  AiOutlineGlobal,
  AiOutlineCalendar,
  AiOutlineMan,
} from "react-icons/ai";

const ScoreReportCard = () => {
  const reportData = {
    name: "Amitoj",
    regId: "amitoj27",
    testTakerId: "PTE000123456",
    reportCode: "1765622738102",
    overallScore: 60,
    scores: {
      reading: { val: 51, color: "#EAB308" }, // Yellow-500
      writing: { val: 59, color: "#DB2777" }, // Pink-600
      speaking: { val: 78, color: "#4B5563" }, // Gray-600 (or darker for light mode)
      listening: { val: 53, color: "#2563EB" }, // Blue-600
    },
    candidate: {
      dob: "15 July 1995",
      gender: "Male",
      citizenship: "India",
      residence: "India",
    },
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* CARD CONTAINER */}
      <div className="bg-foreground shadow-card rounded-2xl overflow-hidden border border-transparent dark:border-gray-800">
        {/* --- HEADER --- */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-20 text-white flex flex-col md:flex-row justify-between items-center gap-10">
          <div>
            <h2 className="f24 w700">Score Report</h2>
            <p className="f14 opacity-90 flex items-center gap-6 mt-4">
              <span className="opacity-70">Code:</span>
              <span className="font-mono bg-white/20 px-6 py-2 rounded text-sm">
                {reportData.reportCode}
              </span>
            </p>
          </div>
          <div className="f16 w600 opacity-90">Pearson | PTE Academic</div>
        </div>

        <div className="p-20 md:p-30 flex flex-col gap-40">
          {/* --- TOP SECTION: PROFILE & OVERALL --- */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-20 border-b border-gray-100 dark:border-gray-700 pb-30">
            {/* Profile Info */}
            <div className="flex items-center gap-20">
              <div className="w-80 h-80 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-sm">
                {/* Placeholder for user image */}
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amitoj"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="f24 w700 text-primary">{reportData.name}</h3>
                <div className="flex flex-col gap-2 opacity-70 f14 text-primary">
                  <span className="flex items-center gap-6">
                    <AiOutlineUser /> ID: {reportData.regId}
                  </span>
                  <span className="flex items-center gap-6">
                    <AiOutlineIdcard /> Test Taker ID: {reportData.testTakerId}
                  </span>
                </div>
              </div>
            </div>

            {/* Overall Score Badge */}
            <div className="flex flex-col items-center bg-link/5 rounded-2xl p-10 min-w-[120px]">
              <span className="f14 w600 text-link mb-4">Overall Score</span>
              <div className="w-60 h-60 rounded-full bg-link text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="f24 w800">{reportData.overallScore}</span>
              </div>
            </div>
          </div>

          {/* --- MIDDLE SECTION: COMMUNICATIVE SKILLS (RINGS) --- */}
          <div>
            <h4 className="f18 w700 text-primary mb-20 border-l-4 border-link pl-10">
              Communicative Skills
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-20 justify-items-center">
              <CircularScore
                score={reportData.scores.reading.val}
                label="Reading"
                color={reportData.scores.reading.color}
              />
              <CircularScore
                score={reportData.scores.writing.val}
                label="Writing"
                color={reportData.scores.writing.color}
              />
              <CircularScore
                score={reportData.scores.speaking.val}
                label="Speaking"
                color={reportData.scores.speaking.color}
              />
              <CircularScore
                score={reportData.scores.listening.val}
                label="Listening"
                color={reportData.scores.listening.color}
              />
            </div>
          </div>

          {/* --- BOTTOM SECTION: BREAKDOWN & CANDIDATE INFO --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-40 pt-20 border-t border-gray-100 dark:border-gray-700">
            {/* Skills Breakdown (Bars) */}
            <div className="flex flex-col gap-16">
              <h4 className="f18 w700 text-primary mb-4">Skills Breakdown</h4>
              <SkillBar
                label="Reading"
                score={reportData.scores.reading.val}
                color={reportData.scores.reading.color}
              />
              <SkillBar
                label="Writing"
                score={reportData.scores.writing.val}
                color={reportData.scores.writing.color}
              />
              <SkillBar
                label="Speaking"
                score={reportData.scores.speaking.val}
                color={reportData.scores.speaking.color}
              />
              <SkillBar
                label="Listening"
                score={reportData.scores.listening.val}
                color={reportData.scores.listening.color}
              />
            </div>

            {/* Candidate Info */}
            <div className="bg-background rounded-xl p-20 h-full">
              <h4 className="f18 w700 text-primary mb-16">
                Candidate Information
              </h4>
              <div className="flex flex-col gap-12 text-primary">
                <div className="flex justify-between items-center pb-8 border-b border-gray-200 dark:border-gray-700">
                  <span className="f14 w500 opacity-70 flex items-center gap-8">
                    <AiOutlineCalendar /> Date of Birth
                  </span>
                  <span className="f14 w600">{reportData.candidate.dob}</span>
                </div>

                <div className="flex justify-between items-center pb-8 border-b border-gray-200 dark:border-gray-700">
                  <span className="f14 w500 opacity-70 flex items-center gap-8">
                    <AiOutlineMan /> Gender
                  </span>
                  <span className="f14 w600">
                    {reportData.candidate.gender}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-8 border-b border-gray-200 dark:border-gray-700">
                  <span className="f14 w500 opacity-70 flex items-center gap-8">
                    <AiOutlineGlobal /> Citizenship
                  </span>
                  <span className="f14 w600">
                    {reportData.candidate.citizenship}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="f14 w500 opacity-70 flex items-center gap-8">
                    <AiOutlineGlobal /> Residence
                  </span>
                  <span className="f14 w600">
                    {reportData.candidate.residence}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreReportCard;
