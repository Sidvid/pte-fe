import React from "react";
import { Result, Button, Space, Card, Typography } from "antd";
import {
  RiDashboardLine,
  RiBarChartLine,
  RiHomeLine,
  RiFileListLine,
} from "react-icons/ri";

const { Text, Title } = Typography;

interface Props {
  type: "mock-test" | "daily-task";
  name: string;
  onGoHome: () => void;
  onViewResults?: () => void;
}

const TestSubmissionResult: React.FC<Props> = ({
  type,
  name,
  onGoHome,
  onViewResults,
}) => {
  const isMockTest = type === "mock-test";

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-6">
      <Card className="w-full max-w-2xl shadow-lg border-0">
        <Result
          status="success"
          title={isMockTest ? "Mock Test Submitted!" : "Daily Task Completed!"}
          subTitle={
            <div className="mt-2">
              <Text type="secondary">
                You have successfully submitted <strong>{name}</strong>.
              </Text>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg text-left">
                <Text>
                  {isMockTest
                    ? "Your responses have been recorded. You can view your detailed performance report by clicking the button below."
                    : "Great job on completing your daily practice! Keep up the consistency."}
                </Text>
              </div>
            </div>
          }
          extra={[
            <Space
              key="actions"
              direction="vertical"
              size="middle"
              className="w-full"
            >
              <Button
                type="primary"
                size="large"
                icon={<RiDashboardLine />}
                onClick={onGoHome}
                block
              >
                Return to Dashboard
              </Button>

              {onViewResults && isMockTest && (
                <Button
                  size="large"
                  icon={<RiBarChartLine />}
                  onClick={onViewResults}
                  block
                >
                  View Detailed Report
                </Button>
              )}
            </Space>,
          ]}
        />
      </Card>
    </div>
  );
};

export default TestSubmissionResult;
