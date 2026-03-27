import useHttp from "@/hooks/use-http";
import { useMutation } from "@tanstack/react-query";
import { Table, TableProps, Tag, Button, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface ScheduleItem {
  id: string;
  weekday: string;
  task: string;
  type: "mock" | "task" | "video";
}

function StudentSchedule() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const { sendRequest } = useHttp({ type: "auth" });
  const navigate = useNavigate();

  // Fetch schedule for the student
  const fetchSchedule = useMutation({
    mutationFn: () =>
      sendRequest({ url: "schdule", method: "GET" }) as Promise<any>,
    onSuccess: (data) => {
      if (data?.response?.data && Array.isArray(data.response.data)) {
        // Transform the actual data if available
        const transformedData = data.response.data.map(
          (item: any, index: number) => ({
            id: item.id || `sched${index + 1}`,
            weekday: item.weekday || item.day || `Day ${index + 1}`,
            task: item.task || item.activity || `Sample Activity ${index + 1}`,
            type: item.type || "task",
          }),
        );
        setSchedule(transformedData);
      } else {
        // Sample schedule data
        setSchedule([
          {
            id: "sched1",
            weekday: "Monday",
            task: "FIB - Drop Down Practice",
            type: "task",
          },
          {
            id: "sched2",
            weekday: "Tuesday",
            task: "Mock Test 1",
            type: "mock",
          },
          {
            id: "sched3",
            weekday: "Wednesday",
            task: "Theory Video: Reading",
            type: "video",
          },
          {
            id: "sched4",
            weekday: "Thursday",
            task: "Lab Video: Speaking",
            type: "video",
          },
          {
            id: "sched5",
            weekday: "Friday",
            task: "Listening Comprehension",
            type: "task",
          },
          {
            id: "sched6",
            weekday: "Saturday",
            task: "Writing Practice",
            type: "task",
          },
          {
            id: "sched7",
            weekday: "Sunday",
            task: "Review Week Progress",
            type: "task",
          },
        ]);
      }
    },
    onError: (error) => {
      console.error("Error fetching schedule:", error);
      // Sample schedule data
      setSchedule([
        {
          id: "sched1",
          weekday: "Monday",
          task: "FIB - Drop Down Practice",
          type: "task",
        },
        { id: "sched2", weekday: "Tuesday", task: "Mock Test 1", type: "mock" },
        {
          id: "sched3",
          weekday: "Wednesday",
          task: "Theory Video: Reading",
          type: "video",
        },
        {
          id: "sched4",
          weekday: "Thursday",
          task: "Lab Video: Speaking",
          type: "video",
        },
        {
          id: "sched5",
          weekday: "Friday",
          task: "Listening Comprehension",
          type: "task",
        },
        {
          id: "sched6",
          weekday: "Saturday",
          task: "Writing Practice",
          type: "task",
        },
        {
          id: "sched7",
          weekday: "Sunday",
          task: "Review Week Progress",
          type: "task",
        },
      ]);
    },
  });

  useEffect(() => {
    fetchSchedule.mutate();
  }, []);

  const handleTakeMockTest = (taskId: string) => {
    navigate(`/mock-test/${taskId}`);
  };

  const handleTakeTask = (taskId: string) => {
    navigate(`/take-task/${taskId}`);
  };

  const handleWatchVideo = (videoId: string) => {
    navigate(`/video/${videoId}`);
  };

  const columns: TableProps<ScheduleItem>["columns"] = [
    {
      title: "Day",
      dataIndex: "weekday",
      key: "weekday",
    },
    {
      title: "Activity",
      dataIndex: "task",
      key: "task",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag
          color={
            type === "mock" ? "green" : type === "video" ? "orange" : "blue"
          }
        >
          {type === "mock" ? "Mock Test" : type === "video" ? "Video" : "Task"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "schedule_action",
      render: (_, record) => (
        <Space size="middle">
          {record.type === "mock" && (
            <Button
              type="primary"
              onClick={() => handleTakeMockTest(record.id)}
            >
              Take
            </Button>
          )}
          {record.type === "task" && (
            <Button type="primary" onClick={() => handleTakeTask(record.id)}>
              Start
            </Button>
          )}
          {record.type === "video" && (
            <Button type="primary" onClick={() => handleWatchVideo(record.id)}>
              Watch
            </Button>
          )}
        </Space>
      ),
    },
  ];

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
          dataSource={schedule}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
}

export default StudentSchedule;
