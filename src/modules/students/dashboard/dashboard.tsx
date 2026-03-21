// import Card from "@/modules/common/cards/take-a-test";
import React, { useState } from "react";
import useHttp from "@/hooks/use-http";
import ScoreReportCard from "@/modules/common/misc/analytics";
import { SuccessResponse } from "@/utils/model/model";
import {
  MockTest,
  MockTestResponse,
  RequestAssignmentResponse,
} from "@/utils/model/response-models";
import { useMutation } from "@tanstack/react-query";
import { Button, Card, Col, Row, Typography } from "antd";
import { useNavigate } from "react-router";
import dashboard from "@/modules/admin/dashboard/dashboard";
import { FaPlay } from "react-icons/fa";

function Dashboard() {
  const [requestedAssignment, setRequestedAssignment] = useState<any[]>();
  const navigate = useNavigate();
  const { sendRequest } = useHttp({ type: "auth" });
  // const navigation = useNavigate();
  const allAssignedTasks = useMutation({
    mutationFn: () =>
      sendRequest({ url: "requestAssignments", method: "GET" }) as Promise<
        SuccessResponse<RequestAssignmentResponse>
      >,
    onSuccess: (data: SuccessResponse<RequestAssignmentResponse>) => {
      const { response } = data;
      console.log("assigned tasks", response);
      setRequestedAssignment(response?.data);
    },
  });
  React.useEffect(() => {
    allAssignedTasks.mutateAsync();
  }, []);
  console.log("dailyTasks", requestedAssignment);
  return (
    <>
      {/* <Card /> */}
      {/* //<ScoreReportCard />// */}
      <Typography.Title level={3} style={{ marginBottom: "20px" }}>
        Assigned Tasks
      </Typography.Title>
      <Row gutter={[12, 12]}>
        {requestedAssignment?.map((item: any) => (
          <Col
            key={item.assigned_task_id}
            xl={8}
            lg={12}
            md={24}
            sm={24}
            xs={24}
          >
            <Card
              title={item.collection}
              extra={
                <Button icon={<FaPlay />} type="primary">
                  Start
                </Button>
              }
            >
              <p>{item.type}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default Dashboard;
