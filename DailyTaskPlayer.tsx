// import React, { useMemo, useState } from "react";
// import {
//   Alert,
//   Button,
//   Card,
//   Progress,
//   Space,
//   Typography,
//   message,
// } from "antd";
// import QuestionRenderer from "./src/components/questions/QuestionRenderer";
// // import QuestionRenderer from "../components/questions/QuestionRendere";

// const { Title, Text } = Typography;

// /**
//  * Props:
//  * - questions: array of question objects
//  * - onSaveResponse: async ({ question_id, response }) => {}
//  * - onSubmitTask: async ({ responses }) => {}
//  * - title?: string
//  * - dtsId?: string
//  */
// const DailyTaskPlayer = ({
//   questions = [],
//   onSaveResponse,
//   onSubmitTask,
//   title = "Daily Task",
//   dtsId = null,
// }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [responses, setResponses] = useState({});
//   const [actionLoading, setActionLoading] = useState(false);

//   const currentQuestion = questions[currentIndex];
//   const isLastQuestion = currentIndex === questions.length - 1;

//   const handleResponse = (response) => {
//     if (!currentQuestion) return;

//     setResponses((prev) => ({
//       ...prev,
//       [currentQuestion.id]: response,
//     }));
//   };

//   const handleNextOrSubmit = async () => {
//     try {
//       if (!currentQuestion) {
//         message.error("No current question found");
//         return;
//       }

//       const currentResponse = responses[currentQuestion.id];

//       if (!currentResponse) {
//         message.warning("Please answer the current question before proceeding");
//         return;
//       }

//       setActionLoading(true);

//       // Save current question response
//       if (onSaveResponse) {
//         await onSaveResponse({
//           question_id: currentQuestion.id,
//           response: currentResponse,
//           dts_id: dtsId,
//         });
//       }

//       if (!isLastQuestion) {
//         setCurrentIndex((prev) => prev + 1);
//         message.success("Response saved");
//       } else {
//         // Save last response already done above, now submit full task
//         if (onSubmitTask) {
//           await onSubmitTask({
//             dts_id: dtsId,
//             responses,
//             last_question_id: currentQuestion.id,
//             last_response: currentResponse,
//           });
//         }

//         message.success("Daily task submitted successfully");
//       }
//     } catch (err) {
//       console.error(err);
//       message.error(err?.message || "Something went wrong");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const progressPercent = useMemo(() => {
//     if (!questions.length) return 0;
//     return Math.round(((currentIndex + 1) / questions.length) * 100);
//   }, [currentIndex, questions.length]);

//   if (!questions.length || !currentQuestion) {
//     return (
//       <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
//         <Alert
//           type="warning"
//           showIcon
//           message="No questions found"
//           description="This daily task does not contain any questions."
//         />
//       </div>
//     );
//   }

//   return (
//     <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
//       <Card style={{ marginBottom: 20 }}>
//         <Space direction="vertical" style={{ width: "100%" }}>
//           <Title level={3} style={{ margin: 0 }}>
//             {title}
//           </Title>

//           {dtsId && (
//             <Text>
//               DTS ID: <b>{dtsId}</b>
//             </Text>
//           )}

//           <Text>
//             Question {currentIndex + 1} of {questions.length}
//           </Text>

//           <Progress percent={progressPercent} />
//         </Space>
//       </Card>

//       <QuestionRenderer
//         key={currentQuestion.id}
//         question={currentQuestion}
//         questionNumber={currentIndex + 1}
//         totalQuestions={questions.length}
//         onResponse={handleResponse}
//         loading={false}
//       />

//       <Card style={{ marginTop: 20 }}>
//         <Space direction="vertical" style={{ width: "100%" }}>
//           <Text strong>Current Draft Response</Text>

//           <pre
//             style={{
//               background: "#f5f5f5",
//               padding: 12,
//               borderRadius: 8,
//               overflow: "auto",
//               margin: 0,
//             }}
//           >
//             {JSON.stringify(responses[currentQuestion.id] || null, null, 2)}
//           </pre>

//           <div style={{ display: "flex", justifyContent: "flex-end" }}>
//             <Button
//               type="primary"
//               loading={actionLoading}
//               onClick={handleNextOrSubmit}
//               disabled={!responses[currentQuestion.id]}
//             >
//               {isLastQuestion ? "Submit" : "Next"}
//             </Button>
//           </div>
//         </Space>
//       </Card>
//     </div>
//   );
// };

