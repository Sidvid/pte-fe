import React, { useState, useRef, useEffect } from "react";
import { Slider, ConfigProvider, Tooltip, Dropdown, MenuProps } from "antd";
import {
  PlayCircleFilled,
  PauseCircleFilled,
  SoundOutlined,
  MutedOutlined,
  SettingOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from "@ant-design/icons";

interface AudioPlayerProps {
  src: string; // URL of the audio file
  title?: string; // Optional title (e.g., "Question 1 Audio")
}

const CustomAudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title = "Audio Track",
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  // --- Format Time Helper (00:00) ---
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // --- Event Handlers ---
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const handleVolumeChange = (value: number) => {
    if (audioRef.current) {
      const vol = value / 100;
      audioRef.current.volume = vol;
      setVolume(vol);
      setIsMuted(vol === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuteState = !isMuted;
      audioRef.current.muted = newMuteState;
      setIsMuted(newMuteState);
    }
  };

  const handleSpeedChange: MenuProps["onClick"] = (e) => {
    const rate = parseFloat(e.key);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  // --- Speed Menu ---
  const speedMenu: MenuProps = {
    items: [
      { key: "0.5", label: "0.5x (Slow)" },
      { key: "1.0", label: "1.0x (Normal)" },
      { key: "1.2", label: "1.2x" },
      { key: "1.5", label: "1.5x (Fast)" },
      { key: "2.0", label: "2.0x" },
    ],
    onClick: handleSpeedChange,
    selectable: true,
    defaultSelectedKeys: ["1.0"],
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Slider: {
            colorPrimary: "#10b981", // Emerald-500 matching your gradient
            handleColor: "#10b981",
            trackHoverBg: "#34d399",
          },
        },
      }}
    >
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Top Section: Gradient Visualization & Title */}
        <div className="relative h-32 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center overflow-hidden">
          {/* Simulated Animated Waveform Background */}
          <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`w-2 bg-emerald-400 rounded-full transition-all duration-300 ease-in-out ${
                  isPlaying ? "animate-pulse" : "h-2"
                }`}
                style={{
                  height: isPlaying ? `${Math.random() * 60 + 20}%` : "10%",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center">
            <h3 className="text-white font-semibold tracking-wide text-lg drop-shadow-md">
              {title}
            </h3>
            <p className="text-emerald-400 text-xs uppercase font-bold tracking-wider mt-1">
              {isPlaying ? "Now Playing" : "Paused"}
            </p>
          </div>
        </div>

        {/* Bottom Section: Controls */}
        <div className="px-6 py-4">
          <audio
            ref={audioRef}
            src={src}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Progress Bar */}
          <div className="flex items-center gap-3 text-xs font-medium text-gray-500 mb-2">
            <span>{formatTime(currentTime)}</span>
            <div className="flex-1">
              <Slider
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                tooltip={{ formatter: (val) => formatTime(val || 0) }}
                trackStyle={{
                  background:
                    "linear-gradient(90deg, #34d399 0%, #10b981 100%)",
                }}
                railStyle={{ background: "#e5e7eb" }}
                handleStyle={{
                  borderColor: "#10b981",
                  boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
                }}
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Main Controls Row */}
          <div className="flex items-center justify-between mt-2">
            {/* Left: Volume Controls */}
            <div className="flex items-center gap-3 w-1/4 group">
              <button
                onClick={toggleMute}
                className="text-gray-400 hover:text-emerald-600 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <MutedOutlined className="text-xl" />
                ) : (
                  <SoundOutlined className="text-xl" />
                )}
              </button>
              <div className="w-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Slider
                  min={0}
                  max={100}
                  value={isMuted ? 0 : volume * 100}
                  onChange={handleVolumeChange}
                  size="small"
                />
              </div>
            </div>

            {/* Center: Play/Pause/Skip */}
            <div className="flex items-center justify-center gap-6 flex-1">
              <button
                onClick={togglePlay}
                className="transition-transform active:scale-95 focus:outline-none"
              >
                {isPlaying ? (
                  <PauseCircleFilled className="text-5xl text-emerald-500 hover:text-emerald-600 drop-shadow-lg" />
                ) : (
                  <PlayCircleFilled className="text-5xl text-emerald-500 hover:text-emerald-600 drop-shadow-lg" />
                )}
              </button>
            </div>

            {/* Right: Settings / Speed */}
            <div className="flex items-center justify-end gap-3 w-1/4">
              <Dropdown
                menu={speedMenu}
                placement="topRight"
                trigger={["click"]}
              >
                <Tooltip title="Playback Speed">
                  <button className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-600 transition-colors">
                    <span>{playbackRate}x</span>
                    <SettingOutlined />
                  </button>
                </Tooltip>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CustomAudioPlayer;
