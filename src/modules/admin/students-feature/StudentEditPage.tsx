import React, { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  List,
  Row,
  Skeleton,
  Switch,
  Tabs,
  Tag,
  Typography,
  message,
} from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { GrUpdate } from "react-icons/gr";
import { MdOutlineDoneOutline } from "react-icons/md";
import { RxReset } from "react-icons/rx";
import dayjs from "dayjs";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  IdcardOutlined,
  TrophyOutlined,
  UserOutlined,
  FundOutlined,
} from "@ant-design/icons";
import useHttp from "@/hooks/use-http";

const { Title, Text } = Typography;

const formatDate = (date?: string | Date | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
};

const formatDateTime = (date?: string | Date | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleString();
};

const ScoreCard = ({
  label,
  value,
  color = "#1677ff",
}: {
  label: string;
  value?: number;
  color?: string;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
    <Text className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
      {label}
    </Text>
    <Title level={3} style={{ margin: "8px 0 0", color }}>
      {value ?? "-"}
    </Title>
  </div>
);

const InfoTile = ({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
    <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
      {icon}
      {label}
    </div>
    <div className="text-sm font-medium text-slate-800">{value || "-"}</div>
  </div>
);

const StudentEditPage = () => {
  const { student_id } = useParams();
  const navigate = useNavigate();
  const { sendRequest } = useHttp({ type: "auth" });
  const [isResetPasswordMode, setIsResetPasswordMode] = useState(false);
  const [newPasswordVal, setNewPasswordVal] = useState("");
  const [form] = Form.useForm();

  const [activeTab, setActiveTab] = useState("details");
  const [insightsLoaded, setInsightsLoaded] = useState(false);

  const fromDate = dayjs().subtract(15, "day").format("YYYY-MM-DD");
  const toDate = dayjs().format("YYYY-MM-DD");

  // ---------------------------
  // Student details
  // ---------------------------
  const getStudentCall = useMutation({
    mutationFn: () =>
      sendRequest({
        url: "getStudentById",
        method: "GET",
        endURL: student_id,
      }),
    onSuccess: (data: any) => {
      const payload = data?.response?.data || data?.data || data;

      if (payload) {
        form.setFieldsValue({
          name: payload.name,
          address: payload.address,
          phone1: payload.phone1,
          phone2: payload.phone2,
          lab: payload.lab,
          online: payload.online,
          exam_mode: payload.exam_mode,
          sub_start: payload.sub_start ? dayjs(payload.sub_start) : null,
          sub_end: payload.sub_end ? dayjs(payload.sub_end) : null,
        });
      }
    },
    onError: (err: any) => {
      console.error(err);
      message.error(err?.message || "Failed to load student");
    },
  });

  // ---------------------------
  // Update student
  // ---------------------------
  const updateStudentCall = useMutation({
    mutationFn: (payload: any) =>
      sendRequest({
        url: "updateStudent",
        method: "PUT",
        payload,
      }),
    onSuccess: () => {
      message.success("Student updated successfully");
      getStudentCall.mutate();
    },
    onError: (err: any) => {
      console.error(err);
      message.error(err?.message || "Failed to update student");
    },
  });

  const resetPasswordForStudent = useMutation({
    mutationFn: (payload: any) =>
      sendRequest({
        url: "resetStudentPassword",
        method: "POST",
        payload,
      }),
    onSuccess: () => {
      message.success("Student password reset successfully");
      setIsResetPasswordMode(false);
    },
    onError: (err: any) => {
      console.error(err);
      message.error(err?.message || "Failed to update student");
    },
  });

  // ---------------------------
  // Attendance history
  // ---------------------------
  const attendanceHistoryCall = useMutation({
    mutationFn: () =>
      sendRequest({
        url: "studentAttendanceHistory",
        method: "GET",
        endURL: `${student_id}?from=${fromDate}&to=${toDate}`,
      }),
  });

  // ---------------------------
  // Performance
  // ---------------------------
  const performanceCall = useMutation({
    mutationFn: () =>
      sendRequest({
        url: "studentPerformance",
        method: "GET",
        endURL: `${student_id}/performance`,
      }),
  });

  useEffect(() => {
    if (!student_id) return;
    getStudentCall.mutate();
  }, [student_id]);

  const loadInsights = () => {
    if (!student_id || insightsLoaded) return;
    attendanceHistoryCall.mutate();
    performanceCall.mutate();
    setInsightsLoaded(true);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === "insights") {
      loadInsights();
    }
  };

  const studentData =
    getStudentCall.data?.response?.data ||
    getStudentCall.data?.data ||
    getStudentCall.data;

  const attendanceData =
    attendanceHistoryCall.data?.response?.data ||
    attendanceHistoryCall.data?.data ||
    attendanceHistoryCall.data;

  const performanceData =
    performanceCall.data?.response?.data ||
    performanceCall.data?.data ||
    performanceCall.data;

  const handleUpdate = (values: any) => {
    updateStudentCall.mutate({
      user_id: studentData?.user_id,
      name: values.name,
      address: values.address,
      phone1: values.phone1,
      phone2: values.phone2,
      lab: values.lab,
      online: values.online,
      exam_mode: values.exam_mode,
      sub_start: values.sub_start ? values.sub_start.toISOString() : null,
      sub_end: values.sub_end ? values.sub_end.toISOString() : null,
    });
  };

  if (getStudentCall.isPending) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto w-full max-w-[1500px]">
          <Skeleton active paragraph={{ rows: 14 }} />
        </div>
      </div>
    );
  }

  if (!student_id) {
    return (
      <div className="p-6">
        <Alert type="warning" showIcon message="Invalid student id" />
      </div>
    );
  }

  const handleResetPassword = () => {
    resetPasswordForStudent.mutate({
      student_id: studentData?.user_id,
      new_password: newPasswordVal,
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff,_#f8fafc_35%,_#f8fafc_100%)] p-4 md:p-6">
      <div className="mx-auto w-full max-w-[1550px]">
        {/* Hero header */}
        <Card
          className="mb-6 overflow-hidden rounded-[30px] border-none shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
          styles={{ body: { padding: 0 } }}
        >
          <div className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 px-6 py-8 text-white md:px-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
              <div className="flex items-start gap-5">
                <Avatar
                  size={84}
                  src={studentData?.image || undefined}
                  icon={<UserOutlined />}
                  className="border-4 border-white/40 shadow-lg"
                />
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
                    <EditOutlined />
                    Student Profile Editor
                  </div>

                  <Title level={2} style={{ color: "#fff", margin: 0 }}>
                    {studentData?.name || "Student"}
                  </Title>

                  <Text style={{ color: "rgba(255,255,255,0.88)" }}>
                    @{studentData?.users?.username || "-"}
                  </Text>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Tag color="blue">
                      {studentData?.users?.role || "student"}
                    </Tag>
                    {studentData?.lab && <Tag color="purple">Lab Student</Tag>}
                    {studentData?.online && <Tag color="cyan">Online</Tag>}
                    {studentData?.exam_mode && (
                      <Tag color="gold">Exam Mode</Tag>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-md">
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/70">
                    Student ID
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {studentData?.id}
                  </div>
                </div>

                <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-md">
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/70">
                    Joined
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {formatDate(studentData?.created_at)}
                  </div>
                </div>

                <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-md">
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/70">
                    Subscription Start
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {formatDate(studentData?.sub_start)}
                  </div>
                </div>

                <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-md">
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/70">
                    Subscription End
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {formatDate(studentData?.sub_end)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                className="!rounded-xl !border-white/20 !bg-white/10 !text-white hover:!border-white/30 hover:!bg-white/15"
              >
                Back
              </Button>
              {!isResetPasswordMode && (
                <Button
                  onClick={() => setIsResetPasswordMode(true)}
                  icon={<RxReset />}
                  color="volcano"
                  variant="solid"
                >
                  Reset Password
                </Button>
              )}
              {isResetPasswordMode && (
                <div className="w-xl">
                  <Input.Password
                    minLength={6}
                    onChange={(e) => setNewPasswordVal(e.target.value)}
                    value={newPasswordVal}
                    type="password"
                    suffix={
                      <Button
                        onClick={handleResetPassword}
                        type="primary"
                        icon={<MdOutlineDoneOutline />}
                      />
                    }
                    placeholder="New Password- min 6 digits"
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Tabs shell */}
        <Card
          className="rounded-[28px] border-none shadow-[0_14px_40px_rgba(15,23,42,0.06)]"
          styles={{ body: { padding: 24 } }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            className="student-edit-tabs"
            items={[
              {
                key: "details",
                label: "Student Details",
                children: (
                  <div className="mt-2">
                    <Form form={form} layout="vertical" onFinish={handleUpdate}>
                      <Row gutter={[20, 20]}>
                        <Col xs={24} xl={16}>
                          <Card className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
                            <Title level={4}>Basic Information</Title>
                            <Row gutter={16}>
                              <Col xs={24} md={12}>
                                <Form.Item name="name" label="Name">
                                  <Input size="large" className="rounded-xl" />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={12}>
                                <Form.Item label="Username">
                                  <Input
                                    size="large"
                                    className="rounded-xl"
                                    value={studentData?.users?.username}
                                    disabled
                                  />
                                </Form.Item>
                              </Col>

                              <Col xs={24}>
                                <Form.Item name="address" label="Address">
                                  <Input size="large" className="rounded-xl" />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Card>
                        </Col>

                        <Col xs={24} xl={8}>
                          <Card className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-sm">
                            <Title level={4}>Profile Snapshot</Title>

                            <div className="mt-4 grid grid-cols-1 gap-3">
                              <InfoTile
                                label="Student ID"
                                value={studentData?.id}
                                icon={<IdcardOutlined />}
                              />
                              <InfoTile
                                label="Joined"
                                value={formatDate(studentData?.created_at)}
                                icon={<CalendarOutlined />}
                              />
                              <InfoTile
                                label="Updated"
                                value={formatDate(studentData?.updated_at)}
                                icon={<ClockCircleOutlined />}
                              />
                            </div>
                          </Card>
                        </Col>

                        <Col xs={24} lg={12}>
                          <Card className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
                            <Title level={4}>Contact Information</Title>
                            <Row gutter={16}>
                              <Col xs={24}>
                                <Form.Item name="phone1" label="Phone 1">
                                  <Input
                                    size="large"
                                    className="rounded-xl"
                                    minLength={10}
                                    maxLength={10}
                                  />
                                </Form.Item>
                              </Col>
                              <Col xs={24}>
                                <Form.Item name="phone2" label="Phone 2">
                                  <Input
                                    minLength={10}
                                    maxLength={10}
                                    size="large"
                                    className="rounded-xl"
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Card>
                        </Col>

                        <Col xs={24} lg={12}>
                          <Card className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
                            <Title level={4}>Subscription</Title>
                            <Row gutter={16}>
                              <Col xs={24} md={12}>
                                <Form.Item
                                  name="sub_start"
                                  label="Subscription Start"
                                >
                                  <DatePicker
                                    size="large"
                                    className="w-full rounded-xl"
                                  />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={12}>
                                <Form.Item
                                  name="sub_end"
                                  label="Subscription End"
                                >
                                  <DatePicker
                                    size="large"
                                    className="w-full rounded-xl"
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Card>
                        </Col>

                        <Col xs={24}>
                          <Card className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
                            <Title level={4}>Student Status</Title>
                            <Row gutter={[20, 20]}>
                              <Col xs={24} md={8}>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                  <div className="mb-3 text-sm font-semibold text-slate-700">
                                    Lab
                                  </div>
                                  <Form.Item
                                    name="lab"
                                    valuePropName="checked"
                                    className="!mb-0"
                                  >
                                    <Switch />
                                  </Form.Item>
                                </div>
                              </Col>

                              <Col xs={24} md={8}>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                  <div className="mb-3 text-sm font-semibold text-slate-700">
                                    Online
                                  </div>
                                  <Form.Item
                                    name="online"
                                    valuePropName="checked"
                                    className="!mb-0"
                                  >
                                    <Switch />
                                  </Form.Item>
                                </div>
                              </Col>

                              <Col xs={24} md={8}>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                  <div className="mb-3 text-sm font-semibold text-slate-700">
                                    Exam Mode
                                  </div>
                                  <Form.Item
                                    name="exam_mode"
                                    valuePropName="checked"
                                    className="!mb-0"
                                  >
                                    <Switch />
                                  </Form.Item>
                                </div>
                              </Col>
                            </Row>
                          </Card>
                        </Col>
                      </Row>

                      <div className="mt-6 flex justify-end">
                        <Button
                          type="primary"
                          size="large"
                          htmlType="submit"
                          loading={updateStudentCall.isPending}
                          className="rounded-xl"
                          icon={<GrUpdate />}
                        >
                          Update Student
                        </Button>
                      </div>
                    </Form>
                  </div>
                ),
              },
              {
                key: "insights",
                label: "Insights",
                children: !insightsLoaded ? (
                  <div className="py-10">
                    <Alert
                      type="info"
                      showIcon
                      message="Insights will load when this tab is opened"
                    />
                  </div>
                ) : (
                  <div className="mt-2">
                    <Row gutter={[20, 20]}>
                      {/* Attendance */}
                      <Col xs={24} lg={9}>
                        <Card className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
                          <Title level={4}>Attendance History</Title>
                          <Text type="secondary">
                            Last 15 days attendance status
                          </Text>

                          <Divider />

                          {attendanceHistoryCall.isPending ? (
                            <Skeleton active paragraph={{ rows: 7 }} />
                          ) : (
                            <List
                              dataSource={attendanceData?.attendances || []}
                              locale={{
                                emptyText: "No attendance history found",
                              }}
                              renderItem={(item: any) => (
                                <List.Item className="!px-0">
                                  <div className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                                    <div>
                                      <Text strong>
                                        {formatDate(item.date)}
                                      </Text>
                                      <div className="text-xs text-slate-500">
                                        In: {formatDateTime(item.in_ts)} | Out:{" "}
                                        {formatDateTime(item.out_ts)}
                                      </div>
                                    </div>
                                    <Tag
                                      color={
                                        item.status === "COMPLETED"
                                          ? "green"
                                          : item.status === "PRESENT"
                                            ? "orange"
                                            : "red"
                                      }
                                    >
                                      {item.status}
                                    </Tag>
                                  </div>
                                </List.Item>
                              )}
                            />
                          )}
                        </Card>
                      </Col>

                      {/* Performance */}
                      <Col xs={24} lg={15}>
                        <div className="space-y-5">
                          <Card className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <TrophyOutlined />
                              </div>
                              <div>
                                <Title level={4} className="!mb-0">
                                  Latest Performance
                                </Title>
                                <Text type="secondary">
                                  Most recent mock test and daily task
                                </Text>
                              </div>
                            </div>

                            {performanceCall.isPending ? (
                              <Skeleton active paragraph={{ rows: 6 }} />
                            ) : (
                              <Row gutter={[16, 16]}>
                                <Col xs={24} xl={12}>
                                  <Card className="rounded-[20px] bg-gradient-to-br from-blue-50 to-sky-50">
                                    <Title level={5}>Latest Mock Test</Title>
                                    <Text>
                                      {performanceData?.latest_mock_test
                                        ?.title || "No mock test yet"}
                                    </Text>
                                    <Divider />
                                    <Row gutter={[12, 12]}>
                                      <Col span={12}>
                                        <ScoreCard
                                          label="Overall"
                                          value={
                                            performanceData?.latest_mock_test
                                              ?.score?.overall
                                          }
                                          color="#1677ff"
                                        />
                                      </Col>
                                      <Col span={12}>
                                        <ScoreCard
                                          label="Speaking"
                                          value={
                                            performanceData?.latest_mock_test
                                              ?.score?.speaking
                                          }
                                          color="#13c2c2"
                                        />
                                      </Col>
                                      <Col span={12}>
                                        <ScoreCard
                                          label="Writing"
                                          value={
                                            performanceData?.latest_mock_test
                                              ?.score?.writing
                                          }
                                          color="#52c41a"
                                        />
                                      </Col>
                                      <Col span={12}>
                                        <ScoreCard
                                          label="Reading"
                                          value={
                                            performanceData?.latest_mock_test
                                              ?.score?.reading
                                          }
                                          color="#722ed1"
                                        />
                                      </Col>
                                    </Row>
                                  </Card>
                                </Col>

                                <Col xs={24} xl={12}>
                                  <Card className="rounded-[20px] bg-gradient-to-br from-purple-50 to-pink-50">
                                    <Title level={5}>Latest Daily Task</Title>
                                    <Text>
                                      {performanceData?.latest_daily_task
                                        ?.title || "No daily task yet"}
                                    </Text>
                                    <Divider />
                                    <Row gutter={[12, 12]}>
                                      <Col span={12}>
                                        <ScoreCard
                                          label="Overall"
                                          value={
                                            performanceData?.latest_daily_task
                                              ?.score?.overall
                                          }
                                          color="#1677ff"
                                        />
                                      </Col>
                                      <Col span={12}>
                                        <ScoreCard
                                          label="Speaking"
                                          value={
                                            performanceData?.latest_daily_task
                                              ?.score?.speaking
                                          }
                                          color="#13c2c2"
                                        />
                                      </Col>
                                      <Col span={12}>
                                        <ScoreCard
                                          label="Writing"
                                          value={
                                            performanceData?.latest_daily_task
                                              ?.score?.writing
                                          }
                                          color="#52c41a"
                                        />
                                      </Col>
                                      <Col span={12}>
                                        <ScoreCard
                                          label="Reading"
                                          value={
                                            performanceData?.latest_daily_task
                                              ?.score?.reading
                                          }
                                          color="#722ed1"
                                        />
                                      </Col>
                                    </Row>
                                  </Card>
                                </Col>
                              </Row>
                            )}
                          </Card>

                          <Card className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <FundOutlined />
                              </div>
                              <div>
                                <Title level={4} className="!mb-0">
                                  Average Performance
                                </Title>
                                <Text type="secondary">
                                  Overall recent average across activity
                                </Text>
                              </div>
                            </div>

                            {performanceCall.isPending ? (
                              <Skeleton active paragraph={{ rows: 6 }} />
                            ) : (
                              <Row gutter={[16, 16]}>
                                <Col xs={24} xl={12}>
                                  <Card className="rounded-[20px] border border-slate-200 bg-slate-50">
                                    <Title level={5}>Mock Test Average</Title>
                                    <Row gutter={[12, 12]}>
                                      <Col span={12}>
                                        <ScoreCard
                                          label="Overall"
                                          value={
                                            performanceData?.mock_test_average
                                              ?.overall
                                          }
                                          color="#1677ff"
                                        />
                                      </Col>
                                      <Col span={12}>
                                        <ScoreCard
                                          label="Speaking"
                                          value={
                                            performanceData?.mock_test_average
                                              ?.speaking
                                          }
                                          color="#13c2c2"
                                        />
                                      </Col>
                                      <Col span={12}>
                                        <ScoreCard
                                          label="Writing"
                                          value={
                                            performanceData?.mock_test_average
                                              ?.writing
                                          }
                                          color="#52c41a"
                                        />
                                      </Col>
                                      <Col span={12}>
                                        <ScoreCard
                                          label="Reading"
                                          value={
                                            performanceData?.mock_test_average
                                              ?.reading
                                          }
                                          color="#722ed1"
                                        />
                                      </Col>
                                    </Row>
                                  </Card>
                                </Col>

                                <Col xs={24} xl={12}>
                                  <Card className="rounded-[20px] border border-slate-200 bg-slate-50">
                                    <Title level={5}>Daily Task Average</Title>
                                    <Row gutter={[12, 12]}>
                                      <Col span={12}>
                                        <ScoreCard
                                          label="Overall"
                                          value={
                                            performanceData?.daily_task_average
                                              ?.overall
                                          }
                                          color="#1677ff"
                                        />
                                      </Col>
                                      <Col span={12}>
                                        <ScoreCard
                                          label="Speaking"
                                          value={
                                            performanceData?.daily_task_average
                                              ?.speaking
                                          }
                                          color="#13c2c2"
                                        />
                                      </Col>
                                      <Col span={12}>
                                        <ScoreCard
                                          label="Writing"
                                          value={
                                            performanceData?.daily_task_average
                                              ?.writing
                                          }
                                          color="#52c41a"
                                        />
                                      </Col>
                                      <Col span={12}>
                                        <ScoreCard
                                          label="Reading"
                                          value={
                                            performanceData?.daily_task_average
                                              ?.reading
                                          }
                                          color="#722ed1"
                                        />
                                      </Col>
                                    </Row>
                                  </Card>
                                </Col>
                              </Row>
                            )}
                          </Card>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

export default StudentEditPage;