// export default DailyTaskPlayer;

import React, { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Progress,
  Space,
  Typography,
  message,
} from "antd";
import { useMutation } from "@tanstack/react-query";
// import QuestionRenderer from "../components/questions/QuestionRenderer";
// import { sendRequest } from "../hooks/useHttp";
import QuestionRenderer from "./src/components/questions/QuestionRenderer";
import useHttp from "./src/hooks/use-http";

const { Title, Text } = Typography;

const DailyTaskPlayer = ({
  questions = [],
  title = "Daily Task",
  dtsId,
  onSubmitTask,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<any>({});
  const { sendRequest } = useHttp({ type: "auth" });

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const submitDailyTaskCall: any = useMutation({
    mutationFn: (payload) =>
      sendRequest({
        url: "submitDailyTask",
        method: "POST",
        payload,
      }),
    onSuccess: () => {
      message.success("Daily task submitted successfully");
    },
    onError: (err) => {
      console.error(err);
      message.error(err?.message || "Failed to submit daily task");
    },
  });

  const saveQuestionResponseCall = useMutation({
    mutationFn: (payload) =>
      sendRequest({
        url: "saveQuestionResponse",
        method: "POST",
        payload,
      }),
    onSuccess: () => {
      if (!isLastQuestion) {
        setCurrentIndex((prev) => prev + 1);
        message.success("Response saved");
      }
      //   else {
      //     onSubmitTask?.({
      //       dts_id: "39574d4c-af65-406d-9a87-7f47e41dc8ef",
      //       responses,
      //       last_question_id: currentQuestion.id,
      //       last_response: responses[currentQuestion.id],
      //     });
      //     message.success("Daily task submitted successfully");
      //   }
    },
    onError: (err) => {
      console.error(err);
      message.error(err?.message || "Failed to save response");
    },
  });

  const handleResponse = (response) => {
    if (!currentQuestion) return;

    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: response,
    }));
  };

  const handleNextOrSubmit = async () => {
    if (!currentQuestion) {
      message.error("No current question found");
      return;
    }

    const currentResponse = responses[currentQuestion.id];

    if (!currentResponse) {
      message.warning("Please answer the current question before proceeding");
      return;
    }

    const response = await saveQuestionResponseCall.mutate(currentResponse);
    console.log(
      "Save response API call result:",
      response,
      saveQuestionResponseCall.isSuccess,
      saveQuestionResponseCall.status,
    );
    // if (isLastQuestion && response) {
    //   await submitDailyTaskCall.mutate({
    //     dts_id: "39574d4c-af65-406d-9a87-7f47e41dc8ef",
    //   });
    // }
  };

  const progressPercent = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round(((currentIndex + 1) / questions.length) * 100);
  }, [currentIndex, questions.length]);

  if (!questions.length || !currentQuestion) {
    return (
      <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <Alert
          type="warning"
          showIcon
          message="No questions found"
          description="This daily task does not contain any questions."
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <Card style={{ marginBottom: 20 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Title level={3} style={{ margin: 0 }}>
            {title}
          </Title>

          {dtsId && (
            <Text>
              DTS ID: <b>{dtsId}</b>
            </Text>
          )}

          <Text>
            Question {currentIndex + 1} of {questions.length}
          </Text>

          <Progress percent={progressPercent} />
        </Space>
      </Card>

      <QuestionRenderer
        key={currentQuestion.id}
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        onResponse={handleResponse}
        loading={false}
      />

      <Card style={{ marginTop: 20 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text strong>Current Draft Response</Text>

          <pre
            style={{
              background: "#f5f5f5",
              padding: 12,
              borderRadius: 8,
              overflow: "auto",
              margin: 0,
            }}
          >
            {JSON.stringify(responses[currentQuestion.id] || null, null, 2)}
          </pre>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              loading={saveQuestionResponseCall.isPending}
              onClick={handleNextOrSubmit}
              disabled={!responses[currentQuestion.id]}
            >
              {isLastQuestion ? "Submit" : "Next"}
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default DailyTaskPlayer;
