import React from "react";
import {
  Alert,
  Button,
  Avatar,
  Card,
  Col,
  Empty,
  Progress,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Typography,
  List,
  Divider,
} from "antd";
import { useMutation } from "@tanstack/react-query";
import {
  UserOutlined,
  CalendarOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  PlayCircleOutlined,
  BookOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import useHttp from "@/hooks/use-http";
import {
  formatDate,
  formatDateTime,
  formatTime,
} from "@/utils/helpers/core-helpers";
// import { useHttp } from "../hooks/useHttp";

const { Title, Text } = Typography;

const getAttendanceColor = (status?: string) => {
  switch (status) {
    case "COMPLETED":
      return "green";
    case "IN_ONLY":
      return "orange";
    case "ABSENT":
      return "red";
    default:
      return "default";
  }
};

const getSubscriptionColor = (daysLeft: number, isActive: boolean) => {
  if (!isActive) return "#ff4d4f";
  if (daysLeft <= 7) return "#fa8c16";
  if (daysLeft <= 30) return "#faad14";
  return "#52c41a";
};

const ScoreMiniCard = ({ label, value }: { label: string; value?: number }) => (
  <div
    style={{
      padding: 12,
      borderRadius: 12,
      background: "#fafafa",
      border: "1px solid #f0f0f0",
      minWidth: 110,
      textAlign: "center",
    }}
  >
    <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
      {label}
    </Text>
    <Title level={4} style={{ margin: 0 }}>
      {value ?? "-"}
    </Title>
  </div>
);

const ProfileSummaryCard = ({ profile }: any) => (
  <Card
    variant="outlined"
    style={{ borderRadius: 20, height: "100%" }}
    styles={{ body: { padding: 20 } }}
  >
    <Space align="start" size={16}>
      <div style={{ marginTop: 8 }}>
        <Space size="middle">
          <Tag color="blue">{profile?.role}</Tag>
          {profile?.lab && <Tag color="purple">Lab Student</Tag>}
          {profile?.online && <Tag color="cyan">Online</Tag>}
          {profile?.exam_mode && <Tag color="gold">Exam Mode</Tag>}
        </Space>
      </div>
    </Space>

    <Divider />

    <Space orientation="vertical" size={8} style={{ width: "100%" }}>
      <Text>
        <IdcardOutlined /> <b>Student ID:</b> {profile?.student_id}
      </Text>
      <Text>
        <BookOutlined /> <b>Address:</b> {profile?.address || "-"}
      </Text>
      <Text>
        <b>Joined:</b> {formatDate(profile?.joined_at)}
      </Text>
    </Space>
  </Card>
);

const SubscriptionCard = ({ subscription }: any) => {
  const percentLeft = subscription?.is_active
    ? Math.min(
        100,
        Math.max(0, Math.round((subscription?.days_left / 365) * 100)),
      )
    : 0;

  const color = getSubscriptionColor(
    subscription?.days_left || 0,
    subscription?.is_active,
  );

  return (
    <Card
      variant="outlined"
      style={{ borderRadius: 20, height: "100%" }}
      styles={{ body: { padding: 20 } }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size={14}>
        <Space>
          <CalendarOutlined style={{ color }} />
          <Title level={5} style={{ margin: 0 }}>
            Subscription Status
          </Title>
        </Space>

        <Tag color={subscription?.is_active ? "green" : "red"}>
          {subscription?.is_active ? "ACTIVE" : "EXPIRED"}
        </Tag>

        <Statistic
          title="Days Left"
          value={subscription?.days_left || 0}
          valueStyle={{ color }}
        />

        <Progress percent={percentLeft} strokeColor={color} showInfo={false} />

        <Text>
          <b>Start:</b> {formatDate(subscription?.sub_start)}
        </Text>
        <Text>
          <b>End:</b> {formatDate(subscription?.sub_end)}
        </Text>
      </Space>
    </Card>
  );
};

const AttendanceTodayCard = ({ attendance }: any) => (
  <Card
    variant="outlined"
    style={{ borderRadius: 20, height: "100%" }}
    styles={{ body: { padding: 20 } }}
  >
    <Space direction="vertical" style={{ width: "100%" }} size={14}>
      <Space>
        <CheckCircleOutlined />
        <Title level={5} style={{ margin: 0 }}>
          Today's Attendance
        </Title>
      </Space>

      <Tag color={getAttendanceColor(attendance?.status)}>
        {attendance?.status || "ABSENT"}
      </Tag>

      <Row gutter={12}>
        <Col span={12}>
          <Statistic
            title="In Time"
            value={attendance?.in_ts ? formatTime(attendance?.in_ts) : "-"}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Out Time"
            value={attendance?.out_ts ? formatTime(attendance?.out_ts) : "-"}
          />
        </Col>
      </Row>

      <Text>
        <b>Date:</b> {formatDate(attendance?.date)}
      </Text>
    </Space>
  </Card>
);

const WeeklyAttendanceCard = ({ weekly }: any) => (
  <Card
    variant="outlined"
    style={{ borderRadius: 20, height: "100%" }}
    styles={{ body: { padding: 20 } }}
  >
    <Space direction="vertical" style={{ width: "100%" }} size={14}>
      <Space>
        <ClockCircleOutlined />
        <Title level={5} style={{ margin: 0 }}>
          Weekly Attendance
        </Title>
      </Space>

      <Row gutter={12}>
        <Col span={8}>
          <Statistic
            title="Marked Days"
            value={weekly?.total_days_marked || 0}
          />
        </Col>
        <Col span={8}>
          <Statistic title="In Marked" value={weekly?.total_in_marked || 0} />
        </Col>
        <Col span={8}>
          <Statistic title="Out Marked" value={weekly?.total_out_marked || 0} />
        </Col>
      </Row>

      <Divider style={{ margin: "12px 0" }} />

      <List
        size="small"
        dataSource={weekly?.records || []}
        locale={{ emptyText: "No attendance records this week" }}
        renderItem={(item: any) => (
          <List.Item>
            <Space
              style={{
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Text>{formatDate(item.date)}</Text>
              <Tag color={getAttendanceColor(item.status)}>{item.status}</Tag>
            </Space>
          </List.Item>
        )}
      />
    </Space>
  </Card>
);

const OngoingMockTestCard = ({ mockTest, onContinue }: any) => (
  <Card
    variant="outlined"
    style={{ borderRadius: 20, height: "100%" }}
    styles={{ body: { padding: 20 } }}
  >
    <Space direction="vertical" style={{ width: "100%" }} size={14}>
      <Space>
        <PlayCircleOutlined />
        <Title level={5} style={{ margin: 0 }}>
          Ongoing Mock Test
        </Title>
      </Space>

      {!mockTest ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No ongoing mock test"
        />
      ) : (
        <>
          <Title level={4} style={{ margin: 0 }}>
            {mockTest.title}
          </Title>

          <Text>
            <b>Started:</b> {formatDateTime(mockTest.started_at)}
          </Text>

          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => onContinue?.(mockTest)}
            style={{ alignSelf: "flex-start" }}
          >
            Continue Test
          </Button>

          <Divider style={{ margin: "12px 0" }} />

          <List
            size="small"
            dataSource={mockTest.sections || []}
            renderItem={(sec: any) => (
              <List.Item>
                <Space direction="vertical" style={{ width: "100%" }} size={2}>
                  <Space
                    style={{
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text strong>{sec.title}</Text>
                    <Tag
                      color={sec.status === "SUBMITTED" ? "green" : "orange"}
                    >
                      {sec.status}
                    </Tag>
                  </Space>
                  <Text type="secondary">
                    Responses: {sec.count_responses} / {sec.question_count}
                  </Text>
                </Space>
              </List.Item>
            )}
          />
        </>
      )}
    </Space>
  </Card>
);

const LastMockTestsCard = ({ tests }: any) => (
  <Card
    variant="outlined"
    style={{ borderRadius: 20 }}
    styles={{ body: { padding: 20 } }}
  >
    <Space direction="vertical" style={{ width: "100%" }} size={16}>
      <Space>
        <TrophyOutlined />
        <Title level={5} style={{ margin: 0 }}>
          Last 5 Mock Tests
        </Title>
      </Space>

      {!tests?.length ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No completed mock tests yet"
        />
      ) : (
        <List
          dataSource={tests}
          renderItem={(item: any) => (
            <List.Item>
              <Card
                style={{
                  width: "100%",
                  borderRadius: 16,
                  background: "#fafafa",
                }}
              >
                <Space direction="vertical" style={{ width: "100%" }} size={14}>
                  <Space
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <div>
                      <Title level={5} style={{ margin: 0 }}>
                        {item.test_title}
                      </Title>
                      <Text type="secondary">
                        Submitted: {formatDateTime(item.submitted_at)}
                      </Text>
                    </div>
                    <Tag color="blue">#{item.test_index ?? "-"}</Tag>
                  </Space>

                  <Row gutter={[12, 12]}>
                    <Col xs={12} sm={6}>
                      <ScoreMiniCard
                        label="Speaking"
                        value={item.score?.speaking}
                      />
                    </Col>
                    <Col xs={12} sm={6}>
                      <ScoreMiniCard
                        label="Writing"
                        value={item.score?.writing}
                      />
                    </Col>
                    <Col xs={12} sm={6}>
                      <ScoreMiniCard
                        label="Reading"
                        value={item.score?.reading}
                      />
                    </Col>
                    <Col xs={12} sm={6}>
                      <ScoreMiniCard
                        label="Listening"
                        value={item.score?.listening}
                      />
                    </Col>
                  </Row>
                </Space>
              </Card>
            </List.Item>
          )}
        />
      )}
    </Space>
  </Card>
);

const DashboardHeader = ({ profile }: any) => (
  <Card
    style={{
      borderRadius: 28,
      marginBottom: 24,
      border: "none",
      overflow: "hidden",
      background:
        "linear-gradient(135deg, #1677ff 0%, #4096ff 35%, #69b1ff 70%, #91caff 100%)",
      boxShadow: "0 18px 40px rgba(22,119,255,0.22)",
      position: "relative",
    }}
    styles={{ body: { padding: 28 } }}
  >
    {/* Decorative circles */}
    <div
      style={{
        position: "absolute",
        top: -40,
        right: -40,
        width: 180,
        height: 180,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.12)",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: -50,
        right: 120,
        width: 140,
        height: 140,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.10)",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 30,
        left: "45%",
        width: 90,
        height: 90,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.08)",
      }}
    />

    <Row
      gutter={[24, 24]}
      align="middle"
      style={{ position: "relative", zIndex: 1 }}
    >
      <Col xs={24} md={16}>
        <Space orientation="vertical" size={10}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.18)",
              color: "#fff",
              padding: "6px 14px",
              borderRadius: 999,
              width: "fit-content",
              fontSize: 14,
              fontWeight: 500,
              backdropFilter: "blur(8px)",
            }}
          >
            ✨ Welcome back
          </div>

          <Title
            level={1}
            style={{
              color: "#fff",
              margin: 0,
              fontSize: "clamp(28px, 4vw, 42px)",
              lineHeight: 1.1,
            }}
          >
            {profile?.name || "Student"}
          </Title>

          <Text
            style={{
              color: "rgba(255,255,255,0.92)",
              fontSize: 16,
              maxWidth: 620,
            }}
          >
            Stay on top of your mock tests, attendance, subscription, and
            learning progress — all in one smart dashboard.
          </Text>

          <Space wrap size={[10, 10]} style={{ marginTop: 8 }}>
            {profile?.role && (
              <Tag
                color="blue"
                style={{
                  borderRadius: 999,
                  paddingInline: 12,
                  paddingBlock: 4,
                  fontSize: 13,
                  fontWeight: 500,
                  background: "rgba(255,255,255,0.18)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                {profile.role}
              </Tag>
            )}

            {profile?.lab && (
              <Tag
                style={{
                  borderRadius: 999,
                  paddingInline: 12,
                  paddingBlock: 4,
                  fontSize: 13,
                  fontWeight: 500,
                  background: "rgba(255,255,255,0.18)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                Lab Student
              </Tag>
            )}

            {profile?.online && (
              <Tag
                style={{
                  borderRadius: 999,
                  paddingInline: 12,
                  paddingBlock: 4,
                  fontSize: 13,
                  fontWeight: 500,
                  background: "rgba(255,255,255,0.18)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                Online
              </Tag>
            )}

            {profile?.exam_mode && (
              <Tag
                style={{
                  borderRadius: 999,
                  paddingInline: 12,
                  paddingBlock: 4,
                  fontSize: 13,
                  fontWeight: 500,
                  background: "rgba(255,255,255,0.18)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                Exam Mode
              </Tag>
            )}
          </Space>
        </Space>
      </Col>

      <Col xs={24} md={8}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.11)",
              border: "1px solid rgba(255,255,255,0.55)",
              borderRadius: 24,
              padding: 18,
              minWidth: 250,
              backdropFilter: "blur(20px)",
            }}
          >
            <Space align="center" size={16}>
              <Avatar
                size={150}
                src={profile?.image || undefined}
                srcSet="https://i.pinimg.com/736x/46/99/f6/4699f6ecd0109cffb82decd8d937ab72.jpg"
                style={{
                  border: "3px solid rgba(255,255,255,0.5)",
                  background: "#ffffff22",
                }}
              />
              <div>
                <Text style={{ color: "rgba(255,255,255,0.85)" }}>
                  Student Profile
                </Text>
                <div style={{ marginTop: 8 }}>
                  <Text
                    style={{ color: "rgba(255,255,255,0.9)", fontSize: 13 }}
                  >
                    Ready to continue your PTE journey 🚀
                  </Text>
                </div>
              </div>
            </Space>
          </div>
        </div>
      </Col>
    </Row>
  </Card>
);

const StudentCompleteDashboard = () => {
  const { sendRequest } = useHttp({ type: "auth" });

  const studentDashboardCall = useMutation({
    mutationFn: () =>
      sendRequest({
        url: "studentDashboard",
        method: "GET",
      }),
  });

  React.useEffect(() => {
    studentDashboardCall.mutate();
  }, []);

  const dashboardData =
    studentDashboardCall.data?.response?.data ||
    studentDashboardCall.data?.data ||
    studentDashboardCall.data;

  if (studentDashboardCall.isPending) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active paragraph={{ rows: 12 }} />
      </div>
    );
  }

  if (studentDashboardCall.isError) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          type="error"
          showIcon
          message="Failed to load dashboard"
          description="Please try again after some time."
        />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div style={{ padding: 24 }}>
        <Alert type="warning" showIcon message="No dashboard data available" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: "#f5f7fb", minHeight: "100vh" }}>
      <DashboardHeader profile={dashboardData.profile_summary} />

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={10}>
          <ProfileSummaryCard profile={dashboardData.profile_summary} />
        </Col>

        <Col xs={24} lg={7}>
          <SubscriptionCard subscription={dashboardData.subscription} />
        </Col>

        <Col xs={24} lg={7}>
          <AttendanceTodayCard attendance={dashboardData.today_attendance} />
        </Col>

        <Col xs={24} lg={12}>
          <WeeklyAttendanceCard
            weekly={dashboardData.weekly_attendance_summary}
          />
        </Col>

        <Col xs={24} lg={12}>
          <OngoingMockTestCard
            mockTest={dashboardData.current_ongoing_mock_test}
            onContinue={(mockTest) => {
              console.log("Continue mock test:", mockTest);
              // navigate(`/student/mock-tests/continue/${mockTest.mts_id}`)
            }}
          />
        </Col>

        <Col span={24}>
          <LastMockTestsCard tests={dashboardData.last_5_mock_test_summary} />
        </Col>
      </Row>
    </div>
  );
};

export default StudentCompleteDashboard;
