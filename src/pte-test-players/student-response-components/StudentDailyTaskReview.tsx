import React, { useEffect } from "react";
import { Alert, Empty, Skeleton } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useHttp from "@/hooks/use-http";
import DailyTaskReviewPage from "./DailyTaskReviewPage";

const StudentDailyTaskReview = () => {
  const { dts_id } = useParams();
  const { sendRequest } = useHttp({ type: "auth" });

  const reviewCall = useMutation({
    mutationFn: () =>
      sendRequest({
        url: "dailyTaskReview",
        method: "GET",
        endURL: `${dts_id}/review`,
      }),
  });

  useEffect(() => {
    if (dts_id) {
      reviewCall.mutate();
    }
  }, [dts_id]);

  if (!dts_id) {
    return (
      <div className="p-6">
        <Alert
          type="warning"
          showIcon
          message="Invalid daily task review request"
          description="No daily task id provided."
        />
      </div>
    );
  }

  if (reviewCall.isPending) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto w-full max-w-[1600px]">
          <Skeleton active paragraph={{ rows: 12 }} />
        </div>
      </div>
    );
  }

  if (reviewCall.isError) {
    return (
      <div className="p-6">
        <Alert
          type="error"
          showIcon
          message="Failed to load daily task review"
          description="Please try again after some time."
        />
      </div>
    );
  }

  const reviewData =
    reviewCall.data?.response || reviewCall.data?.data || reviewCall.data;

  if (!reviewData) {
    return (
      <div className="p-6">
        <Empty description="No review data available" />
      </div>
    );
  }

  return <DailyTaskReviewPage reviewData={reviewData} />;
};

export default StudentDailyTaskReview;
