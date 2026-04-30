import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Upload,
  Button,
  message,
  Table,
  Skeleton,
  Space,
  Tag,
} from "antd";
import {
  UploadOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
// import { RibbonCard } from "./RibbonCard";
import useHttp from "@/hooks/use-http";
import RibbonCard from "@/components/molecules/card/RibbonCard";
import { useNavigate } from "react-router";
import { SiGoogledisplayandvideo360 } from "react-icons/si";

const { Title, Text } = Typography;
const { Dragger } = Upload;

// Helpers (Same as your LabVideos component)
const formatDateTime = (date?: string | Date | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleString();
};

const UploadEssayVideos = () => {
  const { sendRequest } = useHttp({ type: "auth" });
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchVideos = async () => {
    try {
      const res = await sendRequest({ url: "getEssayVideos", method: "GET" });
      console.log("Fetched videos:", res);
      setVideos(res?.response?.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const uploadProps = {
    name: "video",
    multiple: false,
    showUploadList: false, // We don't need the default list since we have a table
    customRequest: async (options: any) => {
      const { file, onSuccess, onError } = options;
      const formData = new FormData();
      formData.append("video", file);

      try {
        setLoading(true);
        await sendRequest({
          url: "uploadEssayVideos",
          method: "POST",
          payload: formData,
        });
        message.success(`${file.name} uploaded successfully.`);
        onSuccess?.();
        // ✅ Trigger refresh after successful upload
        fetchVideos();
      } catch (err) {
        message.error(`${file.name} upload failed.`);
        onError?.(err);
      } finally {
        setLoading(false);
      }
    },
  };

  const handleWatchVideo = async (record: any) => {
    console.log("Watch video clicked for record:", record);
    navigate(`/watch-video/${record?.id}`, {
      state: {
        fromTheoryVideos: true,
        title: record?.title,
        video_url: record?.url,
      },
    });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (val: string) => <Text strong>{val}</Text>,
    },
    {
      title: "Uploaded At",
      dataIndex: "url", // Assuming metadata is inside the video object or inferred
      key: "url",
      render: (_, record: any) => (
        <Button
          type="primary"
          icon={<SiGoogledisplayandvideo360 />}
          onClick={() => handleWatchVideo(record)}
        >
          Watch
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Header */}
        <Card
          className="mb-6 overflow-hidden rounded-[30px] border-none shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
          styles={{ body: { padding: 0 } }}
        >
          <div className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 px-6 py-8 text-white md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                  {/* <SettingOutlined /> */}
                  Upload Video Config
                </div>
                <Title level={2} style={{ color: "#fff", margin: 0 }}>
                  Upload Essay Videos
                </Title>
              </div>
            </div>
          </div>
        </Card>

        {/* Upload Section (Top) */}

        <RibbonCard title="Upload New Lecture" className="mb-6 shadow-sm">
          <Dragger {...uploadProps} className="!p-8">
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag video file here to upload
            </p>
            <p className="ant-upload-hint">
              Uploads will be automatically sequenced (e.g., lecture-01,
              lecture-02).
            </p>
          </Dragger>
        </RibbonCard>

        {/* List Section (Bottom) */}
        <RibbonCard title="Video Library" className="shadow-sm">
          {loading ? (
            <Skeleton active />
          ) : (
            <Table
              rowKey="title"
              columns={columns}
              dataSource={videos}
              pagination={{ pageSize: 10 }}
            />
          )}
        </RibbonCard>
      </div>
    </div>
  );
};
export default UploadEssayVideos;
