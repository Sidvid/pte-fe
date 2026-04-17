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
  Tabs,
  TabsProps,
} from "antd";
import { GiProgression } from "react-icons/gi";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { getSectionLabel } from "@/utils/helpers/core-helpers";
import { GrInProgress } from "react-icons/gr";

interface MockTest {
  id: string;
  title: string;
  published: boolean;
  collection_id: number;
  total_questions: number;
  total_duration: number;
  attempt_status?: "NOT_STARTED" | "ONGOING" | "COMPLETED";
  mts_id?: string; // Added mts_id to track ongoing/completed attempts
  sections: Array<{
    id: string;
    title: string;
    type: string;
    questions_count: number;
    duration: number;
  }>;
}

function StudentMockTests() {
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [isLabStudent, setIsLabStudent] = useState(false);

  const { sendRequest } = useHttp({ type: "auth" });
  const navigate = useNavigate();

  // Fetch mock tests
  const fetchMockTests = useMutation({
    mutationFn: () =>
      sendRequest({ url: "allMockTests", method: "GET" }) as Promise<any>,
    onSuccess: (data) => {
      if (data?.response?.data && Array.isArray(data.response.data?.tests)) {
        const { response } = data;
        setMockTests(response.data.tests);
      }
    },
    onError: (error: any) => {
      console.error("Error fetching mock tests:", error);
      notification.error({
        title: error?.message || "Failed to load mock tests",
      });
    },
  });

  useEffect(() => {
    fetchMockTests.mutate();
    if (
      JSON.parse(localStorage.getItem("studentProfile_modes") || "{}")
        ?.exam_mode
    ) {
      setIsLabStudent(true);
    }
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
      dataIndex: "attempt_status",
      key: "attempt_status",
      render: (attempt_status) => (
        <Tag
          variant="outlined"
          color={
            attempt_status === "COMPLETED"
              ? "green"
              : attempt_status === "ONGOING"
                ? "blue"
                : "red"
          }
        >
          {attempt_status === "COMPLETED"
            ? "Completed"
            : attempt_status === "ONGOING"
              ? "Ongoing"
              : "Not Started"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "mock_action",
      render: (_, record) => {
        if (record.attempt_status === "ONGOING") {
          return (
            <Button
              type="primary"
              icon={<GrInProgress />}
              onClick={() =>
                navigate(`/mock-test/${record.id}?mts_id=${record.mts_id}`)
              }
            >
              Resume
            </Button>
          );
        }

        return (
          <Button
            type="primary"
            icon={<GiProgression />}
            onClick={() => navigate(`/mock-test/${record.id}`)}
            disabled={
              !record.published || record.attempt_status === "COMPLETED"
            }
          >
            Take Test
          </Button>
        );
      },
    },
  ];

  const renderExpandedRow = (record: MockTest) => {
    return (
      <div className="grid grid-cols-1 gap-4 py-2 md:grid-cols-3">
        {record.sections.map((section) => (
          <Card
            key={section.id}
            size="small"
            className="rounded-xl border border-gray-200 shadow-sm"
          >
            <Space direction="vertical" size={6} style={{ width: "100%" }}>
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

  const publishedTests = useMemo(
    () => mockTests.filter((test) => test.published),
    [mockTests],
  );

  const mockTestsData = useMemo(
    () => publishedTests.filter((test) => test.collection_id === 1),
    [publishedTests],
  );

  const officialTestsData = useMemo(
    () => publishedTests.filter((test) => test.collection_id === 2),
    [publishedTests],
  );

  const tabItems: TabsProps["items"] = [
    {
      key: "mock-tests",
      label: "Mock Tests",
      children: (
        <Table
          dataSource={mockTestsData}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          expandable={{
            expandedRowRender: renderExpandedRow,
            rowExpandable: (record) => record.sections?.length > 0,
          }}
        />
      ),
    },
    {
      key: "official-tests",
      label: (
        <Space size={6}>
          <span>Official Test</span>
        </Space>
      ),
      disabled: !isLabStudent,
      children: (
        <Table
          dataSource={officialTestsData}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          expandable={{
            expandedRowRender: renderExpandedRow,
            rowExpandable: (record) => record.sections?.length > 0,
          }}
        />
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Mock Tests</h1>
        <p className="opacity-90">
          Practice from mock tests and official tests based on your access.
        </p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Available Tests
        </h2>

        <Tabs defaultActiveKey="mock-tests" items={tabItems} />
      </div>
    </div>
  );
}

export default StudentMockTests;
