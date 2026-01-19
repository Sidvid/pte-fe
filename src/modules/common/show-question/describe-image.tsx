import { QuestionItem } from "@/utils/model/response-models";
import React from "react";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

interface DescribeImageProps {
  questions: QuestionItem[];
  onDelete?: (questionId: string) => void;
}

function DescribeImage({ questions, onDelete }: DescribeImageProps) {
  const getImageUrl = (imagePath: string) => {
    const baseUrl = 'http://localhost:3000';
    const fullUrl = `${baseUrl}/${imagePath}`;
    return fullUrl;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, imagePath: string) => {
    const img = e.currentTarget;
    const baseUrl = 'http://localhost:3000';
    
    console.error('Image failed to load:', img.src);
    console.error('Original path:', imagePath);
    
    const currentAttempt = parseInt(img.dataset.attempt || '0');
    
    const attempts = [
      `${baseUrl}/${imagePath}.jpg`,
      `${baseUrl}/${imagePath}.png`,
      `${baseUrl}/${imagePath}.jpeg`,
      `${baseUrl}/${imagePath}.webp`,

      `${baseUrl}/api/${imagePath}`,
      `${baseUrl}/api/${imagePath}.jpg`,
      `${baseUrl}/api/${imagePath}.png`,

      `${baseUrl}/media/${imagePath}`,
      `${baseUrl}/media/${imagePath}.jpg`,
 
      `${baseUrl}/${imagePath.split('/').pop()}`,
      `${baseUrl}/${imagePath.split('/').pop()}.jpg`,
    ];
    
    if (currentAttempt < attempts.length) {
      const nextUrl = attempts[currentAttempt];
      console.log(`Attempt ${currentAttempt + 1}/${attempts.length}: Trying`, nextUrl);
      img.src = nextUrl;
      img.dataset.attempt = String(currentAttempt + 1);
      return;
    }
    
    console.error('All attempts failed for:', imagePath);
    console.error('Tried', attempts.length, 'different URLs');
    console.error('Backend needs to configure static file serving for mock-tests-media directory');
    console.error('Backend also needs to add CORS headers to allow frontend access');
    
    img.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
    
    const errorMsg = img.parentElement?.querySelector(`#error-${img.alt.split(' ')[2]}`);
    if (errorMsg) {
      errorMsg.classList.remove('hidden');
    }
  };

  return (
    <div className="flex flex-col gap-[20px]">
      {questions?.map((item) => {
        const imageData =
          typeof item.data === "string"
            ? JSON.parse(item.data)
            : item.data;
        const imagePath = imageData.image;

        return (
          <div
            key={item.id}
            className="text-black border border-dashed border-blue-700 bg-blue-50 p-[6px] rounded-2xl f14 relative"
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
            <p className="font-semibold">{`Question ${item.sNo}`}</p>
            <p className="text-gray-600 mb-2">Image:</p>
            <div className="flex justify-center items-center bg-white p-4 rounded-lg">
              {imagePath ? (
                <div className="text-center">
                  <img
                    src={getImageUrl(imagePath)}
                    alt={`Describe Image ${item.sNo}`}
                    className="max-w-full max-h-[400px] object-contain rounded"
                    onError={(e) => handleImageError(e, imagePath)}
                  />
                  <p className="text-red-500 text-xs mt-2 hidden" id={`error-${item.id}`}>
                    ⚠️ Image not accessible. Backend needs to serve static files from mock-tests-media directory.
                  </p>
                </div>
              ) : (
                <div className="text-gray-400">No image path provided</div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Image Path: {imagePath}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default DescribeImage;
