import { useLocation } from "react-router";
import VideoPlayer from "./VideoPlayer";

const WatchVideoPage = () => {
  const { state } = useLocation();
  console.log("state state", state);
  return (
    <div>
      <VideoPlayer
        title={state?.title}
        videoUrl={state?.video_url}
        onComplete={state?.onComplete}
      />
    </div>
  );
};

export default WatchVideoPage;
