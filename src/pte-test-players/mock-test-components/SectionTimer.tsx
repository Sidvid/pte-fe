import React, { useEffect, useMemo, useRef, useState } from "react";
import { Progress, Typography } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

type SectionTimerProps = {
  durationMinutes: number;
  isPaused?: boolean;
  resetKey?: string | number;
  onTimeUp?: () => void;
};

const SectionTimer = ({
  durationMinutes,
  isPaused = false,
  resetKey,
  onTimeUp,
}: SectionTimerProps) => {
  const totalSeconds = durationMinutes * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    setRemainingSeconds(totalSeconds);
    hasTriggeredRef.current = false;
  }, [totalSeconds, resetKey]);

  useEffect(() => {
    if (isPaused || remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          if (!hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            onTimeUp?.();
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, remainingSeconds, onTimeUp]);

  const percent = useMemo(() => {
    if (totalSeconds === 0) return 0;
    return Math.max(0, Math.round((remainingSeconds / totalSeconds) * 100));
  }, [remainingSeconds, totalSeconds]);

  const formatted = useMemo(() => {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, [remainingSeconds]);

  const strokeColor =
    percent > 50 ? "#1677ff" : percent > 20 ? "#faad14" : "#ff4d4f";

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClockCircleOutlined className="text-blue-500" />
          <Text className="font-medium text-slate-700">Section Timer</Text>
        </div>
        <Text
          className={`font-mono text-lg font-bold ${
            percent <= 20 ? "text-red-500" : "text-slate-800"
          }`}
        >
          {formatted}
        </Text>
      </div>

      <Progress
        percent={percent}
        showInfo={false}
        strokeColor={strokeColor}
        trailColor="#e5e7eb"
      />
    </div>
  );
};

export default SectionTimer;
