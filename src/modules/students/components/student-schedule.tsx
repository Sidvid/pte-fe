import useHttp from "@/hooks/use-http";
import { SuccessResponse } from "@/utils/model/model";
import { RequestAssignmentResponse } from "@/utils/model/response-models";
import { useMutation } from "@tanstack/react-query";
import { Table, TableProps, Tag, Button, Space, Alert } from "antd";
import React, { useEffect, useState } from "react";
import { FaHourglassStart } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { useNavigate } from "react-router";

interface ScheduleItem {
  collection: string;
  assigned_task_id: string;
  duration: number;
  length: number;
  type: "Mock Test" | "Daily Task" | "Video";
}

function StudentSchedule() {
  const [requestedAssignment, setRequestedAssignment] = useState<any[]>();
  const { sendRequest } = useHttp({ type: "auth" });
  const navigate = useNavigate();

  // Fetch schedule for the student
  const allAssignedTasks = useMutation({
    mutationFn: () =>
      sendRequest({ url: "requestAssignments", method: "GET" }) as Promise<
        SuccessResponse<RequestAssignmentResponse>
      >,
    onSuccess: (data: SuccessResponse<RequestAssignmentResponse>) => {
      const { response } = data;
      console.log("assigned tasks", response);
      setRequestedAssignment(response?.data);
    },
  });
  React.useEffect(() => {
    allAssignedTasks.mutateAsync();
  }, []);

  const handleTakeMockTest = (taskId: string) => {
    navigate(`/mock-test/${taskId}`, {
      state: {
        fromSchedule: true,
        isMockTest: true,
        isDailyTask: false,
        taskId,
      },
    });
  };

  const handleTakeTask = (task: ScheduleItem) => {
    console.log("Taking task:", task);
    navigate(`/take-task/${task?.assigned_task_id}`, {
      state: {
        fromSchedule: true,
        isDailyTask: task.type === "Daily Task" ? true : false,
        isMockTest: task.type === "Mock Test" ? true : false,
        taskId: task?.assigned_task_id,
      },
    });
  };

  const handleWatchVideo = (videoId: string) => {
    navigate(`/video/${videoId}`, {
      state: { fromSchedule: true, taskId: videoId },
    });
  };

  const columns: TableProps<ScheduleItem>["columns"] = [
    {
      title: "Title",
      dataIndex: "collection",
      key: "collection",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (duration) => (
        <Tag variant="outlined" color="volcano">
          {duration} mins
        </Tag>
      ),
    },
    {
      title: "Length",
      dataIndex: "length",
      key: "length",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag
          variant="outlined"
          color={
            type === "Mock Test"
              ? "green"
              : type === "Daily Task"
                ? "magenta"
                : "orange"
          }
        >
          {type === "Mock Test"
            ? "Mock Test"
            : type === "Daily Task"
              ? "Daily Task"
              : "Video"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "schedule_action",
      render: (_, record: ScheduleItem) => (
        <Space size="middle">
          {["Daily Task", "Mock Test"].includes(record.type) && (
            <Button
              type="primary"
              icon={<GiProgression />}
              onClick={() => handleTakeTask(record)}
            >
              Start
            </Button>
          )}
          {record.type === "Video" && (
            <Button
              type="primary"
              icon={<GiProgression />}
              onClick={() => handleWatchVideo(record.assigned_task_id)}
            >
              Watch
            </Button>
          )}
        </Space>
      ),
    },
  ];

  if (allAssignedTasks.isError) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          type="error"
          showIcon
          title="No schedule found for today"
          description="Please log in tomorrow."
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
        <h1 className="text-2xl font-bold">Weekly Schedule</h1>
        <p className="opacity-90">
          Here is your scheduled activities for the week.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Scheduled Activities
        </h2>
        <Table
          dataSource={requestedAssignment}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
}

export default StudentSchedule;
