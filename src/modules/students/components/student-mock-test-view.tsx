// import { Card, Button, Space, Progress, Steps } from "antd";
// import { useNavigate, useParams } from "react-router";
// import * as React from "react";

// interface MockTestSection {
//   type: string;
//   q: number;
//   time: number;
// }

// interface MockTestData {
//   id: string;
//   title: string;
//   isPublished: boolean;
//   sections: MockTestSection[];
// }

// const mockTestData: MockTestData[] = [
//   {
//     id: "test-1",
//     title: "PTE Full Mock Test 01",
//     isPublished: true,
//     sections: [
//       {
//         type: "sw",
//         q: 40,
//         time: 80,
//       },
//       {
//         type: "rd",
//         q: 18,
//         time: 30,
//       },
//       {
//         type: "ls",
//         q: 20,
//         time: 35,
//       },
//     ],
//   },
//   {
//     id: "test-2",
//     title: "PTE Full Mock Test 02",
//     isPublished: true,
//     sections: [
//       {
//         type: "sw",
//         q: 35,
//         time: 75,
//       },
//       {
//         type: "rd",
//         q: 16,
//         time: 25,
//       },
//       {
//         type: "ls",
//         q: 16,
//         time: 27,
//       },
//     ],
//   },
//   {
//     id: "test-3",
//     title: "PTE Full Mock Test 03",
//     isPublished: false,
//     sections: [
//       {
//         type: "sw",
//         q: 40,
//         time: 80,
//       },
//       {
//         type: "rd",
//         q: 18,
//         time: 30,
//       },
//       {
//         type: "ls",
//         q: 20,
//         time: 35,
//       },
//     ],
//   },
//   {
//     id: "test-4",
//     title: "PTE Full Mock Test 04",
//     isPublished: true,
//     sections: [
//       {
//         type: "sw",
//         q: 35,
//         time: 75,
//       },
//       {
//         type: "rd",
//         q: 16,
//         time: 25,
//       },
//       {
//         type: "ls",
//         q: 16,
//         time: 27,
//       },
//     ],
//   },
// ];

// function StudentMockTestView() {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();

//   const mockTest = mockTestData.find(test => test.id === id);

//   if (!mockTest) {
//     return (
//       <div className="p-6">
//         <Card className="shadow-lg">
//           <h2 className="text-xl font-bold mb-4">Mock Test Not Found</h2>
//           <Button onClick={() => navigate('/mock-tests')}>Back to Mock Tests</Button>
//         </Card>
//       </div>
//     );
//   }

//   const startMockTest = () => {
//     alert(`Starting ${mockTest.title}!`);
//   };

//   return (
//     <div className="w-full h-full min-h-screen">
//       <div className="mb-6">
//         <Button
//           type="link"
//           onClick={() => navigate('/mock-tests')}
//           className="text-blue-600 p-0"
//         >
//           ← Back to Mock Tests
//         </Button>
//       </div>

//       <Card className="shadow-lg">
//         <div className="flex justify-between items-start mb-6">
//           <div>
//             <h1 className="text-2xl font-bold">{mockTest.title}</h1>
//             <p className="text-gray-600 mt-2">Get ready to take your mock test</p>
//           </div>
//           <Button
//             type="primary"
//             size="large"
//             onClick={startMockTest}
//             className="bg-blue-600 hover:bg-blue-700"
//           >
//             Start Test
//           </Button>
//         </div>

//         <div className="mt-6">
//           <h3 className="text-lg font-semibold mb-4">Test Sections</h3>
//           <Space wrap>
//             {mockTest.sections.map((section, index) => (
//               <Card key={index} className="w-64">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-blue-600">{section.type.toUpperCase()}</div>
//                   <div className="mt-2">
//                     <div>{section.q} Questions</div>
//                     <div className="text-sm text-gray-600">{section.time} minutes</div>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </Space>
//         </div>

//         <div className="mt-8 pt-6 border-t">
//           <Steps
//             items={[
//               { title: 'Info', description: 'Test information' },
//               { title: 'Start', description: 'Begin test' },
//               { title: 'Questions', description: 'Answer questions' },
//               { title: 'Submit', description: 'Submit test' },
//               { title: 'Results', description: 'View results' },
//             ]}
//             current={0}
//             className="mb-6"
//           />

