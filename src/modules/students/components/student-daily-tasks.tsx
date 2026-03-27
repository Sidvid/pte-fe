import useHttp from "@/hooks/use-http";
import { useMutation } from "@tanstack/react-query";
import { Table, TableProps, Tag, Button, Space } from "antd";
import React, { useEffect, useState } from "react";
import { GiProgression } from "react-icons/gi";
import { useNavigate } from "react-router";

interface Task {
  id: string;
  title: string;
  question_type: string;
  length: number;
  duration: number;
  count: number;
  created_at: string;
}

function StudentDailyTasks() {
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const { sendRequest } = useHttp({ type: "auth" });
  const navigate = useNavigate();

  // Fetch assigned tasks for the student
  const fetchAssignedTasks = useMutation({
    mutationFn: () =>
      sendRequest({ url: "allDailyTask", method: "GET" }) as Promise<any>,
    onSuccess: (data) => {
      // For demo purposes, we'll transform the response or use sample data
      if (data?.response?.data && Array.isArray(data.response.data)) {
        // Check if the data has the expected structure for tasks
        if (
          data.response.data.length > 0 &&
          (data.response.data[0].title || data.response.data[0].name)
        ) {
          // Transform the actual data if available
          const transformedTasks = data.response.data.map(
            (task: any, index: number) => ({
              id: task.id || `task${index}`,
              title: task.title || task.name || `Sample Task ${index + 1}`,
              question_type: task.question_type || task.type || "FIB_RW",
              length: task.length || task.duration || 10,
              duration: task.duration || task.time || 20,
              count: task.count || task.questions || 5,
              created_at:
                task.created_at || task.date || new Date().toISOString(),
            }),
          );
          setAssignedTasks(transformedTasks);
        } else {
          // Sample data in case the API doesn't return expected format
          setAssignedTasks([
            {
              id: "task1",
              title: "FIB - Drop Down Practice",
              question_type: "FIB_RW",
              length: 10,
              duration: 20,
              count: 5,
              created_at: "2023-01-15T10:30:00Z",
            },
            {
              id: "task2",
              title: "Reading Comprehension",
              question_type: "MC_SINGLE",
              length: 15,
              duration: 25,
              count: 8,
              created_at: "2023-01-16T14:20:00Z",
            },
            {
              id: "task3",
              title: "Listening Blanks",
              question_type: "FIB_LISTENING",
              length: 12,
              duration: 18,
              count: 6,
              created_at: "2023-01-17T09:15:00Z",
            },
          ]);
        }
      } else {
        // Sample data in case the API doesn't return expected format
        setAssignedTasks([
          {
            id: "task1",
            title: "FIB - Drop Down Practice",
            question_type: "FIB_RW",
            length: 10,
            duration: 20,
            count: 5,
            created_at: "2023-01-15T10:30:00Z",
          },
          {
            id: "task2",
            title: "Reading Comprehension",
            question_type: "MC_SINGLE",
            length: 15,
            duration: 25,
            count: 8,
            created_at: "2023-01-16T14:20:00Z",
          },
          {
            id: "task3",
            title: "Listening Blanks",
            question_type: "FIB_LISTENING",
            length: 12,
            duration: 18,
            count: 6,
            created_at: "2023-01-17T09:15:00Z",
          },
        ]);
      }
    },
    onError: (error) => {
      console.error("Error fetching assigned tasks:", error);
      // Use sample data in case of error
      setAssignedTasks([
        {
          id: "task1",
          title: "FIB - Drop Down Practice",
          question_type: "FIB_RW",
          length: 10,
          duration: 20,
          count: 5,
          created_at: "2023-01-15T10:30:00Z",
        },
        {
          id: "task2",
          title: "Reading Comprehension",
          question_type: "MC_SINGLE",
          length: 15,
          duration: 25,
          count: 8,
          created_at: "2023-01-16T14:20:00Z",
        },
        {
          id: "task3",
          title: "Listening Blanks",
          question_type: "FIB_LISTENING",
          length: 12,
          duration: 18,
          count: 6,
          created_at: "2023-01-17T09:15:00Z",
        },
      ]);
    },
  });

  useEffect(() => {
    fetchAssignedTasks.mutate();
  }, []);

  const handleTakeTest = (task: Task) => {
    navigate(`/take-task/${task.id}`);
    console.log("Taking task:", task);
  };

  const columns: TableProps<Task>["columns"] = [
    {
      title: "Task Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Question Type",
      dataIndex: "question_type",
      key: "question_type",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (text) => <span>{text} min</span>,
    },
    {
      title: "Questions",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<GiProgression />}
            onClick={() => handleTakeTest(record)}
          >
            Take Task
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
        <h1 className="text-2xl font-bold">Daily Tasks</h1>
        <p className="opacity-90">Here are your assigned daily tasks.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Assigned Tasks
        </h2>
        <Table
          dataSource={assignedTasks}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
}

export default StudentDailyTasks;
