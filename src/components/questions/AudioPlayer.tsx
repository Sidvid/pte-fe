import React, { useState, useEffect, useRef } from "react";
import { Button, Slider, Space, Typography } from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import { useAudioPlayer } from "react-use-audio-player";

const { Text } = Typography;

const AudioPlayer = ({
  src = "",
  autoPlay = false,
  maxPlays = 1,
  onPlayComplete = null,
  onPlayStart = null,
  disabled = false,
}) => {
  const [playCount, setPlayCount] = useState(0);
  const [position, setPosition] = useState(0);
  const positionRef = useRef(0);

  const {
    load,
    play,
    pause,
    stop,
    isPlaying: playing,
    duration,
    seek,
    getPosition,
    ready,
  } = useAudioPlayer();

  // Load audio when src changes
  useEffect(() => {
    if (src) {
      load(src, {
        autoplay: autoPlay,
        onend: () => {
          setPlayCount((prev) => prev + 1);
          onPlayComplete?.();
        },
        onplay: () => {
          onPlayStart?.();
        },
      });
    }

    return () => {
      stop();
    };
  }, [src]);

  // Update position while playing
  useEffect(() => {
    let interval;

    if (playing) {
      interval = setInterval(() => {
        const pos = getPosition();
        positionRef.current = pos;
        setPosition(pos);
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [playing, getPosition]);

  const handlePlayPause = () => {
    if (playing) {
      pause();
    } else {
      if (playCount >= maxPlays) return;
      play();
    }
  };

  const handleSeek = (value) => {
    seek(value);
    setPosition(value);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const canPlay = playCount < maxPlays && !disabled && ready;

  return (
    <div
      style={{
        padding: "16px",
        background: "#f5f5f5",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={playing ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
        onClick={handlePlayPause}
        // disabled={!canPlay}
      />

      <div style={{ flex: 1 }}>
        <Slider
          value={position}
          max={duration || 100}
          onChange={handleSeek}
          tooltip={{ formatter: (value) => formatTime(value) }}
          // disabled={!ready}
        />
      </div>

      <Space>
        <SoundOutlined style={{ color: "#1890ff" }} />
        <Text type="secondary">
          {formatTime(position)} / {formatTime(duration || 0)}
        </Text>
        {maxPlays > 1 && (
          <Text type="secondary">
            ({playCount}/{maxPlays} plays)
          </Text>
        )}
      </Space>
    </div>
  );
};

export default AudioPlayer;
