import useHttp from "@/hooks/use-http";
import { useMutation } from "@tanstack/react-query";
import {
  Table,
  TableProps,
  Tag,
  Button,
  Space,
  notification,
  Typography,
  Card,
} from "antd";
import { GiProgression } from "react-icons/gi";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { getSectionLabel } from "@/utils/helpers/core-helpers";

interface MockTest {
  id: string;
  title: string;
  published: boolean;
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
      sendRequest({ url: "allMockTests", method: "GET" }) as Promise<any>,
    onSuccess: (data) => {
      console.log("Fetched Mock Tests:", data);
      if (data?.response?.data && Array.isArray(data.response.data?.tests)) {
        const { response } = data;
        setMockTests(response.data.tests);
      }
    },
    onError: (error) => {
      console.error("Error fetching mock tests:", error);
      notification.error({
        title: error?.message || "Failed to load mock tests",
      });
    },
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
    // {
    //   title: "Sections",
    //   key: "sections",
    //   render: (_, record) => (
    //     <div className="flex flex-col gap-2 min-w-[260px]">
    //       {record.sections.map((section: any) => (
    //         <div
    //           key={section.id}
    //           className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
    //         >
    //           <div className="flex items-center justify-between gap-2">
    //             <Typography.Text strong className="text-sm">
    //               {section.title || getSectionLabel(section.type)}
    //             </Typography.Text>
    //             <Tag color="blue">{getSectionLabel(section.type)}</Tag>
    //           </div>

    //           <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
    //             <span>
    //               Questions: <b>{section.questions_count}</b>
    //             </span>
    //             <span>
    //               Duration: <b>{section.duration} min</b>
    //             </span>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   ),
    // },
    {
      title: "Sections",
      key: "sections",
      render: (_, record) => <span>{record.sections.length} sections</span>,
    },
    {
      title: "Questions",
      key: "questions",
      dataIndex: "total_questions",
    },
    {
      title: "Duration",
      key: "duration",
      dataIndex: "total_duration",
      render: (val) => `${val} min`,
    },
    {
      title: "Status",
      dataIndex: "published",
      key: "published",
      render: (published) => (
        <Tag color={published ? "green" : "red"}>
          {published ? "Published" : "Draft"}
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
            disabled={!record.published}
            icon={<GiProgression />}
          >
            Take Test
          </Button>
        </Space>
      ),
    },
  ];

  const renderExpandedRow = (record: any) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
        {record.sections.map((section: any) => (
          <Card
            key={section.id}
            size="small"
            className="rounded-xl border border-gray-200 shadow-sm"
          >
            <Space orientation="vertical" size={6} style={{ width: "100%" }}>
              <Typography.Text strong>
                {section.title || getSectionLabel(section.type)}
              </Typography.Text>
              <Tag color="blue">{getSectionLabel(section.type)}</Tag>
              <Typography.Text type="secondary">
                Questions: <b>{section.questions_count}</b>
              </Typography.Text>
              <Typography.Text type="secondary">
                Duration: <b>{section.duration} min</b>
              </Typography.Text>
            </Space>
          </Card>
        ))}
      </div>
    );
  };

  const onlyPublishedTests = useMemo(
    () => mockTests.filter((test) => test.published),
    [mockTests],
  );
  console.log("Only Published Mock Tests:", onlyPublishedTests);

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
        <h1 className="text-2xl font-bold">Mock Tests</h1>
        <p className="opacity-90">
          Here are the available mock tests for practice.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Available Mock Tests
        </h2>
        <Table
          dataSource={onlyPublishedTests}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          expandable={{
            expandedRowRender: renderExpandedRow,
            rowExpandable: (record) => record.sections?.length > 0,
          }}
        />
      </div>
    </div>
  );
}

export default StudentMockTests;
