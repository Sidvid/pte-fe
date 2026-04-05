import React, { useState } from "react";
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Empty,
  Form,
  Input,
  List,
  Skeleton,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { VideoCameraOutlined, CalendarOutlined } from "@ant-design/icons";
import useHttp from "@/hooks/use-http";
import { FaCheckDouble, FaVideo } from "react-icons/fa";
import RibbonCard from "@/components/molecules/card/RibbonCard";

const { Title, Text } = Typography;

type LabVideo = {
  key: string;
  name: string;
  last_modified?: string;
  size?: number;
};

const formatDateTime = (date?: string | Date | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleString();
};

const formatSize = (size?: number) => {
  if (!size) return "0 B";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024)
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const AdminLabVideosPage = () => {
  const { sendRequest } = useHttp({ type: "auth" });
  const [selectedVideo, setSelectedVideo] = useState<LabVideo | null>(null);
  const [form] = Form.useForm();

  const fetchLabVideosCall = useMutation({
    mutationFn: () =>
      sendRequest({
        url: "adminLabVideos",
        method: "GET",
      }),
  });

  const scheduleLabVideoCall = useMutation({
    mutationFn: (payload: any) =>
      sendRequest({
        url: "scheduleLabVideo",
        method: "POST",
        payload,
      }),
    onSuccess: () => {
      message.success("Lab video scheduled successfully");
      form.resetFields();
      setSelectedVideo(null);
    },
    onError: (err: any) => {
      console.error(err);
      message.error(err?.message || "Failed to schedule lab video");
    },
  });

  React.useEffect(() => {
    fetchLabVideosCall.mutate();
  }, []);

  const payload =
    fetchLabVideosCall.data?.response?.data ||
    fetchLabVideosCall.data?.data ||
    fetchLabVideosCall.data;

  const videos: LabVideo[] = payload?.videos || [];

  const handleSelectVideo = (video: LabVideo) => {
    setSelectedVideo(video);
    form.setFieldsValue({
      video_key: video.key,
      title: video.name,
    });
  };

  const handleSchedule = (values: any) => {
    scheduleLabVideoCall.mutate({
      video_key: values.video_key,
      title: values.title,
      date: values.date.format("YYYY-MM-DD"),
    });
  };

  const columns = [
    {
      title: "Video Name",
      dataIndex: "name",
      key: "name",
      render: (val: string) => <Text strong>{val}</Text>,
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (val: number) => formatSize(val),
    },
    {
      title: "Last Modified",
      dataIndex: "last_modified",
      key: "last_modified",
      render: (val: string) => formatDateTime(val),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: LabVideo) => (
        <Button
          icon={<FaCheckDouble />}
          type="primary"
          onClick={() => handleSelectVideo(record)}
        >
          Select
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff,_#f8fafc_35%,_#f8fafc_100%)] p-4 md:p-6">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Header */}
        <Card
          className="mb-6 overflow-hidden rounded-[28px] border-none shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
          styles={{ body: { padding: 0 } }}
        >
          <div className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 px-6 py-8 text-white md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                  <VideoCameraOutlined />
                  Lab Videos
                </div>

                <Title level={2} style={{ color: "#fff", margin: 0 }}>
                  Manage Lab Video Scheduling
                </Title>

                <Text style={{ color: "rgba(255,255,255,0.9)" }}>
                  Select a lab video from MinIO and schedule it for students.
                </Text>
              </div>

              <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur-md">
                <div className="text-xs uppercase tracking-wide text-white/75">
                  Total Videos
                </div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {videos.length}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          {/* Available videos */}
          <RibbonCard
            className="rounded-[24px] shadow-sm"
            title="Available Lab Videos"
            // styles={{ body: { padding: 24 } }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FaVideo fontSizeAdjust={40} />
              </div>
              <div>
                {/* <Title level={4} className="!mb-0">
                  Available Lab Videos
                </Title> */}
                <Text type="secondary">Fetched from MinIO bucket</Text>
              </div>
            </div>

            {fetchLabVideosCall.isPending ? (
              <Skeleton active paragraph={{ rows: 8 }} />
            ) : !videos.length ? (
              <Empty description="No lab videos found" />
            ) : (
              <Table
                rowKey="key"
                columns={columns}
                dataSource={videos}
                pagination={{ pageSize: 8 }}
              />
            )}
          </RibbonCard>

          {/* Schedule form */}
          <RibbonCard
            title="Schedule Lab Video"
            className="rounded-[24px] shadow-sm"
            // styles={{ body: { padding: 24 } }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <CalendarOutlined />
              </div>
              <div>
                {/* <Title level={4} className="!mb-0">
                  Schedule Video
                </Title> */}
                <Text type="secondary">
                  Assign a selected lab video to a date
                </Text>
              </div>
            </div>

            {!selectedVideo ? (
              <Alert
                type="info"
                showIcon
                message="No video selected"
                description="Select a video from the list to schedule it."
              />
            ) : (
              <>
                <div className="mb-4 rounded-2xl bg-slate-50 p-4">
                  <Text strong>{selectedVideo.name}</Text>
                  <div className="mt-1 text-xs text-slate-500">
                    {selectedVideo.key}
                  </div>
                </div>

                <Form form={form} layout="vertical" onFinish={handleSchedule}>
                  <Form.Item name="video_key" hidden>
                    <Input />
                  </Form.Item>

                  <Form.Item name="title" label="Title">
                    <Input size="large" className="rounded-xl" />
                  </Form.Item>

                  <Form.Item
                    name="date"
                    label="Schedule Date"
                    rules={[
                      { required: true, message: "Please select a date" },
                    ]}
                  >
                    <DatePicker
                      size="large"
                      className="w-full rounded-xl"
                      disabledDate={(current) =>
                        current && current < dayjs().startOf("day")
                      }
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={scheduleLabVideoCall.isPending}
                    className="w-full rounded-xl"
                  >
                    Schedule Lab Video
                  </Button>
                </Form>
              </>
            )}
          </RibbonCard>
        </div>
      </div>
    </div>
  );
};

export default AdminLabVideosPage;
