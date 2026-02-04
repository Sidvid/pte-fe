import useHttp from "@/hooks/use-http";
import { useMutation } from "@tanstack/react-query";
import { Table, TableProps, Tag, Button, Space, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface Video {
  id: string;
  title: string;
  type: "theory" | "lab";
  duration: string;
}

function StudentVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const { sendRequest } = useHttp({ type: "auth" });
  const navigate = useNavigate();

  const fetchVideos = useMutation({
    mutationFn: () => 
      sendRequest({ url: "allDailyTask", method: "GET" }) as Promise<any>,
    onSuccess: (data) => {
      if (data?.response?.data && Array.isArray(data.response.data)) {
        const allItems: any[] = data.response.data;
        const videoItems = allItems.filter((item: any) => 
          item.title?.toLowerCase().includes('video') || 
          item.type?.toLowerCase().includes('video') ||
          item.category === 'video'
        );
        
        if (videoItems.length > 0) {
          const transformedVideos = videoItems.map((item: any, index: number) => {
            let videoType: "theory" | "lab" = "theory";
            if (item.type === 'lab' || item.category === 'lab' || item.title?.toLowerCase().includes('lab')) {
              videoType = 'lab';
            }
            
            return {
              id: item.id || `vid${index + 1}`,
              title: item.title || `Video ${index + 1}`,
              type: videoType,
              duration: item.duration || '10:00'
            };
          });
          setVideos(transformedVideos);
        } else {
          setVideos([
            { id: "vid1", title: "Theory: Reading Strategies", type: "theory", duration: "25:30" },
            { id: "vid2", title: "Lab: Speaking Practice", type: "lab", duration: "18:45" },
            { id: "vid3", title: "Theory: Writing Techniques", type: "theory", duration: "32:15" },
            { id: "vid4", title: "Lab: Listening Skills", type: "lab", duration: "20:10" },
            { id: "vid5", title: "Theory: Overview of PTE Exam", type: "theory", duration: "15:20" },
            { id: "vid6", title: "Lab: Pronunciation Tips", type: "lab", duration: "22:30" },
          ]);
        }
      } else {
        setVideos([
          { id: "vid1", title: "Theory: Reading Strategies", type: "theory", duration: "25:30" },
          { id: "vid2", title: "Lab: Speaking Practice", type: "lab", duration: "18:45" },
          { id: "vid3", title: "Theory: Writing Techniques", type: "theory", duration: "32:15" },
          { id: "vid4", title: "Lab: Listening Skills", type: "lab", duration: "20:10" },
          { id: "vid5", title: "Theory: Overview of PTE Exam", type: "theory", duration: "15:20" },
          { id: "vid6", title: "Lab: Pronunciation Tips", type: "lab", duration: "22:30" },
        ]);
      }
    },
    onError: (error) => {
      console.error("Error fetching videos:", error);
      setVideos([
        { id: "vid1", title: "Theory: Reading Strategies", type: "theory", duration: "25:30" },
        { id: "vid2", title: "Lab: Speaking Practice", type: "lab", duration: "18:45" },
        { id: "vid3", title: "Theory: Writing Techniques", type: "theory", duration: "32:15" },
        { id: "vid4", title: "Lab: Listening Skills", type: "lab", duration: "20:10" },
        { id: "vid5", title: "Theory: Overview of PTE Exam", type: "theory", duration: "15:20" },
        { id: "vid6", title: "Lab: Pronunciation Tips", type: "lab", duration: "22:30" },
      ]);
    }
  });

  useEffect(() => {
    fetchVideos.mutate();
  }, []);

  const handleWatchVideo = (videoId: string) => {
    navigate(`/video/${videoId}`);
  };

  const theoryVideos = videos.filter(video => video.type === "theory");
  const labVideos = videos.filter(video => video.type === "lab");

  const videoColumns: TableProps<Video>["columns"] = [
    {
      title: "Video Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "theory" ? "purple" : "geekblue"}>
          {type === "theory" ? "Theory" : "Lab Video"}
        </Tag>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Action",
      key: "video_action",
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            onClick={() => handleWatchVideo(record.id)}
          >
            Watch
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-6">
        <h1 className="text-2xl font-bold">Learning Videos</h1>
        <p className="opacity-90">Access theory and lab videos to enhance your learning.</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <Tabs 
          defaultActiveKey="all" 
          items={[
            {
              label: 'All Videos',
              key: 'all',
              children: (
                <Table 
                  dataSource={videos} 
                  columns={videoColumns} 
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                />
              ),
            },
            {
              label: 'Theory Videos',
              key: 'theory',
              children: (
                <Table 
                  dataSource={theoryVideos} 
                  columns={videoColumns} 
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                />
              ),
            },
            {
              label: 'Lab Videos',
              key: 'lab',
              children: (
                <Table 
                  dataSource={labVideos} 
                  columns={videoColumns} 
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}

export default StudentVideos;