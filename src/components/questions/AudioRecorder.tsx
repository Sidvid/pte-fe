import React from "react";
import { Button, Space, Progress, Typography, Card } from "antd";
import {
  AudioOutlined,
  PauseOutlined,
  StopOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";

const { Text } = Typography;

const AudioRecorder = ({
  maxDuration = 60,
  onRecordingComplete,
  disabled = false,
}) => {
  const {
    isRecording,
    isPaused,
    recordingTime,
    audioUrl,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
    formatTime,
  } = useAudioRecorder({ onRecordingComplete, maxDuration });

  const progress = (recordingTime / maxDuration) * 100;

  return (
    <Card size="small" style={{ background: "#fafafa" }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* Recording Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: isRecording && !isPaused ? "#ff4d4f" : "#d9d9d9",
              animation:
                isRecording && !isPaused ? "pulse 1s infinite" : "none",
            }}
          />
          <Text strong style={{ fontSize: "18px", fontFamily: "monospace" }}>
            {formatTime()}
          </Text>
          <Progress
            percent={progress}
            showInfo={false}
            style={{ flex: 1 }}
            strokeColor={progress > 80 ? "#ff4d4f" : "#1890ff"}
          />
          <Text type="secondary">{maxDuration}s max</Text>
        </div>

        {/* Controls */}
        <Space>
          {!isRecording && !audioUrl && (
            <Button
              type="primary"
              icon={<AudioOutlined />}
              onClick={startRecording}
              disabled={disabled}
              danger
            >
              Start Recording
            </Button>
          )}

          {isRecording && (
            <>
              {!isPaused ? (
                <Button icon={<PauseOutlined />} onClick={pauseRecording}>
                  Pause
                </Button>
              ) : (
                <Button icon={<AudioOutlined />} onClick={resumeRecording}>
                  Resume
                </Button>
              )}
              <Button
                type="primary"
                icon={<StopOutlined />}
                onClick={stopRecording}
                danger
              >
                Stop
              </Button>
            </>
          )}

          {audioUrl && !isRecording && (
            <>
              <audio controls src={audioUrl} style={{ height: "40px" }} />
              <Button icon={<DeleteOutlined />} onClick={clearRecording} danger>
                Re-record
              </Button>
            </>
          )}
        </Space>
      </Space>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Card>
  );
};

export default AudioRecorder;
