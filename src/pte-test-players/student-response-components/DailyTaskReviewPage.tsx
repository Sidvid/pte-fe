import React, { useMemo, useState } from "react";
import { Alert, Card, Empty, Space, Tag, Typography } from "antd";
import QuestionReviewRenderer from "./QuestionReviewRenderer";

const { Title, Text } = Typography;

const getScoreColor = (raw = 0, max = 0) => {
  if (!max) return "default";
  const percent = (raw / max) * 100;

  if (percent >= 75) return "green";
  if (percent >= 40) return "orange";
  return "red";
};

const getQuestionTypeLabel = (type?: string) => {
  const map: Record<string, string> = {
    ra: "Read Aloud",
    rs: "Repeat Sentence",
    di: "Describe Image",
    rl: "Retell Lecture",
    asq: "Answer Short Question",
    rts: "Respond to Situation",
    sgd: "Summarize Group Discussion",
    we: "Write Essay",
    swt: "Summarize Written Text",
    sst: "Summarize Spoken Text",
    ro: "Re-order Paragraphs",
    rfib: "Reading Fill in the Blanks",
    rwfib: "Reading & Writing Fill in the Blanks",
    fib_r: "Reading Fill in the Blanks",
    fib_rw: "Reading & Writing Fill in the Blanks",
    lfib: "Listening Fill in the Blanks",
    fib_l: "Listening Fill in the Blanks",
    rmcsa: "Reading MCQ Single",
    rmcma: "Reading MCQ Multiple",
    mcs_r: "Reading MCQ Single",
    mcm_r: "Reading MCQ Multiple",
    lmcsa: "Listening MCQ Single",
    lmcma: "Listening MCQ Multiple",
    mcs_l: "Listening MCQ Single",
    mcm_l: "Listening MCQ Multiple",
    hcs: "Highlight Correct Summary",
    hiw: "Highlight Incorrect Words",
    smw: "Select Missing Word",
    wfd: "Write From Dictation",
  };

  return map[type || ""] || type || "Question";
};

const SummaryScoreCard = ({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: number | string;
  colorClass?: string;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
    <Text className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </Text>
    <div
      className={`mt-2 text-2xl font-bold ${colorClass || "text-slate-800"}`}
    >
      {value}
    </div>
  </div>
);

type DailyTaskReviewPageProps = {
  reviewData: any;
};

const DailyTaskReviewPage = ({ reviewData }: DailyTaskReviewPageProps) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const payload = reviewData?.data || reviewData || {};
  const questions = payload?.questions || [];
  const task = payload?.task || {};
  const score = payload?.score || {};

  const activeQuestion = questions[activeQuestionIndex];

  const summaryItems = useMemo(() => {
    return [
      {
        label: "Overall",
        value: score?.overall ?? "-",
        colorClass: "text-blue-600",
      },
      {
        label: "Speaking",
        value: score?.speaking ?? "-",
        colorClass: "text-cyan-600",
      },
      {
        label: "Writing",
        value: score?.writing ?? "-",
        colorClass: "text-emerald-600",
      },
      {
        label: "Reading",
        value: score?.reading ?? "-",
        colorClass: "text-violet-600",
      },
      {
        label: "Listening",
        value: score?.listening ?? "-",
        colorClass: "text-orange-600",
      },
    ];
  }, [score]);

  if (!payload || Object.keys(payload).length === 0) {
    return (
      <div className="p-6">
        <Alert
          type="warning"
          showIcon
          message="No review data found"
          description="The review could not be loaded."
        />
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="p-6">
        <Empty description="No review questions available" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff,_#f8fafc_35%,_#f8fafc_100%)] p-4 md:p-6">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Header */}
        <Card
          className="mb-6 rounded-[28px] border-none shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
          styles={{ body: { padding: 24 } }}
        >
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
            <div>
              <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                Daily Task Review
              </Text>

              <Title level={2} className="!mb-2 !mt-2">
                {task?.title || "Daily Task"}
              </Title>

              <div className="flex flex-wrap gap-2">
                <Tag color="blue">{task?.question_type || "-"}</Tag>
                <Tag color="purple">{task?.length || 0} Questions</Tag>
                <Tag color="gold">{task?.duration || 0} min</Tag>
                <Tag color="green">
                  Reviewed {payload?.total_review_questions || questions.length}
                </Tag>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {summaryItems.map((item) => (
                <SummaryScoreCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  colorClass={item.colorClass}
                />
              ))}
            </div>
          </div>
        </Card>

        {/* Main layout */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_1fr]">
          {/* Left navigator */}
          <Card
            className="rounded-[24px] border-none shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
            styles={{ body: { padding: 16 } }}
          >
            <div className="mb-4">
              <Title level={5} className="!mb-1">
                Question Navigator
              </Title>
              <Text type="secondary">
                Select a question to review your response and score
              </Text>
            </div>

            <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
              {questions.map((item: any, index: number) => {
                const raw = item?.evaluation?.raw ?? 0;
                const max = item?.evaluation?.max_raw ?? 0;
                const isActive = activeQuestionIndex === index;

                return (
                  <div
                    key={item.question_id}
                    onClick={() => setActiveQuestionIndex(index)}
                    className={`cursor-pointer rounded-2xl border px-4 py-4 transition-all duration-200 ${
                      isActive
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <Text strong>Q{index + 1}</Text>
                      <Tag color={getScoreColor(raw, max)}>
                        {raw}/{max}
                      </Tag>
                    </div>

                    <div className="mb-1 text-sm font-medium text-slate-700">
                      {getQuestionTypeLabel(item?.type)}
                    </div>

                    <Text className="text-xs text-slate-500">
                      Type: {item?.type}
                    </Text>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Right review detail */}
          <Card
            className="rounded-[24px] border-none shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
            styles={{ body: { padding: 24 } }}
          >
            {!activeQuestion ? (
              <Empty description="Select a question to review" />
            ) : (
              <div>
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Title level={4} className="!mb-1">
                      Question {activeQuestionIndex + 1}
                    </Title>
                    <Text type="secondary">
                      {getQuestionTypeLabel(activeQuestion?.type)}
                    </Text>
                  </div>

                  <Tag
                    color={getScoreColor(
                      activeQuestion?.evaluation?.raw,
                      activeQuestion?.evaluation?.max_raw,
                    )}
                    className="!w-fit"
                  >
                    Score: {activeQuestion?.evaluation?.raw ?? 0}/
                    {activeQuestion?.evaluation?.max_raw ?? 0}
                  </Tag>
                </div>

                <QuestionReviewRenderer item={activeQuestion} />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DailyTaskReviewPage;
