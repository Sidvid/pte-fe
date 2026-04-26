import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button, Slider, Space, Typography } from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const AudioPlayer = ({
  src = "",
  autoPlay = false,
  maxPlays = 1,
  onPlayComplete = null,
  onPlayStart = null,
  disabled = false,
}) => {
  // --- State ---
  const [playCount, setPlayCount] = useState(0);
  const [position, setPosition] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);

  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  // Use refs for callbacks to prevent infinite re-render loops
  const onPlayCompleteRef = useRef(onPlayComplete);
  const onPlayStartRef = useRef(onPlayStart);

  useEffect(() => {
    onPlayCompleteRef.current = onPlayComplete;
    onPlayStartRef.current = onPlayStart;
  }, [onPlayComplete, onPlayStart]);

  // --- Audio Engine ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    // Reset state when src changes
    setPlaying(false);
    setPosition(0);
    setReady(false);

    // Set source
    audio.src = src;

    // Load handlers
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setReady(true);
      if (autoPlay) {
        audio.play().catch((e) => console.warn("Autoplay blocked", e));
      }
    };

    const handlePlay = () => {
      setPlaying(true);
      onPlayStartRef.current?.();
    };

    const handlePause = () => setPlaying(false);

    const handleEnded = () => {
      setPlaying(false);
      setPlayCount((prev) => prev + 1);
      onPlayCompleteRef.current?.();
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, [src, autoPlay]);

  // --- Position Sync ---
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        if (audioRef.current) setPosition(audioRef.current.currentTime);
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  // --- Handlers ---
  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      if (playCount >= maxPlays) return;
      audioRef.current.play();
    }
  };

  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setPosition(value);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
      <audio ref={audioRef} preload="metadata" />

      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={playing ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
        onClick={handlePlayPause}
        disabled={disabled || !ready || (playCount >= maxPlays && !playing)}
      />

      <div style={{ flex: 1 }}>
        <Slider
          value={position}
          max={duration || 100}
          onChange={handleSeek}
          disabled={!ready}
          tooltip={{ formatter: (value) => formatTime(value) }}
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
