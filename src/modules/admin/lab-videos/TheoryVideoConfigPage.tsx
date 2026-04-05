import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Drawer,
  Empty,
  Form,
  Input,
  List,
  Popconfirm,
  Row,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { useMutation } from "@tanstack/react-query";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  VideoCameraOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import useHttp from "@/hooks/use-http";
import RibbonCard from "@/components/molecules/card/RibbonCard";

const { Title, Text } = Typography;
const { Option } = Select;

const getQuestionTypeColor = (type?: string) => {
  switch (type) {
    case "rs":
      return "blue";
    case "ra":
      return "cyan";
    case "di":
      return "purple";
    case "rl":
      return "volcano";
    case "asq":
      return "geekblue";
    case "swt":
    case "sst":
      return "green";
    case "we":
      return "gold";
    case "fib_r":
    case "fib_rw":
    case "rfib":
    case "rwfib":
      return "orange";
    default:
      return "default";
  }
};

const TheoryVideoConfigPage = () => {
  const { sendRequest } = useHttp({ type: "auth" });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [form] = Form.useForm();

  const mappingsCall = useMutation({
    mutationFn: () =>
      sendRequest({
        url: "theoryVideoMappings",
        method: "GET",
      }),
  });

  const videoOptionsCall = useMutation({
    mutationFn: () =>
      sendRequest({
        url: "theoryVideoOptions",
        method: "GET",
      }),
  });

  const taskOptionsCall = useMutation({
    mutationFn: () =>
      sendRequest({
        url: "theoryTaskOptions",
        method: "GET",
      }),
  });

  const addMappingCall = useMutation({
    mutationFn: (payload: any) =>
      sendRequest({
        url: "addTheoryVideoMapping",
        method: "POST",
        payload,
      }),
    onSuccess: () => {
      message.success("Theory mapping added successfully");
      setDrawerOpen(false);
      setEditingRow(null);
      form.resetFields();
      mappingsCall.mutate();
    },
    onError: (err: any) => {
      console.error(err);
      message.error(err?.message || "Failed to add mapping");
    },
  });

  const updateMappingCall = useMutation({
    mutationFn: ({ sequence, payload }: any) =>
      sendRequest({
        url: "updateTheoryVideoMapping",
        method: "PUT",
        endURL: sequence,
        payload,
      }),
    onSuccess: () => {
      message.success("Theory mapping updated successfully");
      setDrawerOpen(false);
      setEditingRow(null);
      form.resetFields();
      mappingsCall.mutate();
    },
    onError: (err: any) => {
      console.error(err);
      message.error(err?.message || "Failed to update mapping");
    },
  });

  const deleteMappingCall = useMutation({
    mutationFn: (sequence: number) =>
      sendRequest({
        url: "deleteTheoryVideoMapping",
        method: "DELETE",
        endURL: String(sequence),
      }),
    onSuccess: () => {
      message.success("Theory mapping deleted successfully");
      mappingsCall.mutate();
    },
    onError: (err: any) => {
      console.error(err);
      message.error(err?.message || "Failed to delete mapping");
    },
  });

  useEffect(() => {
    mappingsCall.mutate();
    videoOptionsCall.mutate();
    taskOptionsCall.mutate();
  }, []);

  const mappingsData =
    mappingsCall.data?.response?.data ||
    mappingsCall.data?.data ||
    mappingsCall.data;

  const videoOptionsData =
    videoOptionsCall.data?.response?.data ||
    videoOptionsCall.data?.data ||
    videoOptionsCall.data;

  const taskOptionsData =
    taskOptionsCall.data?.response?.data ||
    taskOptionsCall.data?.data ||
    taskOptionsCall.data;

  const mappings = mappingsData?.mappings || [];
  const videoOptions = videoOptionsData?.videos || [];
  const taskOptions = taskOptionsData?.tasks || [];

  const handleOpenAddDrawer = () => {
    setEditingRow(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const handleOpenEditDrawer = (record: any) => {
    setEditingRow(record);
    form.setFieldsValue({
      video_key: record.video_key,
      title: record.title,
      task_id: record.task_id,
    });
    setDrawerOpen(true);
  };

  const handleSubmit = (values: any) => {
    const payload = {
      video_key: values.video_key,
      title: values.title,
      task_id: values.task_id,
    };

    if (editingRow) {
      updateMappingCall.mutate({
        sequence: editingRow.sequence,
        payload,
      });
    } else {
      addMappingCall.mutate(payload);
    }
  };

  const columns = [
    {
      title: "Sequence",
      dataIndex: "sequence",
      key: "sequence",
      width: 100,
    },
    {
      title: "Video",
      key: "video_name",
      render: (_: any, record: any) => (
        <div>
          <Text strong>{record.title}</Text>
          <div className="text-xs text-slate-500">{record.video_name}</div>
        </div>
      ),
    },
    {
      title: "Mapped Task",
      key: "task",
      render: (_: any, record: any) => (
        <div>
          <Text strong>{record.task?.title || "-"}</Text>
          <div className="mt-1">
            <Tag color={getQuestionTypeColor(record.task_type)}>
              {record.task_type || "-"}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Task Meta",
      key: "task_meta",
      render: (_: any, record: any) => (
        <Space direction="vertical" size={2}>
          <Text type="secondary">
            Length: <b>{record.task?.length ?? 0}</b>
          </Text>
          <Text type="secondary">
            Duration: <b>{record.task?.duration ?? 0} min</b>
          </Text>
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 180,
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => handleOpenEditDrawer(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete this mapping?"
            description="This will update the single config file in MinIO."
            onConfirm={() => deleteMappingCall.mutate(record.sequence)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff,_#f8fafc_35%,_#f8fafc_100%)] p-4 md:p-6">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Header */}
        <Card
          className="mb-6 overflow-hidden rounded-[30px] border-none shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
          styles={{ body: { padding: 0 } }}
        >
          <div className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 px-6 py-8 text-white md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                  <SettingOutlined />
                  Theory Video Config
                </div>

                <Title level={2} style={{ color: "#fff", margin: 0 }}>
                  Manage Theory Videos + Task Mapping
                </Title>

                <Text style={{ color: "rgba(255,255,255,0.9)" }}>
                  Add, edit, or remove mappings. Only one config file is
                  maintained in MinIO.
                </Text>
              </div>

              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={handleOpenAddDrawer}
                className="rounded-xl"
              >
                Add New Mapping
              </Button>
            </div>
          </div>
        </Card>
        {/* Side info */}
        <Row gutter={12}>
          {/* <Col xs={24} xl={6}> */}
          {/* <Space orientation="horizontal" size={20} style={{ width: "100%" }}> */}
          <Col xl={12}>
            <RibbonCard
              title="Available Videos"
              color="cyan"
              cardClassName="rounded-[24px] shadow-sm"
              bodyStyle={{ padding: 20 }}
            >
              {videoOptionsCall.isPending ? (
                <Skeleton active paragraph={{ rows: 5 }} />
              ) : (
                <>
                  <Title level={3} style={{ marginTop: 0 }}>
                    {videoOptions.length}
                  </Title>
                  <Text type="secondary">
                    Videos found in <b>theory-videos/</b>
                  </Text>
                </>
              )}
            </RibbonCard>
          </Col>
          <Col xl={12}>
            <RibbonCard
              title="Available Tasks"
              color="purple"
              cardClassName="rounded-[24px] shadow-sm"
              bodyStyle={{ padding: 20 }}
            >
              {taskOptionsCall.isPending ? (
                <Skeleton active paragraph={{ rows: 5 }} />
              ) : (
                <>
                  <Title level={3} style={{ marginTop: 0 }}>
                    {taskOptions.length}
                  </Title>
                  <Text type="secondary">
                    Published daily tasks available for mapping
                  </Text>
                </>
              )}
            </RibbonCard>
          </Col>
          {/* </Space> */}
          {/* </Col> */}
        </Row>
        <Row gutter={[20, 20]}>
          {/* Main table */}
          <Col xs={24} xl={24}>
            <RibbonCard
              title="Current Theory Mappings"
              color="blue"
              cardClassName="rounded-[24px] shadow-sm"
              bodyStyle={{ padding: 24 }}
            >
              {mappingsCall.isPending ? (
                <Skeleton active paragraph={{ rows: 8 }} />
              ) : !mappings.length ? (
                <Empty description="No theory video mappings configured yet" />
              ) : (
                <Table
                  rowKey="sequence"
                  columns={columns}
                  dataSource={mappings}
                  pagination={{ pageSize: 8 }}
                />
              )}
            </RibbonCard>
          </Col>

          {/* Side info
          <Col xs={24} xl={6}>
            <Space direction="vertical" size={20} style={{ width: "100%" }}>
              <RibbonCard
                title="Available Videos"
                color="cyan"
                cardClassName="rounded-[24px] shadow-sm"
                bodyStyle={{ padding: 20 }}
              >
                {videoOptionsCall.isPending ? (
                  <Skeleton active paragraph={{ rows: 5 }} />
                ) : (
                  <>
                    <Title level={3} style={{ marginTop: 0 }}>
                      {videoOptions.length}
                    </Title>
                    <Text type="secondary">
                      Videos found in <b>theory-videos/</b>
                    </Text>
                  </>
                )}
              </RibbonCard>

              <RibbonCard
                title="Available Tasks"
                color="purple"
                cardClassName="rounded-[24px] shadow-sm"
                bodyStyle={{ padding: 20 }}
              >
                {taskOptionsCall.isPending ? (
                  <Skeleton active paragraph={{ rows: 5 }} />
                ) : (
                  <>
                    <Title level={3} style={{ marginTop: 0 }}>
                      {taskOptions.length}
                    </Title>
                    <Text type="secondary">
                      Published daily tasks available for mapping
                    </Text>
                  </>
                )}
              </RibbonCard>

              <RibbonCard
                title="Config Note"
                color="gold"
                cardClassName="rounded-[24px] shadow-sm"
                bodyStyle={{ padding: 20 }}
              >
                <Text type="secondary">
                  Every change updates the single file:
                </Text>
                <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                  theory-videos/config.json
                </div>
              </RibbonCard>
            </Space>
          </Col> */}
        </Row>

        {/* Drawer */}
        <Drawer
          title={editingRow ? "Edit Theory Mapping" : "Add Theory Mapping"}
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setEditingRow(null);
            form.resetFields();
          }}
          width={520}
        >
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item
              name="video_key"
              label="Select Theory Video"
              rules={[
                { required: true, message: "Please select a theory video" },
              ]}
            >
              <Select
                size="large"
                placeholder="Choose theory video"
                className="rounded-xl"
                showSearch
                optionFilterProp="label"
              >
                {videoOptions.map((video: any) => (
                  <Option key={video.key} value={video.key} label={video.name}>
                    <div className="flex items-center justify-between">
                      <span>{video.name}</span>
                      {video.already_mapped && <Tag color="orange">Mapped</Tag>}
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="title"
              label="Display Title"
              rules={[
                { required: true, message: "Please enter display title" },
              ]}
            >
              <Input size="large" placeholder="Enter display title" />
            </Form.Item>

            <Form.Item
              name="task_id"
              label="Select Daily Task"
              rules={[{ required: true, message: "Please select a task" }]}
            >
              <Select
                size="large"
                placeholder="Choose task"
                className="rounded-xl"
                showSearch
                optionFilterProp="label"
              >
                {taskOptions.map((task: any) => (
                  <Option key={task.id} value={task.id} label={task.title}>
                    <div className="flex items-center justify-between">
                      <span>{task.title}</span>
                      <Space>
                        <Tag color={getQuestionTypeColor(task.question_type)}>
                          {task.question_type}
                        </Tag>
                        {task.already_mapped && (
                          <Tag color="orange">Mapped</Tag>
                        )}
                      </Space>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                onClick={() => {
                  setDrawerOpen(false);
                  setEditingRow(null);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                loading={
                  addMappingCall.isPending || updateMappingCall.isPending
                }
              >
                {editingRow ? "Update Mapping" : "Add Mapping"}
              </Button>
            </div>
          </Form>
        </Drawer>
      </div>
    </div>
  );
};

export default TheoryVideoConfigPage;