//           <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
//           <ul className="list-disc pl-5 space-y-2">
//             <li>You will have {Math.max(...mockTest.sections.map(s => s.time))} minutes to complete this test</li>
//             <li>All questions must be answered before submitting</li>
//             <li>You cannot go back to previous sections once you move forward</li>
//             <li>Click "Submit" at the end to complete the test</li>
//           </ul>
//         </div>

//         <div className="mt-8 flex justify-between">
//           <div>
//             <Progress
//               percent={0}
//               size="small"
//               strokeColor="#1890ff"
//               format={() => "Not Started"}
//             />
//           </div>
//           <Button
//             type="primary"
//             onClick={startMockTest}
//             className="bg-blue-600 hover:bg-blue-700"
//           >
//             Begin Test
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// }

// export default StudentMockTestView;
//-------------------------------------------------//

import React, { useEffect, useState } from "react";
import { Alert, Skeleton, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useHttp from "@/hooks/use-http";
import MockTestIntroPage from "@/pte-test-players/mock-test-components/MockTestIntroPage";
import MockTestExamPage from "@/pte-test-players/mock-test-components/MockTestExamPage";

const StudentMockTestView = () => {
  const { id: test_id } = useParams();
  const { sendRequest } = useHttp({ type: "auth" });

  const [showExam, setShowExam] = useState(false);
  const [mtsId, setMtsId] = useState<string | null>(null);

  // --------------------------------
  // Fetch mock test by id
  // --------------------------------
  const getMockTestCall = useMutation({
    mutationFn: () =>
      sendRequest({
        url: "getMockTestById",
        method: "GET",
        endURL: test_id,
      }),
    onError: (err: any) => {
      console.error(err);
      message.error(err?.message || "Failed to load mock test");
    },
  });

  // --------------------------------
  // Start mock test
  // --------------------------------
  const startMockTestCall = useMutation({
    mutationFn: () =>
      sendRequest({
        url: "startMockTest",
        method: "POST",
        endURL: `${test_id}/start`,
      }),
    onSuccess: (data: any) => {
      const mts_id =
        data?.response?.mts_id ||
        data?.response?.data?.mts_id ||
        data?.data?.mts_id ||
        data?.mts_id;

      if (!mts_id) {
        message.error("Mock test started but mts_id not received");
        return;
      }

      localStorage.setItem("current_mts_id", mts_id);
      setMtsId(mts_id);
      setShowExam(true);
    },
    onError: (err: any) => {
      console.error(err);
      message.error(err?.message || "Failed to start mock test");
    },
  });

  useEffect(() => {
    if (!test_id) return;
    getMockTestCall.mutate();
  }, [test_id]);

  const mockTestResponse =
    getMockTestCall.data?.response ||
    getMockTestCall.data?.data ||
    getMockTestCall.data;

  const handleStartMockProceed = async () => {
    try {
      await startMockTestCall.mutateAsync();
    } catch (err: any) {
      console.error(err);
      message.error(err?.message || "Unable to proceed with mock test");
    }
  };

  if (!test_id) {
    return (
      <div className="p-6">
        <Alert
          type="warning"
          showIcon
          message="Invalid mock test id"
          description="No mock test id found in route."
        />
      </div>
    );
  }

  if (getMockTestCall.isPending) {
    return (
      <div className="p-6">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (getMockTestCall.isError || !mockTestResponse?.data) {
    return (
      <div className="p-6">
        <Alert
          type="error"
          showIcon
          message="Failed to load mock test"
          description="Mock test data could not be loaded."
        />
      </div>
    );
  }

  // Step 1: show intro page
  if (!showExam) {
    return (
      <MockTestIntroPage
        testData={mockTestResponse.data}
        onProceed={handleStartMockProceed}
        loading={startMockTestCall.isPending}
      />
    );
  }

  // Step 2: show exam page
  return (
    <MockTestExamPage
      mockTestResponse={mockTestResponse}
      mtsId={localStorage.getItem("current_mts_id") || mtsId || ""}
      existingSectionAttempts={[]}
      existingResponsesByMtssId={{}}
    />
  );
};

export default StudentMockTestView;
