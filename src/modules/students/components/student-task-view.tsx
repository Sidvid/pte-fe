import React, { useState, useEffect } from "react";
import { Card, Button, Space, Steps, Alert, message } from "antd";
import useHttp from "@/hooks/use-http";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";
import { QuestionItem } from "@/utils/model/response-models";
import FillInTheBlanks from "@/modules/common/show-question/fill-in-the-blank";
import FibDragDrop from "@/modules/common/show-question/fib-drag-drop";
import QuestionRenderer from "@/components/questions/QuestionRenderer";
import { allSampleQuestions } from "@/utils/constants/app-constants";
import MockTestPlayer from "../../../../MockTestPlayer";
import DailyTaskPlayer from "../../../../DailyTaskPlayer";
import MockTestPreviewPage from "../../../../TestMockPlayer";
import MockTestIntroPage from "@/pte-test-players/mock-test-components/MockTestIntroPage";

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

  const taskIdFromParams = params.id;
  const taskState = location.state;

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
      localStorage.setItem(
        "current_dts_id",
        data?.response?.data?.dts_id || "",
      );
      // setLoading(false);
    },
    onError: (err: any) => {
      console.error(err);
      message.error(err?.message || "Failed to start section");
    },
  });

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
  return (
    <>
      {taskState?.isDailyTask ? (
        <DailyTaskPlayer
          questions={questionsFromTask}
          // title="Daily Task"
          // dtsId={localStorage.getItem("current_dts_id")}
        />
      ) : (
        <MockTestIntroPage
          testData={questionsFromTask?.data}
          onProceed={() => null}
          loading={false}
        />
      )}
    </>
  );
};

export default StudentTaskView;
