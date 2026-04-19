import React, { useEffect } from "react";
import { Alert, Empty, Skeleton } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";
import useHttp from "@/hooks/use-http";
import DailyTaskReviewPage from "./DailyTaskReviewPage";

const StudentDailyTaskReview = () => {
  const { state } = useLocation();
  const { dts_id, mts_id } = useParams();
  const { sendRequest } = useHttp({ type: "auth" });

  const isMockReview = !!mts_id;
  const reviewId = mts_id || dts_id;

  const reviewCall = useMutation({
    mutationFn: () =>
      sendRequest({
        url: isMockReview ? "mockTestReview" : "dailyTaskReview",
        method: "GET",
        endURL: `${reviewId}/review`,
      }),
  });

  useEffect(() => {
    if (reviewId) {
      reviewCall.mutate();
    }
  }, [reviewId]);

  // ✅ Invalid id
  if (!reviewId) {
    return (
      <div className="p-6">
        <Alert
          type="warning"
          showIcon
          message="Invalid review request"
          description="No review id provided."
        />
      </div>
    );
  }

  // ✅ Loading
  if (reviewCall.isPending) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto w-full max-w-[1600px]">
          <Skeleton active paragraph={{ rows: 12 }} />
        </div>
      </div>
    );
  }

  // ✅ Error
  if (reviewCall.isError) {
    return (
      <div className="p-6">
        <Alert
          type="error"
          showIcon
          message="Failed to load review"
          description="Please try again after some time."
        />
      </div>
    );
  }
  console.log("Review Call Data:", reviewCall);

  const reviewData =
    reviewCall.data?.response || reviewCall.data?.data || reviewCall.data;

  if (!reviewData) {
    return (
      <div className="p-6">
        <Empty description="No review data available" />
      </div>
    );
  }

  // ✅ Decide which page to render
  // if (isMockReview) {
  //   return <DailyTaskReviewPage reviewData={reviewData} />;
  // }

  return <DailyTaskReviewPage reviewData={reviewData} />;
};

export default StudentDailyTaskReview;
