import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Space,
  Typography,
  Button,
  Progress,
  Modal,
  notification,
} from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const VideoPlayer = ({
  videoUrl,
  title = "Video",
  onComplete = null,
  minCompletionPercent = 95,
  disableSeeking = true,
  forceFullscreen = true,
  isProceedToTaskBtnEnabled = false,
  task_id = null,
  fromTheoryVideos = false,
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const isActiveRef = useRef(false);
  const isCompletedRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [maxWatchedTime, setMaxWatchedTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [fullscreenWarning, setFullscreenWarning] = useState(false);
  const [tabWarning, setTabWarning] = useState(false);
  const navigate = useNavigate();

  const completionPercent = duration
    ? Math.min((maxWatchedTime / duration) * 100, 100)
    : 0;

  useEffect(() => {
    isCompletedRef.current = isCompleted;
  }, [isCompleted]);

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
    if (video.currentTime > maxWatchedTime + 1) {
      video.currentTime = maxWatchedTime;
    }
  };

  const handleEnded = () => {
    const percent = duration ? (maxWatchedTime / duration) * 100 : 0;
    if (percent >= minCompletionPercent) {
      setIsCompleted(true);
      isCompletedRef.current = true;
      setIsPlaying(false);
      isActiveRef.current = false;
      notification.success({
        message: "You have successfully watched the video. You may proceed.",
      });
      onComplete?.({
        completed: true,
        watchedSeconds: maxWatchedTime,
        duration,
        completionPercent: percent,
      });
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => {
      isActiveRef.current = true;
      setIsPlaying(true);
    };
    const onPause = () => {
      isActiveRef.current = false;
      setIsPlaying(false);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (!isActiveRef.current) return;

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

    if (e.key === "Escape") {
      e.preventDefault();
    }
  }, []);

  const handleFullscreenChange = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const videoIsPlaying = !video.paused && !video.ended;

    if (!isActiveRef.current && !videoIsPlaying) return;
    if (isCompletedRef.current) return;

    if (forceFullscreen && !document.fullscreenElement) {
      if (!video.paused) {
        video.pause();
      }
      setIsPlaying(false);
      isActiveRef.current = false;
      setFullscreenWarning(true);
    }
  }, [forceFullscreen]);

  const handleVisibilityChange = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const videoIsPlaying = !video.paused && !video.ended;

    if (!isActiveRef.current && !videoIsPlaying) return;
    if (isCompletedRef.current) return;

    if (document.hidden) {
      if (!video.paused) {
        video.pause();
      }
      setIsPlaying(false);
      isActiveRef.current = false;
      setTabWarning(true);
    }
  }, []);

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

  const handleAssignedVideoTask = () => {
    navigate(`/take-task/${task_id}`, {
      state: {
        fromTheoryVideos,
        isDailyTask: true,
        taskId: task_id,
      },
    });
  };

  return (
    <>
      <Card ref={containerRef} style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {/* Title and Time */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              {title}
            </Title>
            <Text strong>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
          </div>

          {/* Video Element */}
          <video
            ref={videoRef}
            src={videoUrl}
            style={{
              width: "100%",
              maxHeight: "75vh",
              borderRadius: 8,
              background: "#000",
            }}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onSeeking={handleSeeking}
            onEnded={handleEnded}
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
          />

          {/* Progress Bar */}
          <Progress
            percent={Math.round(completionPercent)}
            size="small"
            status={isCompleted ? "success" : "active"}
            style={{ margin: 0 }}
          />

          {/* Controls Row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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

            <Text type="secondary" style={{ fontSize: 13 }}>
              {isCompleted
                ? "✅ Video completed!"
                : `${Math.round(completionPercent)}% watched`}
            </Text>
          </div>

          {/* Proceed to Task Button */}
          {isCompleted && isProceedToTaskBtnEnabled && task_id && (
            <Button
              type="primary"
              onClick={handleAssignedVideoTask}
              style={{ width: "100%" }}
            >
              Proceed to Task
            </Button>
          )}
        </Space>
      </Card>

      {/* Fullscreen Warning Modal */}
      <Modal
        open={fullscreenWarning}
        closable={false}
        maskClosable={false}
        footer={[
          <Button
            key="resume"
            type="primary"
            onClick={async () => {
              setFullscreenWarning(false);
              await enterFullscreen();
              const video = videoRef.current;
              if (video) {
                video.play();
              }
            }}
          >
            Resume in Fullscreen
          </Button>,
        ]}
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <WarningOutlined style={{ fontSize: 48, color: "#faad14" }} />
          <Title level={4} style={{ marginTop: 16 }}>
            Fullscreen Required
          </Title>
          <Text>
            You exited fullscreen. The video has been paused. Please resume in
            fullscreen to continue watching.
          </Text>
        </div>
      </Modal>

      {/* Tab Switch Warning Modal */}
      <Modal
        open={tabWarning}
        closable={false}
        maskClosable={false}
        footer={[
          <Button
            key="resume"
            type="primary"
            onClick={async () => {
              setTabWarning(false);
              await enterFullscreen();
              const video = videoRef.current;
              if (video) {
                video.play();
              }
            }}
          >
            Resume Watching
          </Button>,
        ]}
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <WarningOutlined style={{ fontSize: 48, color: "#ff4d4f" }} />
          <Title level={4} style={{ marginTop: 16 }}>
            Tab Switch Detected
          </Title>
          <Text>
            You switched tabs. The video has been paused. Please resume
            watching.
          </Text>
        </div>
      </Modal>
    </>
  );
};

export default VideoPlayer;
