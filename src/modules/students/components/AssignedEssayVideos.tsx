import React, { useEffect, useState } from "react";
import { Card, Typography, Skeleton, Empty, Row, Col } from "antd";
import useHttp from "@/hooks/use-http";
import VideoPlayer from "@/modules/common/videoPlayer/VideoPlayer";

const { Title, Text } = Typography;

const AssignedEssayVideos = () => {
  const { sendRequest } = useHttp({ type: "auth" });
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await sendRequest({ url: "getEssayVideos", method: "GET" });
        setVideos(res?.response?.data || []);
      } catch (err) {
        console.error("Failed to load videos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <Card
        className="mb-6 overflow-hidden rounded-[30px] border-none shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
        styles={{ body: { padding: 0 } }}
      >
        <div className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 px-6 py-8 text-white md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                {/* <SettingOutlined /> */}
                Watch your assigned essay lectures here.
              </div>
              <Title level={2} style={{ color: "#fff", margin: 0 }}>
                Essay Lecture Series
              </Title>
            </div>
          </div>
        </div>
      </Card>
      {loading ? (
        <Skeleton active />
      ) : !videos.length ? (
        <Empty description="No lectures available yet" />
      ) : (
        <Row gutter={[24, 24]} className="mt-6">
          {videos.map((video: any) => (
            <Col xs={24} md={12} lg={8} key={video.url}>
              <Card
                hoverable
                className="rounded-2xl shadow-sm"
                cover={
                  //   <video
                  //     controls
                  //     className="w-full h-48 object-cover rounded-t-2xl"
                  //   >
                  //     <source src={video.url} type="video/mp4" />
                  //   </video>
                  <VideoPlayer
                    videoUrl={video.url}
                    title={video.title}
                    minCompletionPercent={95}
                    disableSeeking={true}
                    forceFullscreen={true}
                  />
                }
              >
                <Card.Meta
                  title={video.title}
                  description="Educational Content"
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default AssignedEssayVideos;
