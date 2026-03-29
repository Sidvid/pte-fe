import React from "react";
import { Card, Progress, Tag, Typography } from "antd";
import SectionTimer from "./SectionTimer";

const { Title, Text } = Typography;

type MockTestShellProps = {
  testTitle: string;
  sectionTitle: string;
  sectionType?: string;
  currentQuestionNumber: number;
  totalQuestions: number;
  durationMinutes: number;
  isPaused?: boolean;
  timerResetKey?: string | number;
  onTimeUp?: () => void;
  children: React.ReactNode;
};

const MockTestShell = ({
  testTitle,
  sectionTitle,
  sectionType,
  currentQuestionNumber,
  totalQuestions,
  durationMinutes,
  isPaused = false,
  timerResetKey,
  onTimeUp,
  children,
}: MockTestShellProps) => {
  const percent = Math.round((currentQuestionNumber / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff,_#f8fafc_40%,_#f8fafc_100%)] p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        <Card
          className="mb-5 rounded-[24px] border-none shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
          styles={{ body: { padding: 24 } }}
        >
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.7fr_1fr]">
            <div>
              <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                Mock Test Mode
              </Text>
              <Title level={2} className="!mb-1 !mt-2">
                {testTitle}
              </Title>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Tag color="blue">{sectionTitle}</Tag>
                {sectionType ? <Tag color="purple">{sectionType}</Tag> : null}
              </div>
              <Text className="text-slate-500">
                Question {currentQuestionNumber} of {totalQuestions}
              </Text>

              <div className="mt-4">
                <Progress
                  percent={percent}
                  showInfo={false}
                  strokeColor="#1677ff"
                />
              </div>
            </div>

            <div>
              <SectionTimer
                durationMinutes={durationMinutes}
                isPaused={isPaused}
                resetKey={timerResetKey}
                onTimeUp={onTimeUp}
              />
            </div>
          </div>
        </Card>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default MockTestShell;
