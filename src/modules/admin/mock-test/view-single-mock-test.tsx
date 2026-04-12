// import { NoiseBackground } from "@/components/ui/noise-background";
// import QuestionMaker from "@/modules/common/questions-maker/question-maker";
// import {
//   SectionTypeTitle,
//   TypesOfQuestion,
// } from "@/utils/constants/app-constants";
// import { SectionType } from "@/utils/model/common-enums";
// import { AiOutlineInfoCircle } from "react-icons/ai";
// import { Collapse, CollapseProps, Drawer, FloatButton, Select } from "antd";
// import { title } from "process";
// import React from "react";
// import { FaPlusCircle } from "react-icons/fa";
// import Label from "@/components/atoms/label";
// function ViewSingleMockTest() {
//   const [open, setOpen] = React.useState(false);

//   const [selectedQuestionType, setSelectedQuestionType] =
//     React.useState<string>("");
//   const onClose = () => {
//     setOpen(false);
//   };

//   return (
//     <div>
//       <Drawer
//         title="Add New Question"
//         size="large"
//         onClose={onClose}
//         open={open}
//         styles={{
//           body: {
//             paddingBottom: 80,
//           },
//         }}
//       >
//         <div className=" flex flex-col gap-10">
//           <div className="flex gap-10">
//             <div className="flex flex-col items-center ">
//               <Select
//                 title="Question Type"
//                 value={selectedQuestionType || undefined}
//                 placeholder="Select Question Type"
//                 options={Object.keys(TypesOfQuestion)
//                   .map((key) => {
//                     return TypesOfQuestion[key as keyof typeof TypesOfQuestion];
//                   })
//                   .flat()}
//                 className="w-[350px]"
//                 onSelect={(_, { title }) => {
//                   setSelectedQuestionType(title!);
//                 }}
//               />
//               {selectedQuestionType && (
//                 <div className="flex flex-row gap-2 items-center">
//                   <AiOutlineInfoCircle className="text-chart-4" />
//                   <p className="text-chart-4 f10">{`Selected Question will be added in ${selectedQuestionType} Section`}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </Drawer>
//       <FloatButton
//         onClick={() => {
//           setOpen(true);
//         }}
//         icon={<FaPlusCircle />}
//       />
//     </div>
//   );
// }

// export default ViewSingleMockTest;

import React, { useState, useMemo, useEffect } from "react";
import { Card, Tabs, Button, Space, Spin, Alert, Empty } from "antd";
import {
  ClockCircleOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import useHttp from "@/hooks/use-http";
import QuestionRenderer from "@/components/questions/QuestionRenderer";
import { SuccessResponse } from "@/utils/model/model";

interface Question {
  id: string;
  type: string;
  index: number;
  data: any;
  extra: any;
}

interface MockTestSection {
  id: string;
  title: string;
  type: string;
  length: number;
  duration: number;
  questions: Question[];
}

interface MockTest {
  id: string;
  title: string;
  published: boolean;
  index: number;
  created_at: string;
  mock_test_sections: MockTestSection[];
}

const ViewSingleMockTest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sendRequest } = useHttp({ type: "auth" });

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const mockTestData = useMutation({
    mutationFn: (testId: string) =>
      sendRequest({
        url: "mockTestById",
        method: "GET",
        endURL: testId,
      }) as Promise<SuccessResponse<any>>,
  });

  useEffect(() => {
    if (id) {
      mockTestData.mutate(id);
    }
  }, [id]);

  const mockTest: MockTest | null = mockTestData.data?.response?.data || null;

  const allQuestions = useMemo(() => {
    if (!mockTest?.mock_test_sections) return [];
    return mockTest.mock_test_sections.flatMap((section) => section.questions);
  }, [mockTest]);

  if (mockTestData.isPending) {
    return (
      <div style={{ textAlign: "center", padding: "100px" }}>
        <Spin size="large" tip="Loading mock test..." />
      </div>
    );
  }

  if (mockTestData.isError || !mockTest) {
    return (
      <Alert
        message="Error Loading Mock Test"
        description="Failed to load the mock test. Please try again."
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  const currentSection = mockTest.mock_test_sections[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];
  const questionNumber =
    allQuestions.findIndex((q) => q.id === currentQuestion?.id) + 1;
  const totalQuestions = allQuestions.length;

  const isFirstQuestion =
    currentSectionIndex === 0 && currentQuestionIndex === 0;
  const isLastQuestion =
    currentSectionIndex === mockTest.mock_test_sections.length - 1 &&
    currentQuestionIndex === currentSection?.questions?.length - 1;

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentSection?.questions?.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSectionIndex < mockTest.mock_test_sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      const prevSection = mockTest.mock_test_sections[currentSectionIndex - 1];
      setCurrentQuestionIndex(prevSection.questions.length - 1);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Card className="mb-1 border-l-4 border-l-blue-500">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {mockTest.title}
            </h1>
            <p className="text-gray-600 mt-2">
              <FileTextOutlined className="mr-2" />
              {totalQuestions} Questions • {mockTest.mock_test_sections.length}{" "}
              Sections
            </p>
          </div>
          {/* Navigation Controls */}
          <Button type="default" onClick={() => navigate(-1)}>
            ← Back
          </Button>
        </div>
      </Card>

      {/* Section Tabs */}
      <Card className="mb-2">
        <Tabs
          activeKey={currentSectionIndex.toString()}
          onChange={(key) => {
            setCurrentSectionIndex(parseInt(key));
            setCurrentQuestionIndex(0);
          }}
          items={mockTest.mock_test_sections.map((section, idx) => ({
            key: idx.toString(),
            label: (
              <span>
                <span className="font-semibold">{section.title}</span>
                <span className="ml-2 text-gray-600">
                  ({section.questions.length}Q • {section.duration}min)
                </span>
              </span>
            ),
          }))}
        />
      </Card>

      {/* Question Container */}
      <Card className="mb-2 shadow-lg">
        {/* Question Header */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              Question {questionNumber} of {totalQuestions}
            </h2>
            {/* <Card> */}
            <div className="flex gap-20 items-center">
              <Button
                size="large"
                icon={<ArrowLeftOutlined />}
                onClick={handlePreviousQuestion}
                disabled={isFirstQuestion}
              >
                Previous
              </Button>

              <span className="text-gray-600 font-semibold">
                {questionNumber} / {totalQuestions}
              </span>

              <Button
                size="large"
                icon={<ArrowRightOutlined />}
                onClick={handleNextQuestion}
                disabled={isLastQuestion}
              >
                Next
              </Button>
            </div>
            {/* </Card> */}
            <span className="text-gray-600">
              <ClockCircleOutlined className="mr-2" />
              Section: {currentSection.title}
            </span>
          </div>
        </div>

        {/* Question Content */}
        {currentQuestion ? (
          <QuestionRenderer
            question={currentQuestion}
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
            onResponse={() => {}}
            isOnlyViewQuestions={true} // Admin view only, no responses needed
          />
        ) : (
          <Empty description="No questions available" />
        )}
      </Card>
    </div>
  );
};

export default ViewSingleMockTest;
