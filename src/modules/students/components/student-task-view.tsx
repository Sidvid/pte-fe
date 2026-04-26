import React, { useState, useEffect } from "react";
import { message } from "antd";
import useHttp from "@/hooks/use-http";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";
import { QuestionItem } from "@/utils/model/response-models";
import DailyTaskPlayer from "../../../../DailyTaskPlayer";
import MockTestIntroPage from "@/pte-test-players/mock-test-components/MockTestIntroPage";
import MockTestExamPage from "@/pte-test-players/mock-test-components/MockTestExamPage";

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
  const [questionsFromTask, setQuestionsFromTask] = useState<any[] | any>(
    [] || null,
  );
  const params = useParams();
  console.log("%%%location****", location);

  const taskIdFromParams = params.id;
  const taskState = location.state;
  const [showExam, setShowExam] = useState(false);
  const [mtsId, setMtsId] = useState<string | null>(null);

  console.log("taskId from params:", taskIdFromParams);
  console.log("navigation state:", taskState);

  const taskIdFromState = taskState?.taskId || taskIdFromParams;
  console.log("Derived taskId:", taskIdFromState);

  const startDailyTask = useMutation({
    mutationFn: (payload: any) =>
      sendRequest({
        url: "startDailyTask",
        method: "POST",
        // endURL: `${payload.mts_id}/sections/${payload.section_id}/start`,
        endURL: `${payload.task_id}/start`,
      }),
    onSuccess: (data: any) => {
      console.log("getAllQuestionsFromTask success raw response:", data);
      // setQuestionsFromTask(data?.response?.data || []);
      localStorage.setItem("current_dts_id", data?.response?.dts_id || "");
      // setLoading(false);
    },
    onError: (err: any) => {
      console.error(err);
      message.error(err?.message || "Failed to start section");
    },
  });
  console.log("Questions from task:", taskState);
  useEffect(() => {
    if (taskState?.isDailyTask) {
      startDailyTask.mutateAsync({ task_id: taskIdFromState });
    }
  }, [taskIdFromState, taskState?.isDailyTask]);

  const getAllQuestionsFromTask = useMutation({
    mutationFn: (payload: any) =>
      sendRequest({
        url: "getQuestionsFromTask",
        method: "GET",
        // endURL: `${payload.mts_id}/sections/${payload.section_id}/start`,
        endURL: `daily-tasks/${payload.taskId}/questions`,
      }),
    onSuccess: (data: any) => {
      console.log("getAllQuestionsFromTask success raw response:", data);
      setQuestionsFromTask(data?.response?.data || []);
      setLoading(false);
    },
    onError: (err: any) => {
      console.error(err);
      message.error(err?.message || "Failed to start section");
    },
  });

  const startMockTestCall = useMutation({
    mutationFn: () =>
      sendRequest({
        url: "startMockTest",
        method: "POST",
        endURL: `${taskState?.taskId}/start`,
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

  const getAllQuestionsForMockTest = useMutation({
    mutationFn: (payload: any) =>
      sendRequest({
        url: "getMockTestQuestions",
        method: "GET",
        // endURL: `${payload.mts_id}/sections/${payload.section_id}/start`,
        endURL: `${payload.taskId}`,
      }),
    onSuccess: (data: any) => {
      console.log("getAllQuestionsFromTask success raw response:", data);
      setQuestionsFromTask(data?.response || []);
      setLoading(false);
    },
    onError: (err: any) => {
      console.error(err);
      message.error(err?.message || "Failed to start section");
    },
  });

  useEffect(() => {
    if (taskState?.isDailyTask) {
      getAllQuestionsFromTask.mutateAsync({ taskId: taskIdFromState });
    } else {
      getAllQuestionsForMockTest.mutateAsync({ taskId: taskIdFromState });
    }
  }, [taskIdFromState, taskState?.isDailyTask]);

  console.log("Questions from task:", questionsFromTask);

  const mockTestResponse =
    getAllQuestionsForMockTest.data?.response ||
    getAllQuestionsForMockTest.data?.data ||
    getAllQuestionsForMockTest.data;

  const handleStartMockProceed = async () => {
    try {
      await startMockTestCall.mutateAsync();
    } catch (err: any) {
      console.error(err);
      message.error(err?.message || "Unable to proceed with mock test");
    }
  };

  return (
    <>
      {taskState?.isDailyTask ? (
        <DailyTaskPlayer questions={questionsFromTask} />
      ) : !showExam ? (
        <MockTestIntroPage
          testData={questionsFromTask?.data}
          onProceed={handleStartMockProceed}
          loading={false}
        />
      ) : (
        <MockTestExamPage
          mockTestResponse={mockTestResponse}
          mtsId={localStorage.getItem("current_mts_id") || mtsId || ""}
          existingSectionAttempts={[]}
          existingResponsesByMtssId={{}}
        />
      )}
    </>
  );
};

export default StudentTaskView;
