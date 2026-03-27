import React, { useState, useEffect } from "react";
import { Card, Button, Space, Steps, Alert } from "antd";
import useHttp from "@/hooks/use-http";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router";
import { QuestionItem } from "@/utils/model/response-models";
import FillInTheBlanks from "@/modules/common/show-question/fill-in-the-blank";
import FibDragDrop from "@/modules/common/show-question/fib-drag-drop";
import QuestionRenderer from "@/components/questions/QuestionRenderer";
import { allSampleQuestions } from "@/utils/constants/app-constants";
import TestHIW from "../../../../TestQuestion";

interface TaskDetails {
  id: string;
  title: string;
  question_type: string;
  duration: number;
  count: number;
  questions: QuestionItem[];
}

const StudentTaskView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { sendRequest } = useHttp({ type: "auth" });
  const [currentStep, setCurrentStep] = useState(0);
  const [taskDetails, setTaskDetails] = useState<TaskDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch task details - using allDailyTask for now as a fallback
  const fetchTaskDetails = useMutation({
    mutationFn: () =>
      sendRequest({ url: "allDailyTask", method: "GET" }) as Promise<any>,
    onSuccess: (data) => {
      try {
        if (data?.response?.data?.tasks) {
          // Find the specific task by ID from the list
          const task = data.response.data.tasks.find((t: any) => t.id === id);
          if (task) {
            // Transform the task data to match our interface
            setTaskDetails({
              id: task.id,
              title: task.title || "Task",
              question_type: task.question_type || "",
              duration: task.duration || 0,
              count: task.count || 0,
              questions: task.questions || [], // Assuming the task has questions
            });
          } else {
            // If specific task not found, use the first task as fallback
            const fallbackTask = data.response.data.tasks[0];
            if (fallbackTask) {
              setTaskDetails({
                id: fallbackTask.id,
                title: fallbackTask.title || "Task",
                question_type: fallbackTask.question_type || "",
                duration: fallbackTask.duration || 0,
                count: fallbackTask.count || 0,
                questions: fallbackTask.questions || [],
              });
            } else {
              // Fallback to sample data if no tasks exist
              setTaskDetails({
                id: id || "sample",
                title: "Sample Task",
                question_type: "FIB_RW",
                duration: 20,
                count: 1,
                questions: [
                  {
                    id: "q1",
                    index: 0,
                    type: "FIB_RW",
                    data: {
                      text: 'The tomato is probably the most widely grown }} by the home gardener because of its {{ value, many uses, and relative ease of }}. Originating in Central and South America, the tomato was domesticated in Mexico. There are many related wild species in South America. "Tomati" was the name {{ by Native Americans.',
                    },
                    extra: {},
                    created_at: new Date().toISOString(),
                    sNo: 1,
                  },
                ],
              });
            }
          }
        } else {
          // Fallback to sample data if API response doesn't match expected format
          setTaskDetails({
            id: id || "sample",
            title: "Sample Task",
            question_type: "FIB_RW",
            duration: 20,
            count: 1,
            questions: [
              {
                id: "q1",
                index: 0,
                type: "FIB_RW",
                data: {
                  text: 'The tomato is probably the most widely grown }} by the home gardener because of its {{ value, many uses, and relative ease of }}. Originating in Central and South America, the tomato was domesticated in Mexico. There are many related wild species in South America. "Tomati" was the name {{ by Native Americans.',
                },
                extra: {},
                created_at: new Date().toISOString(),
                sNo: 1,
              },
            ],
          });
        }
        setLoading(false);
      } catch (e) {
        console.error("Error processing task data:", e);
        setError("Error processing task data");
        setLoading(false);
      }
    },
    onError: (err) => {
      console.error("Error fetching task details:", err);
      setError("Failed to load task. Using sample data.");

      // Set sample data on error
      setTaskDetails({
        id: id || "sample",
        title: "Sample Task",
        question_type: "FIB_RW",
        duration: 20,
        count: 1,
        questions: [
          {
            id: "q1",
            index: 0,
            type: "FIB_RW",
            data: {
              text: 'The tomato is probably the most widely grown }} by the home gardener because of its {{ value, many uses, and relative ease of }}. Originating in Central and South America, the tomato was domesticated in Mexico. There are many related wild species in South America. "Tomati" was the name {{ by Native Americans.',
            },
            extra: {},
            created_at: new Date().toISOString(),
            sNo: 1,
          },
        ],
      });
      setLoading(false);
    },
  });

  useEffect(() => {
    fetchTaskDetails.mutate();
  }, [id]);

  const handleNext = () => {
    if (currentStep < (taskDetails?.questions.length || 0) - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Submit task answers
    console.log("Submitting task answers");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading task...</span>
      </div>
    );
  }

  if (
    !taskDetails ||
    !taskDetails.questions ||
    taskDetails.questions.length === 0
  ) {
    return (
      <div className="p-6">
        {/* <Alert
          message="No Questions Found"
          description="This task doesn't contain any questions. Please contact your administrator."
          type="warning"
          showIcon
          className="mb-4"
        />
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Task: {taskDetails?.title || "Sample Task"}
          </h2>
          <p>No questions are available for this task.</p>
        </div> */}
        <TestHIW />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
        <h1 className="text-2xl font-bold">{taskDetails?.title || "Task"}</h1>
        <div className="flex justify-between mt-2">
          <span>Duration: {taskDetails?.duration || 0} minutes</span>
          <span>Questions: {taskDetails?.questions.length || 0}</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <Steps
          current={currentStep}
          items={taskDetails?.questions.map((_, index) => ({
            title: `Q${index + 1}`,
          }))}
          className="mb-6"
        />

        {taskDetails?.questions[currentStep] && (
          <div className="mb-6">
            <div className="mt-2 text-sm text-gray-500">
              Question #
              {taskDetails.questions[currentStep].sNo || currentStep + 1}
            </div>
            {taskDetails.questions[currentStep].type === "FIB_RW" && (
              <FillInTheBlanks
                text={
                  typeof taskDetails.questions[currentStep].data === "object"
                    ? (taskDetails.questions[currentStep].data as any).text
                    : taskDetails.questions[currentStep].data
                }
              />
            )}
            {taskDetails.questions[currentStep].type ===
              "FIB_DRAG_AND_DROP" && (
              <FibDragDrop questions={[taskDetails.questions[currentStep]]} />
            )}
            {/* Handle other question types if needed */}
            {!["FIB_RW", "FIB_DRAG_AND_DROP"].includes(
              taskDetails.questions[currentStep].type,
            ) && (
              <div>
                <p>
                  Unsupported question type:{" "}
                  {taskDetails.questions[currentStep].type}
                </p>
                <pre>
                  {JSON.stringify(taskDetails.questions[currentStep], null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between">
          <Button disabled={currentStep === 0} onClick={handlePrevious}>
            Previous
          </Button>
          {currentStep < (taskDetails?.questions.length || 0) - 1 ? (
            <Button type="primary" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="primary" onClick={handleSubmit}>
              Submit Task
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentTaskView;
