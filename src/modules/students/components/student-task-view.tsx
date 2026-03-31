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

  const fromSchedule = taskState?.fromSchedule || false;
  const isDailyTask = taskState?.isDailyTask || false;
  const taskIdFromState = taskState?.taskId || taskIdFromParams;
  console.log("Derived taskId:", taskIdFromState);

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

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-64">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  //       <span className="ml-3">Loading task...</span>
  //     </div>
  //   );
  // }

  // if (
  //   !taskDetails ||
  //   !taskDetails.questions ||
  //   taskDetails.questions.length === 0
  // ) {
  //   return (
  //     <div className="p-6">
  //       {/* <Alert
  //         message="No Questions Found"
  //         description="This task doesn't contain any questions. Please contact your administrator."
  //         type="warning"
  //         showIcon
  //         className="mb-4"
  //       />
  //       <div className="bg-white p-6 rounded-xl shadow-md">
  //         <h2 className="text-xl font-semibold mb-4">
  //           Task: {taskDetails?.title || "Sample Task"}
  //         </h2>
  //         <p>No questions are available for this task.</p>
  //       </div> */}
  //       {/* <MockTestPlayer /> */}
  //     </div>
  //   );
  // }
  console.log("Questions from task:", questionsFromTask);
  return (
    // <div className="p-6">
    //   <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
    //     <h1 className="text-2xl font-bold">{taskDetails?.title || "Task"}</h1>
    //     <div className="flex justify-between mt-2">
    //       <span>Duration: {taskDetails?.duration || 0} minutes</span>
    //       <span>Questions: {taskDetails?.questions.length || 0}</span>
    //     </div>
    //   </div>

    //   <div className="bg-white p-6 rounded-xl shadow-md">
    //     <Steps
    //       current={currentStep}
    //       items={taskDetails?.questions.map((_, index) => ({
    //         title: `Q${index + 1}`,
    //       }))}
    //       className="mb-6"
    //     />

    //     {taskDetails?.questions[currentStep] && (
    //       <div className="mb-6">
    //         <div className="mt-2 text-sm text-gray-500">
    //           Question #
    //           {taskDetails.questions[currentStep].sNo || currentStep + 1}
    //         </div>
    //         {taskDetails.questions[currentStep].type === "FIB_RW" && (
    //           <FillInTheBlanks
    //             text={
    //               typeof taskDetails.questions[currentStep].data === "object"
    //                 ? (taskDetails.questions[currentStep].data as any).text
    //                 : taskDetails.questions[currentStep].data
    //             }
    //           />
    //         )}
    //         {taskDetails.questions[currentStep].type ===
    //           "FIB_DRAG_AND_DROP" && (
    //           <FibDragDrop questions={[taskDetails.questions[currentStep]]} />
    //         )}
    //         {/* Handle other question types if needed */}
    //         {!["FIB_RW", "FIB_DRAG_AND_DROP"].includes(
    //           taskDetails.questions[currentStep].type,
    //         ) && (
    //           <div>
    //             <p>
    //               Unsupported question type:{" "}
    //               {taskDetails.questions[currentStep].type}
    //             </p>
    //             <pre>
    //               {JSON.stringify(taskDetails.questions[currentStep], null, 2)}
    //             </pre>
    //           </div>
    //         )}
    //       </div>
    //     )}

    //     <div className="flex justify-between">
    //       <Button disabled={currentStep === 0} onClick={handlePrevious}>
    //         Previous
    //       </Button>
    //       {currentStep < (taskDetails?.questions.length || 0) - 1 ? (
    //         <Button type="primary" onClick={handleNext}>
    //           Next
    //         </Button>
    //       ) : (
    //         <Button type="primary" onClick={handleSubmit}>
    //           Submit Task
    //         </Button>
    //       )}
    //     </div>
    //   </div>
    // </div>
    <>
      {/* <DailyTaskPlayer questions={questionsFromTask} /> */}
      {taskState?.isDailyTask ? (
        <DailyTaskPlayer questions={questionsFromTask} />
      ) : (
        <MockTestPreviewPage />
      )}
    </>
  );
};

export default StudentTaskView;
