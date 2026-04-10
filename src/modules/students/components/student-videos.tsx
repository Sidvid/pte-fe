import useHttp from "@/hooks/use-http";
import { SuccessResponse } from "@/utils/model/model";
import { useMutation } from "@tanstack/react-query";
import { Table, TableProps, Tag, Button, Space, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { SiGoogledisplayandvideo360 } from "react-icons/si";
import { GiProgression } from "react-icons/gi";
import { useNavigate } from "react-router";
import VideoPlayer from "@/modules/common/videoPlayer/VideoPlayer";
import LabVideos from "./StudentLabVideos";

interface Video {
  id: string;
  title: string;
  type: "theory" | "lab";
  duration: string;
  task_id: string;
  is_video_unlocked: boolean;
  is_video_watched: boolean;
  is_task_enabled: boolean;
  sequence: string;
  video_url: string;
  status: string;
}

function StudentVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isTheoryVideosCompleted, setIsTheoryVideosCompleted] = useState<any>();
  const { sendRequest } = useHttp({ type: "auth" });
  const navigate = useNavigate();

  const fetchTheoryVideoCompletionStatus = useMutation({
    mutationFn: () =>
      sendRequest({
        url: "theoryVideosCompletionStatus",
        method: "GET",
      }) as Promise<SuccessResponse<any>>,
    onSuccess: (data: SuccessResponse<any>) => {
      const { response } = data;
      console.log("dsdfdsfs", response);
      setIsTheoryVideosCompleted(response?.data);
    },
  });
  React.useEffect(() => {
    fetchTheoryVideoCompletionStatus.mutateAsync();
  }, []);

  const fetchVideos = useMutation({
    mutationFn: () =>
      sendRequest({
        url: "getAllTheoryVideos",
        method: "GET",
      }) as Promise<any>,
    onSuccess: (data) => {
      const { response } = data;
      console.log("Fetched videos:", response);
      setVideos(response.data.videos);
    },
    onError: (error) => {
      console.error("Error fetching videos:", error);
      setVideos([
        {
          id: "vid1",
          title: "Theory: Reading Strategies",
          type: "theory",
          duration: "25:30",
        },
        {
          id: "vid2",
          title: "Lab: Speaking Practice",
          type: "lab",
          duration: "18:45",
        },
        {
          id: "vid3",
          title: "Theory: Writing Techniques",
          type: "theory",
          duration: "32:15",
        },
        {
          id: "vid4",
          title: "Lab: Listening Skills",
          type: "lab",
          duration: "20:10",
        },
        {
          id: "vid5",
          title: "Theory: Overview of PTE Exam",
          type: "theory",
          duration: "15:20",
        },
        {
          id: "vid6",
          title: "Lab: Pronunciation Tips",
          type: "lab",
          duration: "22:30",
        },
      ]);
    },
  });

  useEffect(() => {
    fetchVideos.mutate();
  }, []);

  const markVideoWatched = useMutation({
    mutationFn: (sequence: string) =>
      sendRequest({
        url: "markVideoWatched",
        method: "POST",
        endURL: `${sequence}/complete`,
        // payload: { sequence },
      }) as Promise<SuccessResponse<any>>,
    onSuccess: (data: SuccessResponse<any>) => {
      const { response } = data;
      console.log("Video marked as watched:", response);
    },
  });

  const onCompleteVideo = async (videoId: string) => {
    try {
      await markVideoWatched.mutateAsync(videoId);
    } catch (error) {
      console.error("Error marking video as watched:", error);
    }
  };

  const handleWatchVideo = async (record: any) => {
    console.log("Watch video clicked for record:", record);
    navigate(`/watch-video/${record?.sequence}`, {
      state: {
        fromTheoryVideos: true,
        title: record?.title,
        video_url: record?.video_url,
        onComplete: !record?.is_video_watched ? record?.sequence : null,
        task_id: record?.task_id,
        isProceedToTaskBtnEnabled:
          record?.is_video_watched && !record?.is_task_submitted,
      },
    });
  };

  const handleAssignedVideoTask = (record: any) => {
    console.log("Complete Task clicked for record:", record);
    navigate(`/take-task/${record?.task_id}`, {
      state: {
        fromTheoryVideos: true,
        isDailyTask: true,
        taskId: record?.task_id,
      },
    });
  };

  const videoColumns: TableProps<Video>["columns"] = [
    {
      title: "Video Title",
      dataIndex: "title",
      key: "title",
    },
    // {
    //   title: "Type",
    //   dataIndex: "task_type",
    //   key: "type",
    //   render: (type) => (
    //     <Tag color={type === "theory" ? "purple" : "geekblue"}>
    //       {type === "theory" ? "Theory" : "Lab Video"}
    //     </Tag>
    //   ),
    // },
    {
      title: "Completed",
      dataIndex: "is_video_watched",
      key: "is_video_watched",
      render: (watched) => (
        <Tag color={watched ? "green" : "red"}>{watched ? "Yes" : "No"}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const text = status?.replace("_", " ");
        return <Tag color="blue">{text}</Tag>;
      },
    },
    {
      title: "Action",
      key: "video_action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<SiGoogledisplayandvideo360 />}
            disabled={!record.is_video_unlocked}
            onClick={() => handleWatchVideo(record)}
          >
            Watch
          </Button>
          {record.is_video_watched && (
            <Button
              onClick={() => handleAssignedVideoTask(record)}
              disabled={!record.is_task_enabled}
              icon={<GiProgression />}
              type="primary"
            >
              Complete Task
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* <VideoPlayer
        videoUrl="https://www.w3schools.com/html/mov_bbb.mp4"
        title="Theory Video 1"
        onComplete={null}
      /> */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
        <h1 className="text-2xl font-bold">Learning Videos</h1>
        <p className="opacity-90">
          Access theory and lab videos to enhance your learning.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <Tabs
          defaultActiveKey="all"
          items={[
            {
              label: "Theory Videos",
              key: "theory",
              children: (
                <Table
                  title={() => (
                    <Tag
                      color={
                        isTheoryVideosCompleted?.theory_completed
                          ? "green"
                          : "red"
                      }
                    >
                      {isTheoryVideosCompleted?.theory_completed
                        ? "Theory Videos Completed - Lab Videos Unlocked"
                        : "Please complete all theory videos to unlock lab videos"}
                    </Tag>
                  )}
                  dataSource={videos}
                  columns={videoColumns}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                />
              ),
            },
            {
              label: "Lab Videos",
              disabled: !isTheoryVideosCompleted?.theory_completed,
              // disabled: false,
              key: "lab",
              children: <LabVideos />,
            },
          ]}
        />
      </div>
    </div>
  );
}

export default StudentVideos;
