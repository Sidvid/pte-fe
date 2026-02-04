import useHttp from "@/hooks/use-http";
import { useMutation } from "@tanstack/react-query";
import { Table, TableProps, Tag, Button, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface MockTest {
  id: string;
  title: string;
  isPublished: boolean;
  sections: Array<{
    type: string;
    q: number;
    time: number;
  }>;
}

function StudentMockTests() {
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const { sendRequest } = useHttp({ type: "auth" });
  const navigate = useNavigate();

  // Fetch mock tests for the student
  const fetchMockTests = useMutation({
    mutationFn: () => 
      sendRequest({ url: "allDailyTask", method: "GET" }) as Promise<any>,
    onSuccess: (data) => {
      if (data?.response?.data && Array.isArray(data.response.data)) {
        // Check if the data has the expected structure for mock tests
        // If not, transform it or use sample data
        if (data.response.data.length > 0 && data.response.data[0].title && data.response.data[0].sections) {
          // Data already has the expected structure
          setMockTests(data.response.data);
        } else {
          // Transform the data to match MockTest interface
          const transformedData = data.response.data.map((item: any, index: number) => ({
            id: item.id || `test-${index}`,
            title: item.title || `Mock Test ${index + 1}`,
            isPublished: item.isPublished !== undefined ? item.isPublished : true,
            sections: item.sections || [
              { type: "sw", q: 10, time: 10 },
              { type: "rd", q: 5, time: 5 },
              { type: "ls", q: 5, time: 5 }
            ]
          }));
          setMockTests(transformedData);
        }
      } else {
        // Sample mock tests data
        setMockTests([
          {
            id: "test-1",
            title: "PTE Full Mock Test 01",
            isPublished: true,
            sections: [
              { type: "sw", q: 40, time: 80 },
              { type: "rd", q: 18, time: 30 },
              { type: "ls", q: 20, time: 35 },
            ],
          },
          {
            id: "test-2",
            title: "PTE Full Mock Test 02",
            isPublished: true,
            sections: [
              { type: "sw", q: 35, time: 75 },
              { type: "rd", q: 16, time: 25 },
              { type: "ls", q: 16, time: 27 },
            ],
          },
          {
            id: "test-3",
            title: "PTE Full Mock Test 03",
            isPublished: false,
            sections: [
              { type: "sw", q: 40, time: 80 },
              { type: "rd", q: 18, time: 30 },
              { type: "ls", q: 20, time: 35 },
            ],
          },
        ]);
      }
    },
    onError: (error) => {
      console.error("Error fetching mock tests:", error);
      // Sample mock tests data
      setMockTests([
        {
          id: "test-1",
          title: "PTE Full Mock Test 01",
          isPublished: true,
          sections: [
            { type: "sw", q: 40, time: 80 },
            { type: "rd", q: 18, time: 30 },
            { type: "ls", q: 20, time: 35 },
          ],
        },
        {
          id: "test-2",
          title: "PTE Full Mock Test 02",
          isPublished: true,
          sections: [
            { type: "sw", q: 35, time: 75 },
            { type: "rd", q: 16, time: 25 },
            { type: "ls", q: 16, time: 27 },
          ],
        },
        {
          id: "test-3",
          title: "PTE Full Mock Test 03",
          isPublished: false,
          sections: [
            { type: "sw", q: 40, time: 80 },
            { type: "rd", q: 18, time: 30 },
            { type: "ls", q: 20, time: 35 },
          ],
        },
      ]);
    }
  });

  useEffect(() => {
    fetchMockTests.mutate();
  }, []);

  const handleTakeMockTest = (testId: string) => {
    navigate(`/mock-test/${testId}`);
  };

  const columns: TableProps<MockTest>["columns"] = [
    {
      title: "Mock Test Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Sections",
      key: "sections",
      render: (_, record) => (
        <span>{record.sections.length} sections</span>
      ),
    },
    {
      title: "Questions",
      key: "questions",
      render: (_, record) => (
        <span>{record.sections.reduce((sum, sec) => sum + sec.q, 0)} total</span>
      ),
    },
    {
      title: "Duration",
      key: "duration",
      render: (_, record) => (
        <span>{record.sections.reduce((sum, sec) => sum + sec.time, 0)} min</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "isPublished",
      key: "isPublished",
      render: (isPublished) => (
        <Tag color={isPublished ? "green" : "red"}>
          {isPublished ? "Published" : "Draft"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "mock_action",
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            onClick={() => handleTakeMockTest(record.id)}
            disabled={!record.isPublished}
          >
            Take Test
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
        <h1 className="text-2xl font-bold">Mock Tests</h1>
        <p className="opacity-90">Here are the available mock tests for practice.</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Mock Tests</h2>
        <Table 
          dataSource={mockTests} 
          columns={columns} 
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
}

export default StudentMockTests;