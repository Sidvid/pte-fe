import ScoreReportCard from "@/modules/common/misc/analytics";
import { Card } from "antd";
import React from "react";
import { useNavigate } from "react-router";

function dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p className="opacity-90 text-md">Welcome back! Access your learning materials and assignments.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer border-0 bg-gradient-to-br from-blue-50 to-indigo-50"
          onClick={() => navigate('/schedule')}
        >
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Schedule</h3>
            <p className="text-gray-600">View your weekly schedule</p>
          </div>
        </Card>
        
        <Card 
          className="shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer border-0 bg-gradient-to-br from-green-50 to-emerald-50"
          onClick={() => navigate('/daily-tasks')}
        >
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Daily Tasks</h3>
            <p className="text-gray-600">Complete your assigned tasks</p>
          </div>
        </Card>
        
        <Card 
          className="shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer border-0 bg-gradient-to-br from-purple-50 to-fuchsia-50"
          onClick={() => navigate('/mock-tests')}
        >
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Mock Tests</h3>
            <p className="text-gray-600">Take practice tests</p>
          </div>
        </Card>
        
        <Card 
          className="shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer border-0 bg-gradient-to-br from-amber-50 to-orange-50"
          onClick={() => navigate('/videos')}
        >
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📺</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Learning Videos</h3>
            <p className="text-gray-600">Theory and Lab videos</p>
          </div>
        </Card>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Performance Overview</h2>
        <div className="bg-white rounded-xl shadow-md p-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-t-xl">
            <h3 className="text-xl font-semibold text-white">Score Report</h3>
          </div>
          <div className="p-4">
            <ScoreReportCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default dashboard;
