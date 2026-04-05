import React from "react";
import {
  Alert,
  Card,
  Col,
  Empty,
  List,
  Progress,
  Row,
  Skeleton,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import { useMutation } from "@tanstack/react-query";
import {
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileDoneOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  DashboardOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import useHttp from "./use-http";
import RibbonCard from "@/components/molecules/card/RibbonCard";
// import { useHttp } from "../hooks/useHttp";

const { Title, Text } = Typography;

const formatDateTime = (date?: string | Date | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleString();
};

const OverviewStatCard = ({
  title,
  value,
  icon,
  color,
  subtitle,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}) => (
  <Card
    variant="borderless"
    className="h-full rounded-[24px] shadow-[0_10px_28px_rgba(15,23,42,0.06)]"
    styles={{ body: { padding: 20 } }}
  >
    <div className="flex items-start justify-between">
      <div>
        <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {title}
        </Text>
        <Title level={2} className="!mb-1 !mt-2">
          {value}
        </Title>
        {subtitle ? (
          <Text type="secondary" className="text-sm">
            {subtitle}
          </Text>
        ) : null}
      </div>

      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md"
        style={{ background: color }}
      >
        {icon}
      </div>
    </div>
  </Card>
);

const SkillCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
    <Text className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </Text>
    <Title level={3} style={{ margin: "6px 0 4px", color }}>
      {value}
    </Title>
    <Progress
      percent={Math.min(value, 90)}
      strokeColor={color}
      trailColor="#e5e7eb"
      showInfo={false}
    />
  </div>
);

const AdminDashboard = () => {
  const { sendRequest } = useHttp({ type: "auth" });

  const adminDashboardCall = useMutation({
    mutationFn: () =>
      sendRequest({
        url: "adminDashboard",
        method: "GET",
      }),
  });

  React.useEffect(() => {
    adminDashboardCall.mutate();
  }, []);

  const dashboardData =
    adminDashboardCall.data?.response?.data ||
    adminDashboardCall.data?.data ||
    adminDashboardCall.data;

  if (adminDashboardCall.isPending) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="w-full">
          <Skeleton active paragraph={{ rows: 12 }} />
        </div>
      </div>
    );
  }

  if (adminDashboardCall.isError) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="w-full">
          <Alert
            type="error"
            showIcon
            message="Failed to load admin dashboard"
            description="Please try again later."
          />
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="w-full">
          <Alert
            type="warning"
            showIcon
            message="No dashboard data available"
          />
        </div>
      </div>
    );
  }

  const overview = dashboardData.overview_cards || {};
  const performance = dashboardData.academic_performance || {};

  const latestMockColumns = [
    {
      title: "Student",
      dataIndex: "student_name",
      key: "student_name",
      render: (_: any, record: any) => (
        <div>
          <div className="font-medium text-slate-800">
            {record.student_name || "-"}
          </div>
          <div className="text-xs text-slate-500">
            @{record.username || "-"}
          </div>
        </div>
      ),
    },
    {
      title: "Mock Test",
      dataIndex: "test_title",
      key: "test_title",
    },
    {
      title: "Submitted At",
      dataIndex: "submitted_at",
      key: "submitted_at",
      render: (val: any) => formatDateTime(val),
    },
    {
      title: "Overall",
      key: "overall",
      render: (_: any, record: any) => record.score?.overall ?? "-",
    },
  ];

  const recentMockColumns = [
    {
      title: "Student",
      dataIndex: "student_name",
      key: "student_name",
      render: (_: any, record: any) => (
        <div>
          <div className="font-medium text-slate-800">
            {record.student_name || "-"}
          </div>
          <div className="text-xs text-slate-500">
            @{record.username || "-"}
          </div>
        </div>
      ),
    },
    {
      title: "Mock Test",
      dataIndex: "test_title",
      key: "test_title",
    },
    {
      title: "Submitted",
      dataIndex: "submitted_at",
      key: "submitted_at",
      render: (val: any) => formatDateTime(val),
    },
    {
      title: "Overall Score",
      dataIndex: "overall_score",
      key: "overall_score",
      render: (val: any) => (
        <Tag color={val >= 65 ? "green" : val >= 45 ? "orange" : "red"}>
          {val ?? "-"}
        </Tag>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff,_#f8fafc_35%,_#f8fafc_100%)] p-6">
      <div className="w-full">
        {/* Header */}
        <Card
          className="mb-6 overflow-hidden rounded-[30px] border-none shadow-[0_20px_55px_rgba(37,99,235,0.14)]"
          styles={{ body: { padding: 28 } }}
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                <DashboardOutlined />
                Admin Control Center
              </div>

              <Title level={1} className="!mb-2">
                Institute Dashboard
              </Title>

              <Text className="max-w-2xl text-base text-slate-600">
                Monitor attendance, student activity, mock test performance, and
                daily practice statistics across the institute.
              </Text>
            </div>

            <div className="rounded-[24px] bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-white shadow-lg">
              <Text className="text-xs uppercase tracking-[0.2em] text-white/75">
                Today Snapshot
              </Text>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <Text className="text-white/80">Present</Text>
                  <Title level={2} style={{ color: "#fff", margin: 0 }}>
                    {overview.students_present_today || 0}
                  </Title>
                </div>
                <div>
                  <Text className="text-white/80">Absent</Text>
                  <Title level={2} style={{ color: "#fff", margin: 0 }}>
                    {overview.students_absent_today || 0}
                  </Title>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Overview cards */}
        <Row gutter={[18, 18]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <OverviewStatCard
              title="Total Students"
              value={overview.total_students || 0}
              icon={<TeamOutlined />}
              color="#1677ff"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <OverviewStatCard
              title="Active Students"
              value={overview.active_students || 0}
              icon={<CheckCircleOutlined />}
              color="#52c41a"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <OverviewStatCard
              title="Expired Subscription"
              value={overview.expired_subscriptions || 0}
              icon={<CloseCircleOutlined />}
              color="#ff4d4f"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <OverviewStatCard
              title="Ongoing Mock Tests"
              value={overview.ongoing_mock_tests || 0}
              icon={<ClockCircleOutlined />}
              color="#722ed1"
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <OverviewStatCard
              title="Present Today"
              value={overview.students_present_today || 0}
              icon={<CheckCircleOutlined />}
              color="#13c2c2"
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <OverviewStatCard
              title="Absent Today"
              value={overview.students_absent_today || 0}
              icon={<CloseCircleOutlined />}
              color="#fa541c"
            />
          </Col>
          <Col xs={24} sm={24} lg={8}>
            <OverviewStatCard
              title="Daily Tasks Completed"
              value={overview.daily_tasks_completed_today || 0}
              icon={<FileDoneOutlined />}
              color="#2f54eb"
            />
          </Col>
        </Row>

        <Row gutter={[20, 20]}>
          {/* Theory/lab activity */}
          <Col xs={24} lg={12}>
            <RibbonCard title="Theory/Lab Activity Summary">
              <div className="space-y-4 ">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <Text type="secondary">Total Students</Text>
                  <Title level={3} style={{ margin: "6px 0 0" }}>
                    {overview.pending_theory_videos_lab_activity_summary
                      ?.total_students || 0}
                  </Title>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-blue-50 p-4 text-center">
                    <Text className="block text-xs uppercase tracking-wide text-blue-600">
                      Started Theory
                    </Text>
                    <Title
                      level={3}
                      style={{ margin: "6px 0 0", color: "#1677ff" }}
                    >
                      {overview.pending_theory_videos_lab_activity_summary
                        ?.students_started_theory || 0}
                    </Title>
                  </div>

                  <div className="rounded-2xl bg-orange-50 p-4 text-center">
                    <Text className="block text-xs uppercase tracking-wide text-orange-600">
                      Not Started
                    </Text>
                    <Title
                      level={3}
                      style={{ margin: "6px 0 0", color: "#fa8c16" }}
                    >
                      {overview.pending_theory_videos_lab_activity_summary
                        ?.students_not_started_theory || 0}
                    </Title>
                  </div>
                </div>

                <Alert
                  type="info"
                  showIcon
                  message={
                    overview.pending_theory_videos_lab_activity_summary?.note ||
                    "Theory/Lab summary available"
                  }
                />
              </div>
            </RibbonCard>
          </Col>

          {/* Average score by skill */}
          <Col xs={24} lg={12}>
            <RibbonCard title="Average Score by Skill">
              <Row gutter={[16, 16]}>
                <Col xs={12} md={6}>
                  <SkillCard
                    label="Speaking"
                    value={performance.average_score_by_skill?.speaking || 0}
                    color="#1677ff"
                  />
                </Col>
                <Col xs={12} md={6}>
                  <SkillCard
                    label="Writing"
                    value={performance.average_score_by_skill?.writing || 0}
                    color="#52c41a"
                  />
                </Col>
                <Col xs={12} md={6}>
                  <SkillCard
                    label="Reading"
                    value={performance.average_score_by_skill?.reading || 0}
                    color="#722ed1"
                  />
                </Col>
                <Col xs={12} md={6}>
                  <SkillCard
                    label="Listening"
                    value={performance.average_score_by_skill?.listening || 0}
                    color="#fa8c16"
                  />
                </Col>
              </Row>
            </RibbonCard>
            <RibbonCard
              title="Daily Task Completion Stats"
              bodyStyle={{ padding: 24 }}
            >
              <Row className="space-y-3">
                <Col xl={8} className="rounded-2xl bg-slate-50 p-4">
                  <Text type="secondary">Started Today</Text>
                  <Title level={3} style={{ margin: "6px 0 0" }}>
                    {performance.daily_task_completion_stats?.started_today ||
                      0}
                  </Title>
                </Col>
                <Col xl={8} className="rounded-2xl bg-green-50 p-4">
                  <Text type="secondary">Submitted Today</Text>
                  <Title level={3} style={{ margin: "6px 0 0" }}>
                    {performance.daily_task_completion_stats?.submitted_today ||
                      0}
                  </Title>
                </Col>
                <Col xl={8} className="rounded-2xl bg-orange-50 p-4">
                  <Text type="secondary">Pending Today</Text>
                  <Title level={3} style={{ margin: "6px 0 0" }}>
                    {performance.daily_task_completion_stats?.pending_today ||
                      0}
                  </Title>
                </Col>
              </Row>
            </RibbonCard>
          </Col>

          {/* Top performers */}
          <Col xs={24} lg={12}>
            <RibbonCard title="Top Performing Students">
              {!performance.top_performing_students?.length ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No data"
                />
              ) : (
                <List
                  dataSource={performance.top_performing_students}
                  renderItem={(item: any, idx: number) => (
                    <List.Item className="!px-0">
                      <div className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                        <div>
                          <div className="font-semibold text-slate-800">
                            {item.student_name || "-"}
                          </div>
                          <div className="text-xs text-slate-500">
                            @{item.username || "-"}
                          </div>
                        </div>
                        <div className="text-right">
                          <Tag color="green">{item.average_score}</Tag>
                          <div className="text-xs text-slate-500">
                            {item.mock_tests_count} mocks
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              )}
            </RibbonCard>
          </Col>

          {/* Weak performers */}
          <Col xs={24} lg={12}>
            <RibbonCard title="Weak Performing Students">
              {!performance.weak_performing_students?.length ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No data"
                />
              ) : (
                <List
                  dataSource={performance.weak_performing_students}
                  renderItem={(item: any) => (
                    <List.Item className="!px-0">
                      <div className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                        <div>
                          <div className="font-semibold text-slate-800">
                            {item.student_name || "-"}
                          </div>
                          <div className="text-xs text-slate-500">
                            @{item.username || "-"}
                          </div>
                        </div>
                        <div className="text-right">
                          <Tag color="red">{item.average_score}</Tag>
                          <div className="text-xs text-slate-500">
                            {item.mock_tests_count} mocks
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              )}
            </RibbonCard>
          </Col>

          {/* Latest mock test summary */}
          <Col xs={24} lg={24}>
            <RibbonCard
              title="Latest Mock Test Summary Across Institute"
              bodyStyle={{ padding: 24 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <TrophyOutlined />
                </div>
                <Title level={5} style={{ margin: 0 }}>
                  Latest Mock Test Summary Across Institute
                </Title>
              </div>

              <Table
                rowKey="mts_id"
                dataSource={
                  performance.latest_mock_test_summary_across_institute || []
                }
                columns={latestMockColumns}
                pagination={{ pageSize: 5 }}
              />
            </RibbonCard>
          </Col>

          {/* Recently completed mock tests */}
          <Col xl={24}>
            <RibbonCard
              title="Recently Completed Mock Tests"
              bodyStyle={{ padding: 24 }}
            >
              <Table
                rowKey="mts_id"
                dataSource={performance.recently_completed_mock_tests || []}
                columns={recentMockColumns}
                pagination={{ pageSize: 5 }}
              />
            </RibbonCard>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboard;
