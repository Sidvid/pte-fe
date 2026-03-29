import { Button, Space, Typography } from "antd";
import { ArrowRightOutlined, CheckOutlined } from "@ant-design/icons";

const { Text } = Typography;

type MockBottomBarProps = {
  isLastQuestion?: boolean;
  isSaving?: boolean;
  disabled?: boolean;
  onNext?: () => void;
  onSubmitSection?: () => void;
};

const MockBottomBar = ({
  isLastQuestion = false,
  isSaving = false,
  disabled = false,
  onNext,
  onSubmitSection,
}: MockBottomBarProps) => {
  return (
    <div className="sticky bottom-0 z-20 mt-6 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-lg backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Text className="text-sm text-slate-500">
          Save your response and continue to the next question.
        </Text>

        <Space>
          {!isLastQuestion ? (
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              loading={isSaving}
              disabled={disabled}
              onClick={onNext}
              className="rounded-xl"
            >
              Next
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              icon={<CheckOutlined />}
              loading={isSaving}
              disabled={disabled}
              onClick={onSubmitSection}
              className="rounded-xl"
            >
              Submit Section
            </Button>
          )}
        </Space>
      </div>
    </div>
  );
};

export default MockBottomBar;
