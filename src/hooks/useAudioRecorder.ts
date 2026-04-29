import { message } from "antd";
import { useState, useRef, useCallback } from "react";

export const useAudioRecorder = ({ onRecordingComplete, maxDuration = 60 }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        onRecordingComplete?.(blob, url);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  }, [maxDuration, onRecordingComplete]);

  // const startRecording = useCallback(async () => {
  //   // Safety Guard: Check if the API exists before trying to use it
  //   if (!navigator.mediaDevices?.getUserMedia) {
  //     console.error("Microphone API not available.");
  //     message.error(
  //       "Audio recording is not supported in this browser context (Try enabling Insecure Origins in chrome://flags)",
  //     );
  //     return;
  //   }

  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //     // ... rest of your original logic stays exactly the same
  //     const mediaRecorder = new MediaRecorder(stream, {
  //       mimeType: "audio/webm;codecs=opus",
  //     });
  //     // ... (your existing setup code)
  //     mediaRecorder.start();
  //     setIsRecording(true);
  //     // ...
  //   } catch (err) {
  //     console.error("Error starting recording:", err);
  //     message.error("Recording error: " + err.message);
  //   }
  // }, [maxDuration, onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      clearInterval(timerRef.current);
    }
  }, [isRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      clearInterval(timerRef.current);
    }
  }, [isRecording]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  }, [isPaused]);

  const clearRecording = useCallback(() => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
  }, []);

  const formatTime = useCallback(() => {
    const mins = Math.floor(recordingTime / 60);
    const secs = recordingTime % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, [recordingTime]);

  return {
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
    formatTime,
  };
};
