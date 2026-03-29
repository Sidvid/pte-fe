import { Alert, Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import {
  ClockCircleOutlined,
  PlayCircleOutlined,
  ReadOutlined,
  SoundOutlined,
  EditOutlined,
  CustomerServiceOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const getSectionIcon = (type?: string) => {
  switch (type) {
    case "sw":
      return <SoundOutlined />;
    case "wr":
      return <EditOutlined />;
    case "rd":
      return <ReadOutlined />;
    case "ls":
      return <CustomerServiceOutlined />;
    default:
      return <ClockCircleOutlined />;
  }
};

const getSectionLabel = (type?: string) => {
  switch (type) {
    case "sw":
      return "Speaking / Writing";
    case "wr":
      return "Writing";
    case "rd":
      return "Reading";
    case "ls":
      return "Listening";
    default:
      return type || "Section";
  }
};

type MockTestIntroPageProps = {
  testData: any;
  onProceed?: () => void;
  loading?: boolean;
};

const MockTestIntroPage = ({
  testData,
  onProceed,
  loading = false,
}: MockTestIntroPageProps) => {
  const sections = testData?.mock_test_sections || [];

  const totalQuestions = sections.reduce(
    (sum: number, sec: any) => sum + (sec.length || 0),
    0,
  );

  const totalDuration = sections.reduce(
    (sum: number, sec: any) => sum + (sec.duration || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe,_#eff6ff_35%,_#f8fafc_100%)] px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <Card
          className="mb-6 overflow-hidden rounded-[32px] border-none shadow-[0_24px_60px_rgba(37,99,235,0.16)]"
          styles={{ body: { padding: 32 } }}
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                <SafetyCertificateOutlined />
                Exam Instructions
              </div>

              <Title level={1} className="!mb-2">
                {testData?.title}
              </Title>

              <Paragraph className="!mb-5 !text-base !text-slate-600">
                Please read the instructions carefully before starting your mock
                test. Once the test begins, each section will be timed
                separately and must be completed in sequence.
              </Paragraph>

              <Space wrap size={[12, 12]}>
                <Tag color="blue" className="!rounded-full !px-4 !py-1">
                  {sections.length} Sections
                </Tag>
                <Tag color="purple" className="!rounded-full !px-4 !py-1">
                  {totalQuestions} Questions
                </Tag>
                <Tag color="gold" className="!rounded-full !px-4 !py-1">
                  {totalDuration} Minutes
                </Tag>
              </Space>
            </div>

            <div className="rounded-[24px] bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-white shadow-lg">
              <div className="mb-4 text-sm uppercase tracking-[0.2em] text-white/80">
                Quick Overview
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-white/80">Sections</div>
                  <div className="text-2xl font-bold">{sections.length}</div>
                </div>
                <div>
                  <div className="text-sm text-white/80">Questions</div>
                  <div className="text-2xl font-bold">{totalQuestions}</div>
                </div>
                <div>
                  <div className="text-sm text-white/80">Duration</div>
                  <div className="text-2xl font-bold">{totalDuration} min</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Rules */}
        <Row gutter={[20, 20]} className="mb-6">
          <Col xs={24} lg={14}>
            <Card
              className="h-full rounded-[28px] shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
              styles={{ body: { padding: 24 } }}
            >
              <Title level={4}>Important Instructions</Title>
              <ul className="mt-4 space-y-3 pl-5 text-slate-600">
                <li>Each section will run on its own timer.</li>
                <li>You may submit a section before time ends.</li>
                <li>If time expires, the section will be auto-submitted.</li>
                <li>Responses are saved while moving through questions.</li>
                <li>
                  If the test is interrupted, you will continue from the next
                  pending question.
                </li>
              </ul>

              <Alert
                className="mt-5"
                type="warning"
                showIcon
                message="Make sure your internet, audio, and system are working properly before starting."
              />
            </Card>
          </Col>

          <Col xs={24} lg={10}>
            <Card
              className="h-full rounded-[28px] shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
              styles={{ body: { padding: 24 } }}
            >
              <Title level={4}>Sections</Title>

              <div className="mt-4 space-y-3">
                {sections.map((section: any, index: number) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        {getSectionIcon(section.type)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">
                          {section.title || getSectionLabel(section.type)}
                        </div>
                        <div className="text-sm text-slate-500">
                          {section.length} questions
                        </div>
                      </div>
                    </div>

                    <Tag color="blue">{section.duration} min</Tag>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Proceed */}
        <Card
          className="rounded-[28px] shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
          styles={{ body: { padding: 24 } }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Title level={4} className="!mb-1">
                Ready to begin?
              </Title>
              <Text type="secondary">
                Click proceed to start your mock test and enter exam mode.
              </Text>
            </div>

            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              loading={loading}
              onClick={onProceed}
              className="!h-12 !rounded-2xl !px-8"
            >
              Proceed
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MockTestIntroPage;
