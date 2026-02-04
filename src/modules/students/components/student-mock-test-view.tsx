import { Card, Button, Space, Progress, Steps } from "antd";
import { useNavigate, useParams } from "react-router";
import * as React from "react";

interface MockTestSection {
  type: string;
  q: number;
  time: number;
}

interface MockTestData {
  id: string;
  title: string;
  isPublished: boolean;
  sections: MockTestSection[];
}

const mockTestData: MockTestData[] = [
  {
    id: "test-1",
    title: "PTE Full Mock Test 01",
    isPublished: true,
    sections: [
      {
        type: "sw",
        q: 40,
        time: 80,
      },
      {
        type: "rd",
        q: 18,
        time: 30,
      },
      {
        type: "ls",
        q: 20,
        time: 35,
      },
    ],
  },
  {
    id: "test-2",
    title: "PTE Full Mock Test 02",
    isPublished: true,
    sections: [
      {
        type: "sw",
        q: 35,
        time: 75,
      },
      {
        type: "rd",
        q: 16,
        time: 25,
      },
      {
        type: "ls",
        q: 16,
        time: 27,
      },
    ],
  },
  {
    id: "test-3",
    title: "PTE Full Mock Test 03",
    isPublished: false,
    sections: [
      {
        type: "sw",
        q: 40,
        time: 80,
      },
      {
        type: "rd",
        q: 18,
        time: 30,
      },
      {
        type: "ls",
        q: 20,
        time: 35,
      },
    ],
  },
  {
    id: "test-4",
    title: "PTE Full Mock Test 04",
    isPublished: true,
    sections: [
      {
        type: "sw",
        q: 35,
        time: 75,
      },
      {
        type: "rd",
        q: 16,
        time: 25,
      },
      {
        type: "ls",
        q: 16,
        time: 27,
      },
    ],
  },
];

function StudentMockTestView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const mockTest = mockTestData.find(test => test.id === id);

  if (!mockTest) {
    return (
      <div className="p-6">
        <Card className="shadow-lg">
          <h2 className="text-xl font-bold mb-4">Mock Test Not Found</h2>
          <Button onClick={() => navigate('/mock-tests')}>Back to Mock Tests</Button>
        </Card>
      </div>
    );
  }

  const startMockTest = () => {
    alert(`Starting ${mockTest.title}!`);
  };

  return (
    <div className="w-full h-full min-h-screen">
      <div className="mb-6">
        <Button 
          type="link" 
          onClick={() => navigate('/mock-tests')}
          className="text-blue-600 p-0"
        >
          ← Back to Mock Tests
        </Button>
      </div>
      
      <Card className="shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">{mockTest.title}</h1>
            <p className="text-gray-600 mt-2">Get ready to take your mock test</p>
          </div>
          <Button 
            type="primary" 
            size="large" 
            onClick={startMockTest}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Start Test
          </Button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Test Sections</h3>
          <Space wrap>
            {mockTest.sections.map((section, index) => (
              <Card key={index} className="w-64">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{section.type.toUpperCase()}</div>
                  <div className="mt-2">
                    <div>{section.q} Questions</div>
                    <div className="text-sm text-gray-600">{section.time} minutes</div>
                  </div>
                </div>
              </Card>
            ))}
          </Space>
        </div>

        <div className="mt-8 pt-6 border-t">
          <Steps 
            items={[
              { title: 'Info', description: 'Test information' },
              { title: 'Start', description: 'Begin test' },
              { title: 'Questions', description: 'Answer questions' },
              { title: 'Submit', description: 'Submit test' },
              { title: 'Results', description: 'View results' },
            ]}
            current={0}
            className="mb-6"
          />
          
          <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>You will have {Math.max(...mockTest.sections.map(s => s.time))} minutes to complete this test</li>
            <li>All questions must be answered before submitting</li>
            <li>You cannot go back to previous sections once you move forward</li>
            <li>Click "Submit" at the end to complete the test</li>
          </ul>
        </div>

        <div className="mt-8 flex justify-between">
          <div>
            <Progress 
              percent={0} 
              size="small" 
              strokeColor="#1890ff" 
              format={() => "Not Started"} 
            />
          </div>
          <Button 
            type="primary" 
            onClick={startMockTest}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Begin Test
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default StudentMockTestView;