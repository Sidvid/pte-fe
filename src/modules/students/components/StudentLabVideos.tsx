import React, { useEffect } from "react";
import { Alert, Button, Card, Empty, Skeleton, Typography } from "antd";
import { useMutation } from "@tanstack/react-query";
import { PlayCircleOutlined, VideoCameraOutlined } from "@ant-design/icons";
import useHttp from "@/hooks/use-http";
import VideoPlayer from "@/modules/common/videoPlayer/VideoPlayer";

const { Title, Text, Paragraph } = Typography;

const LabVideos = () => {
  const { sendRequest } = useHttp({ type: "auth" });

  const scheduledLabVideoCall = useMutation({
    mutationFn: () =>
      sendRequest({
        url: "studentScheduledLabVideo",
        method: "GET",
      }),
  });

  useEffect(() => {
    scheduledLabVideoCall.mutate();
  }, []);

  const payload =
    scheduledLabVideoCall.data?.response?.data ||
    scheduledLabVideoCall.data?.data ||
    scheduledLabVideoCall.data;

  const video = payload?.video;

  if (scheduledLabVideoCall.isPending) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto w-full max-w-5xl">
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      </div>
    );
  }

  if (scheduledLabVideoCall.isError) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto w-full max-w-5xl">
          <Alert
            type="error"
            showIcon
            message="Failed to load lab video"
            description="Please try again later."
          />
        </div>
      </div>
    );
  }

  if (!payload || !video) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto w-full max-w-5xl">
          <Card className="rounded-[28px] shadow-sm">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No lab video scheduled for today"
            />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff,_#f8fafc_35%,_#f8fafc_100%)] p-4 md:p-6">
      <div className="mx-auto w-full max-w-6xl">
        {/* Hero header */}
        <Card
          className="mb-6 overflow-hidden rounded-[30px] border-none shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
          styles={{ body: { padding: 0 } }}
        >
          <div className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 px-6 py-8 text-white md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                  <VideoCameraOutlined />
                  Lab Video
                </div>

                <Title level={2} style={{ color: "#fff", margin: 0 }}>
                  Today's Scheduled Lab Video
                </Title>

                <Text style={{ color: "rgba(255,255,255,0.9)" }}>
                  Watch the assigned lab session for today and continue your PTE
                  practice.
                </Text>
              </div>

              <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur-md">
                <div className="text-xs uppercase tracking-wide text-white/75">
                  Scheduled Date
                </div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {payload?.date || "-"}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Video card */}
        <Card className="rounded-[28px] shadow-sm">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <Title level={3} className="!mb-1">
                {video.title || "Lab Video"}
              </Title>
              <Text type="secondary">{video.video_key}</Text>
            </div>
          </div>

          {video.signed_url ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm">
              <VideoPlayer
                videoUrl={video.signed_url}
                title={video.title}
                onComplete={(data) => {
                  console.log("Lab video completed:", data);
                }}
              />
            </div>
          ) : (
            <Alert
              type="warning"
              showIcon
              message="Video URL not available"
              description="The video was scheduled, but its playback URL could not be generated."
            />
          )}

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <Paragraph className="!mb-1">
              <Text strong>Scheduled At:</Text>{" "}
              {video.scheduled_at
                ? new Date(video.scheduled_at).toLocaleString()
                : "-"}
            </Paragraph>

            <Paragraph className="!mb-0">
              <Text strong>Video Key:</Text> {video.video_key}
            </Paragraph>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LabVideos;
