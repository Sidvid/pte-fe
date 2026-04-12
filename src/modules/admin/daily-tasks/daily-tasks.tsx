import RibbonCard from "@/components/molecules/card/RibbonCard";
import useHttp from "@/hooks/use-http";
import {
  QuestionToSectionMap,
  SectionTagColor,
  SectionTypeTitle,
} from "@/utils/constants/app-constants";
import { SuccessResponse } from "@/utils/model/model";
import { DailyTasksResponse, Task } from "@/utils/model/response-models";
import { useMutation } from "@tanstack/react-query";
import { Table, TableProps, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function DailyTasks() {
  const [dailyTasks, setDailyTasks] = useState<DailyTasksResponse["tasks"]>();
  const { sendRequest } = useHttp({ type: "auth" });
  const navigation = useNavigate();
  const allTasksCall = useMutation({
    mutationFn: () =>
      sendRequest({ url: "allDailyTask", method: "GET" }) as Promise<
        SuccessResponse<DailyTasksResponse>
      >,
    onSuccess: (data: SuccessResponse<DailyTasksResponse>) => {
      const { response } = data;
      console.log("all task", response?.data?.tasks);
      setDailyTasks(response?.data?.tasks);
    },
  });
  useEffect(() => {
    allTasksCall.mutateAsync();
  }, []);
  const columns: TableProps<Task>["columns"] = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, data) => (
        <a
          onClick={() =>
            navigation(`${text}`, {
              state: {
                ...data,
                questionType: data.question_type,
              },
            })
          }
          href=""
        >
          {text}
        </a>
      ),
    },
    {
      title: "Section",
      dataIndex: "title",
      key: "title",
      render: (_, { title }) => {
        const value = SectionTypeTitle[QuestionToSectionMap[title]];
        console.log("->", SectionTagColor);

        return value ? (
          <Tag variant="outlined" color={SectionTagColor[value]}>
            {value}
          </Tag>
        ) : (
          <p>-</p>
        );
      },
    },
    {
      title: "Question Type",
      dataIndex: "question_type",
      key: "q_type",
    },
    {
      title: "Length",
      dataIndex: "length",
      key: "length",
    },
    {
      title: "Time",
      dataIndex: "duration",
      key: "duration",
      render: (text) => <p>{`${text} min`}</p>,
    },
    {
      title: "Total",
      dataIndex: "count",
      key: "count",
    },
  ];
  return (
    <RibbonCard title={"Daily Tasks"} className="w-full">
      <Table<Task> dataSource={dailyTasks} columns={columns} />
    </RibbonCard>
  );
}

export default DailyTasks;
