import React from "react";

const MockTestUI = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-0">
      <div className="w-full h-full">
        <div className="bg-white rounded-none shadow-lg p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">PTE Full Mock Test 01</h1>
          <p className="text-xl text-gray-600">Get ready to take your mock test</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 px-8">
          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow h-full">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-3">SW</div>
              <div className="text-xl text-gray-700 mb-2">40 Questions</div>
              <div className="text-lg text-gray-600">80 minutes</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow h-full">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-3">RD</div>
              <div className="text-xl text-gray-700 mb-2">18 Questions</div>
              <div className="text-lg text-gray-600">30 minutes</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow h-full">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-3">LS</div>
              <div className="text-xl text-gray-700 mb-2">20 Questions</div>
              <div className="text-lg text-gray-600">35 minutes</div>
            </div>
          </div>
        </div>

    
        <div className="bg-white rounded-none shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Test Progress</h2>
          <div className="flex justify-between items-center relative px-16">
     
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
            
       
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg mb-3">1</div>
              <div className="text-base font-medium text-gray-700 text-center">Info</div>
              <div className="text-sm text-gray-500 text-center mt-2">Test information</div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-lg mb-3">2</div>
              <div className="text-base font-medium text-gray-700 text-center">Start</div>
              <div className="text-sm text-gray-500 text-center mt-2">Begin test</div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-lg mb-3">3</div>
              <div className="text-base font-medium text-gray-700 text-center">Questions</div>
              <div className="text-sm text-gray-500 text-center mt-2">Answer questions</div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-lg mb-3">4</div>
              <div className="text-base font-medium text-gray-700 text-center">Submit</div>
              <div className="text-sm text-gray-500 text-center mt-2">Submit test</div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-lg mb-3">5</div>
              <div className="text-base font-medium text-gray-700 text-center">Results</div>
              <div className="text-sm text-gray-500 text-center mt-2">View results</div>
            </div>
          </div>
        </div>

 
        <div className="bg-white rounded-none shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Instructions:</h2>
          <ul className="space-y-3 text-gray-700 text-lg">
            <li className="flex items-start">
              <span className="text-blue-500 text-xl mr-3">•</span>
              You will have 80 minutes to complete this test
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 text-xl mr-3">•</span>
              All questions must be answered before submitting
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 text-xl mr-3">•</span>
              You cannot go back to previous sections once you move forward
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 text-xl mr-3">•</span>
              Click "Submit" at the end to complete the test
            </li>
          </ul>
        </div>


        <div className="bg-white rounded-none shadow-lg p-8 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-red-100 text-red-800 rounded-full font-medium text-lg">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
            Not Started
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTestUI;