import { Button } from "antd";
import React from "react";
import { DeleteOutlined, PlayCircleOutlined } from "@ant-design/icons";

interface RetellLectureProps {
  questions: any[];
  onDelete?: (id: string) => void;
}

function RetellLecture({ questions, onDelete }: RetellLectureProps) {
  const getMediaUrl = (mediaPath: string) => {
    const baseUrl = 'http://localhost:3000';
    return `${baseUrl}/${mediaPath}`;
  };

  const getMediaType = (path: string) => {
    const ext = path.split('.').pop()?.toLowerCase();
    if (['mp3', 'wav', 'm4a', 'ogg'].includes(ext || '')) return 'audio';
    if (['mp4', 'webm', 'mov'].includes(ext || '')) return 'video';
    return 'unknown';
  };

  return (
    <div className="flex flex-col gap-[20px]">
      {questions?.map((item) => {
        const itemData =
          typeof item.data === "string"
            ? JSON.parse(item.data)
            : item.data;
        
        const extraData = 
          typeof item.extra === "string"
            ? JSON.parse(item.extra)
            : item.extra;
        
        const mediaPath = itemData.audio || itemData.video || itemData.media;
        const transcript = extraData?.script || itemData.transcript || itemData.text || "";
        const mediaType = mediaPath ? getMediaType(mediaPath) : 'unknown';

        return (
          <div
            key={item.id}
            className="text-black border border-dashed border-purple-700 bg-purple-50 p-[6px] rounded-2xl f14 relative"
          >
            {onDelete && (
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete(item.id)}
                style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
                title="Delete question"
              />
            )}
            <p className="font-semibold mb-3">{`Question ${item.sNo}`}</p>
            
            {mediaPath ? (
              <div className="mb-3">
                <p className="text-gray-600 mb-2 flex items-center gap-2">
                  <PlayCircleOutlined /> Lecture {mediaType === 'video' ? 'Video' : 'Audio'}:
                </p>
                <div className="bg-white p-4 rounded-lg">
                  {mediaType === 'audio' && (
                    <audio
                      controls
                      src={getMediaUrl(mediaPath)}
                      className="w-full"
                      onError={(e) => {
                        console.error('Failed to load audio:', mediaPath);
                      }}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  )}
                  {mediaType === 'video' && (
                    <video
                      controls
                      src={getMediaUrl(mediaPath)}
                      className="w-full max-h-[400px]"
                      onError={(e) => {
                        console.error('Failed to load video:', mediaPath);
                      }}
                    >
                      Your browser does not support the video element.
                    </video>
                  )}
                  {mediaType === 'unknown' && (
                    <p className="text-red-500 text-sm">
                      ⚠️ Media file format not recognized: {mediaPath}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Media Path: {mediaPath}
                </p>
              </div>
            ) : (
              <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-700 text-sm">
                  ⚠️ No media file found for this question
                </p>
              </div>
            )}

            {transcript && (
              <div>
                <p className="text-gray-600 mb-2">Transcript/Description:</p>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {transcript}
                  </p>
                </div>
              </div>
            )}

            {!transcript && (
              <p className="text-gray-400 text-sm italic">
                No transcript provided
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default RetellLecture;
