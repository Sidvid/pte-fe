import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button, Card, Progress, Space, Typography, Alert, Modal } from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  FullscreenOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const VideoPlayer = ({
  videoUrl,
  title = "Video",
  onComplete,
  minCompletionPercent = 95,
  disableSeeking = true,
  forceFullscreen = true,
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [maxWatchedTime, setMaxWatchedTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [fullscreenWarning, setFullscreenWarning] = useState(false);
  const [tabWarning, setTabWarning] = useState(false);

  const completionPercent = duration
    ? Math.min((maxWatchedTime / duration) * 100, 100)
    : 0;

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const enterFullscreen = async () => {
    try {
      const el = containerRef.current;
      if (!el) return;

      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
        await el.msRequestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen request failed:", err);
    }
  };

  const isInFullscreen = () => {
    return !!document.fullscreenElement;
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration || 0);

    if (forceFullscreen) {
      enterFullscreen();
    }
  };

  const handlePlayPause = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      if (forceFullscreen && !isInFullscreen()) {
        await enterFullscreen();
      }
      video.play();
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const ct = video.currentTime;
    setCurrentTime(ct);

    if (ct > maxWatchedTime) {
      setMaxWatchedTime(ct);
    }
  };

  const handleSeeking = () => {
    const video = videoRef.current;
    if (!video || !disableSeeking) return;

    // If user tries to jump ahead, snap back
    if (video.currentTime > maxWatchedTime + 1) {
      video.currentTime = maxWatchedTime;
    }
  };

  const handleEnded = () => {
    const percent = duration ? (maxWatchedTime / duration) * 100 : 0;

    if (percent >= minCompletionPercent) {
      setIsCompleted(true);
      setIsPlaying(false);
      onComplete?.({
        completed: true,
        watchedSeconds: maxWatchedTime,
        duration,
        completionPercent: percent,
      });
    }
  };

  const handleKeyDown = useCallback((e) => {
    // Browser-level preventions only
    const blockedKeys = [
      "ArrowRight",
      "ArrowLeft",
      "f",
      "F",
      " ",
      "MediaTrackNext",
      "MediaTrackPrevious",
    ];

    if (blockedKeys.includes(e.key)) {
      e.preventDefault();
    }

    // Esc can be listened to but may not fully stop fullscreen exit
    if (e.key === "Escape") {
      e.preventDefault();
    }

    // Windows key / Meta key cannot be truly blocked reliably
  }, []);

  const handleFullscreenChange = useCallback(() => {
    if (forceFullscreen && !isCompleted && !document.fullscreenElement) {
      const video = videoRef.current;
      if (video && !video.paused) {
        video.pause();
      }
      setIsPlaying(false);
      setFullscreenWarning(true);
    }
  }, [forceFullscreen, isCompleted]);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && !isCompleted) {
      const video = videoRef.current;
      if (video && !video.paused) {
        video.pause();
      }
      setIsPlaying(false);
      setTabWarning(true);
    }
  }, [isCompleted]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleKeyDown, handleFullscreenChange, handleVisibilityChange]);

  return (
    <>
      <Card ref={containerRef} style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Title level={4} style={{ margin: 0 }}>
              {title}
            </Title>
            <Space>
              <Text strong>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>
            </Space>
          </div>

          {!isCompleted && (
            <Alert
              type="warning"
              showIcon
              icon={<WarningOutlined />}
              message="Restrictions Enabled. Do not skip, exit fullscreen, or switch tabs while watching."
              //   description="Do not skip, exit fullscreen, or switch tabs while watching."
            />
          )}

          <div
            style={{
              background: "#000",
              borderRadius: 12,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <video
              ref={videoRef}
              src={videoUrl}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onSeeking={handleSeeking}
              onEnded={handleEnded}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              controls={false}
              style={{
                width: "100%",
                maxHeight: "75vh",
                background: "#000",
              }}
            />
          </div>

          <Progress
            percent={Math.round(completionPercent)}
            status={isCompleted ? "success" : "active"}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Space>
              <Button
                type="primary"
                icon={
                  isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />
                }
                onClick={handlePlayPause}
                disabled={isCompleted}
              >
                {isPlaying ? "Pause" : "Play"}
              </Button>

              <Button
                icon={<FullscreenOutlined />}
                onClick={enterFullscreen}
                disabled={isCompleted}
              >
                Fullscreen
              </Button>
            </Space>

            <Text>
              Watched: <b>{Math.round(completionPercent)}%</b>
            </Text>
          </div>

          {isCompleted && (
            <Alert
              type="success"
              showIcon
              message="Video Completed"
              description="You have successfully watched the video. You may proceed."
            />
          )}
        </Space>
      </Card>

      <Modal
        open={fullscreenWarning}
        onCancel={() => setFullscreenWarning(false)}
        onOk={async () => {
          setFullscreenWarning(false);
          await enterFullscreen();
        }}
        okText="Re-enter Fullscreen"
        cancelText="Close"
        title="Fullscreen Required"
      >
        <p>You exited fullscreen. Please continue in fullscreen mode.</p>
      </Modal>

      <Modal
        open={tabWarning}
        onCancel={() => setTabWarning(false)}
        onOk={() => setTabWarning(false)}
        okText="Continue"
        cancelText="Close"
        title="Tab Switch Detected"
      >
        <p>
          You switched tabs or minimized the window. Please stay on the video
          screen.
        </p>
      </Modal>
    </>
  );
};

export default VideoPlayer;
