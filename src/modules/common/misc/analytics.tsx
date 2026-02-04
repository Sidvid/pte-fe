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
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 -mx-6 -mt-6 -mr-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{reportData.name}</h3>
            <p className="text-base text-gray-600 mt-1">Registration ID: {reportData.regId}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-3 rounded-lg text-base font-bold shadow-md">
            <div className="text-center">Overall</div>
            <div className="text-center text-4xl">{reportData.overallScore}</div>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="bg-blue-100 p-3 rounded-lg">
            <AiOutlineUser className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Test Taker ID</p>
            <p className="text-lg font-medium text-gray-800">{reportData.testTakerId}</p>
          </div>
        </div>
        <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="bg-green-100 p-3 rounded-lg">
            <AiOutlineIdcard className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Report Code</p>
            <p className="text-lg font-medium text-gray-800">{reportData.reportCode}</p>
          </div>
        </div>
        <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="bg-yellow-100 p-3 rounded-lg">
            <AiOutlineCalendar className="text-yellow-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Date of Birth</p>
            <p className="text-lg font-medium text-gray-800">{reportData.candidate.dob}</p>
          </div>
        </div>
        <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="bg-pink-100 p-3 rounded-lg">
            <AiOutlineMan className="text-pink-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Gender</p>
            <p className="text-lg font-medium text-gray-800">{reportData.candidate.gender}</p>
          </div>
        </div>
        <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors sm:col-span-2">
          <div className="bg-indigo-100 p-3 rounded-lg">
            <AiOutlineGlobal className="text-indigo-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Citizenship & Residence</p>
            <p className="text-lg font-medium text-gray-800">{reportData.candidate.citizenship} / {reportData.candidate.residence}</p>
          </div>
        </div>
      </div>


      <div className="flex justify-center mb-6 py-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl -mx-6 -mb-6">
        <div className="relative">
          <CircularScore score={reportData.overallScore} label="Overall Score" color="#4F46E5" />
        </div>
      </div>


      <div className="space-y-5 pt-4">
        <h4 className="font-bold text-gray-800 text-center text-xl mb-4">Individual Skills Performance</h4>
        <div className="space-y-4 max-w-2xl mx-auto">
          {Object.entries(reportData.scores).map(([skill, scoreData]: [string, any]) => (
            <div key={skill} className="flex items-center justify-center space-x-3">
              <div className="w-32 text-base font-bold capitalize text-gray-700 bg-gray-100 py-3 px-4 rounded-lg text-center">
                {skill}
              </div>
              <div className="flex-1 max-w-md">
                <SkillBar score={scoreData.val} color={scoreData.color} label="" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreReportCard;