import { Alert, Button, Card, Result, Spin, Typography } from "antd";
import MockTestShell from "./MockTestShell";
import QuestionRenderer from "@/components/questions/QuestionRenderer";
import MockBottomBar from "./MockBottomBar";
import { useMockTestFlow } from "@/hooks/useMockTestFlow";

const { Text } = Typography;

type MockTestExamPageProps = {
  mockTestResponse: any;
  mtsId: string;
  existingSectionAttempts?: any[];
  existingResponsesByMtssId?: Record<string, any[]>;
};

const MockTestExamPage = ({
  mockTestResponse,
  mtsId,
  existingSectionAttempts = [],
  existingResponsesByMtssId = {},
}: MockTestExamPageProps) => {
  const testData = mockTestResponse?.data;

  const {
    currentSection,
    currentQuestion,
    currentQuestionIndex,
    totalQuestionsInSection,
    currentSectionIndex,
    totalSections,
    handleResponse,
    handleNext,
    handleAutoSubmitSection,
    moveToNextSection,
    showTransition,
    resumeNotice,
    isLastQuestionInSection,
    isLastSection,
    saveLoading,
    submitSectionLoading,
    submitMockLoading,
    sectionStarted,
    startSectionLoading,
    responses,
  } = useMockTestFlow({
    testData,
    mtsId,
    existingSectionAttempts,
    existingResponsesByMtssId,
  });

  if (!testData) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          type="error"
          showIcon
          message="Invalid mock test data"
          description="Mock test could not be loaded."
        />
      </div>
    );
  }

  if (
    startSectionLoading ||
    !sectionStarted ||
    !currentSection ||
    !currentQuestion
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spin size="large" tip="Preparing exam section..." />
      </div>
    );
  }

  if (showTransition) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl">
          <Card className="rounded-[28px] shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
            <Result
              status="success"
              title="Section Submitted Successfully"
              subTitle={
                isLastSection
                  ? "All sections are completed. Final mock test submission is in progress."
                  : `You have completed Section ${currentSectionIndex + 1} of ${totalSections}.`
              }
              extra={
                !isLastSection ? (
                  <Button
                    type="primary"
                    size="large"
                    onClick={moveToNextSection}
                  >
                    Start Next Section
                  </Button>
                ) : null
              }
            />
          </Card>
        </div>
      </div>
    );
  }

  const isBusy = saveLoading || submitSectionLoading || submitMockLoading;

  return (
    <MockTestShell
      testTitle={testData.title}
      sectionTitle={currentSection.title}
      sectionType={currentSection.type}
      currentQuestionNumber={currentQuestionIndex + 1}
      totalQuestions={totalQuestionsInSection}
      durationMinutes={currentSection.duration}
      isPaused={isBusy}
      timerResetKey={currentSection.id}
      onTimeUp={handleAutoSubmitSection}
    >
      {resumeNotice && (
        <div className="mb-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
          <Text className="text-blue-700">
            Resuming <b>{resumeNotice.sectionTitle}</b> from Question{" "}
            <b>{resumeNotice.questionNumber}</b>
          </Text>
        </div>
      )}

      <QuestionRenderer
        key={currentQuestion.id}
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={totalQuestionsInSection}
        onResponse={handleResponse}
        loading={false}
        isPaused={isBusy}
      />

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Text strong>Current Draft Response</Text>
        <pre
          style={{
            background: "#f8fafc",
            padding: 12,
            borderRadius: 12,
            marginTop: 10,
            overflow: "auto",
          }}
        >
          {JSON.stringify(responses[currentQuestion.id] || null, null, 2)}
        </pre>
      </div>

      <MockBottomBar
        isLastQuestion={isLastQuestionInSection}
        isSaving={isBusy}
        disabled={!responses[currentQuestion.id]}
        onNext={handleNext}
        onSubmitSection={handleNext}
      />
    </MockTestShell>
  );
};

export default MockTestExamPage;
