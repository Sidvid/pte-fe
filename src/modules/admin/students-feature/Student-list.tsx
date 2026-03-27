import useHttp from "@/hooks/use-http";
import { SuccessResponse } from "@/utils/model/model";
import { Student } from "@/utils/model/response-models";
import { useMutation } from "@tanstack/react-query";
import { Button, Card, Table, TableProps, Tag } from "antd";
import React from "react";
import { FaUserEdit } from "react-icons/fa";

const StudentList = () => {
  const { sendRequest } = useHttp({ type: "auth" });
  const [studentData, setStudentsData] = React.useState<Student[]>();
  const allStudents = useMutation({
    mutationFn: () =>
      sendRequest({ url: "getAllStudents", method: "GET" }) as Promise<
        SuccessResponse<Student>
      >,
    onSuccess: (data: SuccessResponse<any>) => {
      const { response } = data;
      console.log("student data", response);
      setStudentsData(response?.data?.students);
    },
  });
  React.useEffect(() => {
    allStudents.mutateAsync();
  }, []);

  const columns: TableProps<Student>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Phone",
      dataIndex: "phone1",
    },
    {
      title: "Subscription Start Date",
      dataIndex: "sub_start",
      align: "center",
      render: (sub_start) => {
        return sub_start ? new Date(sub_start).toLocaleDateString() : "-";
      },
    },
    {
      title: "Subscription End Date",
      dataIndex: "sub_end",
      align: "center",
      render: (sub_end) => {
        return sub_end ? new Date(sub_end).toLocaleDateString() : "-";
      },
    },
    {
      title: "Exam Mode",
      dataIndex: "exam_mode",
      render: (exam_mode) => (
        <Tag color={exam_mode ? "blue" : "red"}>
          {exam_mode ? "Enabled" : "Disabled"}
        </Tag>
      ),
    },
    {
      title: "Action",
      dataIndex: "id",
      align: "center",
      render: (_, record) => {
        return (
          <Button
            icon={<FaUserEdit />}
            size="large"
            type="link"
            onClick={undefined}
          />
        );
      },
    },
  ];

  return (
    <Card title="Student List">
      <Table bordered columns={columns} dataSource={studentData} />
    </Card>
  );
};

export default StudentList;
