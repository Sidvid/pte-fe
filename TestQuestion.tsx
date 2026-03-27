import React, { useMemo, useState } from "react";
import { Card, Button, Space, Typography, Progress } from "antd";
import QuestionRenderer from "@/components/questions/QuestionRenderer";
// import QuestionRenderer from "./QuestionRenderer";

const { Title, Text } = Typography;

const MockTestPlayer = ({ mockTestResponse }) => {
  const testData = mockTestResponse;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});

  const flatQuestions = useMemo(() => {
    if (!testData?.mock_test_sections) return [];

    return mockTestResponse.mock_test_sections.flatMap(
      (section, sectionIndex) =>
        section.questions.map((question, questionIndex) => ({
          ...question,
          sectionId: section.id,
          sectionTitle: section.title,
          sectionType: section.type,
          sectionLength: section.length,
          sectionDuration: section.duration,
          sectionIndex,
          questionIndex,
        })),
    );
  }, [testData]);

  const currentQuestion = flatQuestions[currentIndex];

  const handleResponse = (response) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: response,
    }));
    console.log("Saved response:", response);
  };

  const handleNext = () => {
    if (currentIndex < flatQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (!testData || !currentQuestion) return <div>No mock test data</div>;

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ marginBottom: 16 }}>
        <Title level={3}>{testData.title}</Title>
        <Space direction="vertical">
          <Text>
            Section: <b>{currentQuestion.sectionTitle}</b>
          </Text>
          <Text>
            Section Type: <b>{currentQuestion.sectionType}</b>
          </Text>
          <Text>
            Question {currentIndex + 1} of {flatQuestions.length}
          </Text>
        </Space>

        <Progress
          percent={Math.round(
            ((currentIndex + 1) / flatQuestions.length) * 100,
          )}
          style={{ marginTop: 16 }}
        />
      </Card>

      <QuestionRenderer
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={flatQuestions.length}
        onResponse={handleResponse}
        loading={false}
      />

      <div
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button onClick={handlePrev} disabled={currentIndex === 0}>
          Previous
        </Button>

        <Button
          type="primary"
          onClick={handleNext}
          disabled={currentIndex === flatQuestions.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default MockTestPlayer;
