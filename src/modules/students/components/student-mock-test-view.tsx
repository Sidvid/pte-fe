import { useEffect, useState } from "react";
import { Alert, Skeleton, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useHttp from "@/hooks/use-http";
import MockTestIntroPage from "@/pte-test-players/mock-test-components/MockTestIntroPage";
import MockTestExamPage from "@/pte-test-players/mock-test-components/MockTestExamPage";

const StudentMockTestView = () => {
  const { id: test_id } = useParams();
  console.log("fdfdfdfdf", test_id);
  const { sendRequest } = useHttp({ type: "auth" });

  const [showExam, setShowExam] = useState(false);
  const [mtsId, setMtsId] = useState<string | null>(null);

  // --------------------------------
  // Fetch mock test by id
  // --------------------------------
  const getMockTestCall = useMutation({
    mutationFn: () =>
      sendRequest({
        url: "getMockTestById",
        method: "GET",
        endURL: test_id,
      }),
    onError: (err: any) => {
      console.error(err);
      message.error(err?.message || "Failed to load mock test");
    },
  });

  // --------------------------------
  // Start mock test
  // --------------------------------
  const startMockTestCall = useMutation({
    mutationFn: () =>
      sendRequest({
        url: "startMockTest",
        method: "POST",
        endURL: `${test_id}/start`,
      }),
    onSuccess: (data: any) => {
      const mts_id =
        data?.response?.mts_id ||
        data?.response?.data?.mts_id ||
        data?.data?.mts_id ||
        data?.mts_id;

      if (!mts_id) {
        message.error("Mock test started but mts_id not received");
        return;
      }

      localStorage.setItem("current_mts_id", mts_id);
      setMtsId(mts_id);
      setShowExam(true);
    },
    onError: (err: any) => {
      console.error(err);
      message.error(err?.message || "Failed to start mock test");
    },
  });

  useEffect(() => {
    if (!test_id) return;
    getMockTestCall.mutate();
  }, [test_id]);

  const mockTestResponse =
    getMockTestCall.data?.response ||
    getMockTestCall.data?.data ||
    getMockTestCall.data;

  const handleStartMockProceed = async () => {
    try {
      await startMockTestCall.mutateAsync();
    } catch (err: any) {
      console.error(err);
      message.error(err?.message || "Unable to proceed with mock test");
    }
  };

  if (!test_id) {
    return (
      <div className="p-6">
        <Alert
          type="warning"
          showIcon
          message="Invalid mock test id"
          description="No mock test id found in route."
        />
      </div>
    );
  }

  if (getMockTestCall.isPending) {
    return (
      <div className="p-6">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (getMockTestCall.isError || !mockTestResponse?.data) {
    return (
      <div className="p-6">
        <Alert
          type="error"
          showIcon
          message="Failed to load mock test"
          description="Mock test data could not be loaded."
        />
      </div>
    );
  }

  // Step 1: show intro page
  if (!showExam) {
    return (
      <MockTestIntroPage
        testData={mockTestResponse.data}
        onProceed={handleStartMockProceed}
        loading={startMockTestCall.isPending}
      />
    );
  }

  // Step 2: show exam page
  return (
    <MockTestExamPage
      mockTestResponse={mockTestResponse}
      mtsId={localStorage.getItem("current_mts_id") || mtsId || ""}
      existingSectionAttempts={[]}
      existingResponsesByMtssId={{}}
    />
  );
};

export default StudentMockTestView;
