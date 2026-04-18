import RibbonCard from "@/components/molecules/card/RibbonCard";
import useHttp from "@/hooks/use-http";
import { Student } from "@/utils/model/response-models";
import { useMutation } from "@tanstack/react-query";
import { Button, Table, TableProps, Tag } from "antd";
import React from "react";
import { FaUserEdit, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const StudentList = () => {
  const { sendRequest } = useHttp({ type: "auth" });
  const [dataPagination, setDataPagination] = React.useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [studentData, setStudentsData] = React.useState<Student[]>();
  const navigate = useNavigate();

  const allStudents = useMutation({
    mutationFn: () =>
      sendRequest({
        url: "getAllStudents",
        method: "GET",
        params: {
          page: dataPagination.page,
          limit: dataPagination.limit,
        },
      }),
    onSuccess: (data) => {
      const response = data?.response?.data;

      setStudentsData(response?.students || []);

      setDataPagination((prev) => ({
        ...prev,
        total: response?.pagination?.totalCount || 0,
      }));
    },
  });

  React.useEffect(() => {
    allStudents.mutateAsync();
  }, [dataPagination.page, dataPagination.limit]);

  const handleEditStudent = (studentId: string) => {
    navigate(`/admin/student/${studentId}/edit`);
  };

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
        <Tag variant="outlined" color={exam_mode ? "blue" : "red"}>
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
            onClick={() => handleEditStudent(record.id)}
          />
        );
      },
    },
  ];

  return (
    <RibbonCard
      title="Student List"
      extra={
        <Button
          onClick={() => navigate("/add-student")}
          icon={<FaUserPlus />}
          type="primary"
        >
          Add Student
        </Button>
      }
    >
      {/* <Table bordered rowKey="id" columns={columns} dataSource={studentData} /> */}
      <Table
        bordered
        rowKey="id"
        columns={columns}
        dataSource={studentData}
        loading={allStudents.isPending}
        pagination={{
          current: dataPagination.page,
          pageSize: dataPagination.limit,
          total: dataPagination.total,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
        onChange={(pagination) => {
          setDataPagination((prev) => ({
            ...prev,
            page: pagination.current ?? prev.page,
            limit: pagination.pageSize ?? prev.limit,
          }));
        }}
      />
    </RibbonCard>
  );
};
export default StudentList;
