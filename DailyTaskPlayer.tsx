import React, { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Progress,
  Skeleton,
  Space,
  Typography,
  message,
} from "antd";
import { useMutation } from "@tanstack/react-query";
import QuestionRenderer from "@/components/questions/QuestionRenderer";
import useHttp from "@/hooks/use-http";
import { getQuestionTitle } from "@/utils/constants/questtionTypes";
import { useNavigate } from "react-router";

const { Title, Text } = Typography;

const DailyTaskPlayer = ({ questions = [], title = "Daily Task" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const { sendRequest } = useHttp({ type: "auth" });
  const navigate = useNavigate();

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const submitDailyTaskCall = useMutation<any, Error, any>({
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

  const saveQuestionResponseCall = useMutation<any, Error, any>({
    mutationFn: (payload) =>
      sendRequest({
        url: "saveQuestionResponse",
        method: "POST",
        payload,
      }),
    onError: (err) => {
      console.error(err);
      message.error(err?.message || "Failed to save response");
    },
  });

  // child should send only response body
  const handleResponse = (response) => {
    if (!currentQuestion) return;

    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: response,
    }));
  };

  const handleNextOrSubmit = async () => {
    try {
      if (!currentQuestion) {
        message.error("No current question found");
        return;
      }

      const currentResponse = responses[currentQuestion.id];

      if (!currentResponse) {
        message.warning("Please answer the current question before proceeding");
        return;
      }

      await saveQuestionResponseCall.mutateAsync({
        question_id: currentQuestion.id,
        dts_id: localStorage.getItem("current_dts_id"),
        response: currentResponse,
      });

      if (isLastQuestion) {
        await submitDailyTaskCall.mutateAsync({
          dts_id: localStorage.getItem("current_dts_id"),
        });
        navigate("/dashboard");
        return;
      }

      message.success("Response saved");
      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      message.error(err?.message || "Something went wrong");
    }
  };

  const progressPercent = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round(((currentIndex + 1) / questions.length) * 100);
  }, [currentIndex, questions.length]);

  if (!questions.length || !currentQuestion) {
    return (
      <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        {/* <Alert
          type="warning"
          showIcon
          message="No questions found"
          description="This daily task does not contain any questions."
        /> */}
        <Skeleton />;
      </div>
    );
  }

  const buttonLoading =
    saveQuestionResponseCall.isPending || submitDailyTaskCall.isPending;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <Card style={{ marginBottom: 20 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Title level={3} style={{ margin: 0 }}>
            {`${title} - ${getQuestionTitle(questions[0]?.type)}`}
          </Title>
          <Text>
            Question {currentIndex + 1} of {questions.length}
          </Text>

          <Progress percent={progressPercent} />
        </Space>
      </Card>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Button
          type="primary"
          loading={buttonLoading}
          onClick={handleNextOrSubmit}
          disabled={!responses[currentQuestion.id]}
        >
          {isLastQuestion ? "Submit" : "Next"}
        </Button>
      </div>

      <QuestionRenderer
        key={currentQuestion.id}
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        onResponse={handleResponse}
        loading={false}
        isPaused={
          saveQuestionResponseCall.isPending || submitDailyTaskCall.isPending
        }
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
        </Space>
      </Card>
    </div>
  );
};

export default DailyTaskPlayer;
