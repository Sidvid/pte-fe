// import React, { useMemo, useState } from "react";
// import { Card, Button, Space, Typography, Progress } from "antd";
// import QuestionRenderer from "@/components/questions/QuestionRenderer";
// // import QuestionRenderer from "./QuestionRenderer";

// const { Title, Text } = Typography;

// const MockTestPlayer = ({ mockTestResponse }) => {
//   const testData = mockTestResponse;
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [responses, setResponses] = useState({});

//   const flatQuestions = useMemo(() => {
//     if (!testData?.mock_test_sections) return [];

//     return mockTestResponse.mock_test_sections.flatMap(
//       (section, sectionIndex) =>
//         section.questions.map((question, questionIndex) => ({
//           ...question,
//           sectionId: section.id,
//           sectionTitle: section.title,
//           sectionType: section.type,
//           sectionLength: section.length,
//           sectionDuration: section.duration,
//           sectionIndex,
//           questionIndex,
//         })),
//     );
//   }, [testData]);

//   const currentQuestion = flatQuestions[currentIndex];

//   const handleResponse = (response) => {
//     setResponses((prev) => ({
//       ...prev,
//       [currentQuestion.id]: response,
//     }));
//     console.log("Saved response:", response);
//   };

//   const handleNext = () => {
//     if (currentIndex < flatQuestions.length - 1) {
//       setCurrentIndex((prev) => prev + 1);
//     }
//   };

//   const handlePrev = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex((prev) => prev - 1);
//     }
//   };

//   if (!testData || !currentQuestion) return <div>No mock test data</div>;

//   return (
//     <div style={{ padding: 24 }}>
//       <Card style={{ marginBottom: 16 }}>
//         <Title level={3}>{testData.title}</Title>
//         <Space direction="vertical">
//           <Text>
//             Section: <b>{currentQuestion.sectionTitle}</b>
//           </Text>
//           <Text>
//             Section Type: <b>{currentQuestion.sectionType}</b>
//           </Text>
//           <Text>
//             Question {currentIndex + 1} of {flatQuestions.length}
//           </Text>
//         </Space>

//         <Progress
//           percent={Math.round(
//             ((currentIndex + 1) / flatQuestions.length) * 100,
//           )}
//           style={{ marginTop: 16 }}
//         />
//       </Card>

//       <QuestionRenderer
//         question={currentQuestion}
//         questionNumber={currentIndex + 1}
//         totalQuestions={flatQuestions.length}
//         onResponse={handleResponse}
//         loading={false}
//       />

//       <div
//         style={{
//           marginTop: 20,
//           display: "flex",
//           justifyContent: "space-between",
//         }}
//       >
//         <Button onClick={handlePrev} disabled={currentIndex === 0}>
//           Previous
//         </Button>

//         <Button
//           type="primary"
//           onClick={handleNext}
//           disabled={currentIndex === flatQuestions.length - 1}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default MockTestPlayer;

import React, { useMemo, useState } from "react";
import { Button, Card, Progress, Space, Typography, Alert } from "antd";
// import QuestionRenderer from "../components/questions/QuestionRenderer";
// import { normalizeQuestionType } from "../utils/questionType";
import QuestionRenderer from "@/components/questions/QuestionRenderer";
import { normalizeQuestionType } from "@/utils/constants/questtionTypes";

const { Title, Text } = Typography;

const MockTestPlayer = ({ mockTestResponse }) => {
  const testData = mockTestResponse?.data;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});

  const flatQuestions = useMemo(() => {
    if (!testData?.mock_test_sections?.length) return [];

    return testData.mock_test_sections.flatMap((section, sectionIndex) =>
      (section.questions || []).map((question, questionIndex) => ({
        ...question,
        type: normalizeQuestionType(question.type),
        originalType: question.type,
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
    if (!currentQuestion) return;

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

  if (!testData) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          type="error"
          showIcon
          message="No mock test data"
          description="Mock test response is missing or invalid."
        />
      </div>
    );
  }

  if (!flatQuestions.length || !currentQuestion) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          type="warning"
          showIcon
          message="No questions found"
          description="This mock test does not contain any renderable questions."
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ marginBottom: 16 }}>
        <Title level={3}>{testData.title}</Title>

        <Space orientation="vertical">
          <Text>
            Section: <b>{currentQuestion.sectionTitle}</b>
          </Text>

          {/* <Text>
            Section Type: <b>{currentQuestion.sectionType}</b>
          </Text> */}

          <Text>
            Question {currentIndex + 1} of {flatQuestions.length}
          </Text>

          {/* <Text>
            Question Type: <b>{currentQuestion.originalType}</b>
          </Text> */}
        </Space>

        <Progress
          percent={Math.round(
            ((currentIndex + 1) / flatQuestions.length) * 100,
          )}
          style={{ marginTop: 16 }}
        />
      </Card>

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

      <QuestionRenderer
        key={currentQuestion.id}
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={flatQuestions.length}
        onResponse={handleResponse}
        loading={false}
      />

      <Card style={{ marginTop: 16 }}>
        <Text strong>Current Draft Response</Text>
        <pre
          style={{
            background: "#f5f5f5",
            padding: 12,
            borderRadius: 8,
            overflow: "auto",
            marginTop: 8,
          }}
        >
          {JSON.stringify(responses[currentQuestion.id] || null, null, 2)}
        </pre>
      </Card>

      {/* <div
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
      </div> */}
    </div>
  );
};

export default MockTestPlayer;
