import { useLocation } from "react-router";
import VideoPlayer from "./VideoPlayer";
import { notification } from "antd";
import { SuccessResponse } from "@/utils/model/model";
import useHttp from "@/hooks/use-http";
import { useMutation } from "@tanstack/react-query";

const WatchVideoPage = () => {
  const location = useLocation();
  const {
    title,
    video_url,
    onComplete: videoId,
    isProceedToTaskBtnEnabled,
    task_id,
    fromTheoryVideos,
  } = location.state || {};
  console.log("locationlocationlocation", location);

  const { sendRequest } = useHttp({ type: "auth" });

  const markVideoWatched = useMutation<SuccessResponse<any>, Error, string>({
    mutationFn: (sequence: string) =>
      sendRequest({
        url: "markVideoWatched",
        method: "POST",
        endURL: `${sequence}/complete`,
        // payload: { sequence },
      }) as Promise<SuccessResponse<any>>,
    onSuccess: () => {
      notification.success({
        message: "Video marked as completed!",
      });
    },
    onError: () => {
      notification.error({
        message: "Failed to mark video as completed",
      });
    },
  });

  const handleVideoComplete = async (completionData: any) => {
    if (!videoId) return;
    try {
      await markVideoWatched.mutateAsync(videoId);
    } catch (error) {
      console.error("Error marking video as watched:", error);
    }
  };

  return (
    <VideoPlayer
      videoUrl={video_url}
      title={title}
      onComplete={handleVideoComplete} // This triggers when video ends
      minCompletionPercent={95}
      disableSeeking={true}
      forceFullscreen={true}
      isProceedToTaskBtnEnabled={isProceedToTaskBtnEnabled}
      task_id={task_id}
      fromTheoryVideos={fromTheoryVideos}
    />
  );
};

export default WatchVideoPage;
