import * as React from "react";
import useHttp from "@/hooks/use-http";
import { SuccessResponse } from "@/utils/model/model";
import { useMutation } from "@tanstack/react-query";

function LabVideos() {
  const { sendRequest } = useHttp({ type: "auth" });
  const [labVideosData, setLabVideosData] = React.useState<any>();
  // const navigation = useNavigate();
  const allMockTests = useMutation({
    mutationFn: () =>
      sendRequest({
        url: "theoryVideosCompletionStatus",
        method: "GET",
      }) as Promise<SuccessResponse<any>>,
    onSuccess: (data: SuccessResponse<any>) => {
      const { response } = data;
      console.log("response --- statuss----", response);
      setLabVideosData(response);
      // setMockTests(response?.data?.tests);
    },
  });
  React.useEffect(() => {
    allMockTests.mutateAsync();
  }, []);
  console.log("labbbb", labVideosData?.data?.theory_completed);
  if (!labVideosData?.data?.theory_completed) {
    return (
      <div>
        <h2>Theory Videos Incomplete</h2>
        <p>
          Please complete all theory videos to unlock the lab videos section.
        </p>
      </div>
    );
  }

  return <>LabVideos</>;
}

export default LabVideos;
