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
      <Title level={2}>Essay Lecture Series</Title>
      <Text type="secondary">Watch your assigned essay lectures here.</Text>

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
