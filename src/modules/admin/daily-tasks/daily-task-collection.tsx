import RibbonCard from "@/components/molecules/card/RibbonCard";
import useHttp from "@/hooks/use-http";
import {
  QuestionToSectionMap,
  SectionTypeTitle,
} from "@/utils/constants/app-constants";
import { SuccessResponse } from "@/utils/model/model";
import {
  Collection,
  DailyTasksResponse,
  Task,
} from "@/utils/model/response-models";
import { useMutation } from "@tanstack/react-query";
import { Switch, Table, TableProps, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";

function DailyTasksCollection() {
  const [collection, setCollection] = useState<Collection[]>();
  const { sendRequest } = useHttp({ type: "auth" });
  const navigation = useNavigate();
  const { state } = useLocation();
  console.log("RRRR");
  const allTasksCall = useMutation({
    mutationFn: (payload) =>
      sendRequest({
        url: "allDailyTask",
        method: "GET",
        endURL: payload!,
      }) as Promise<SuccessResponse<Collection[]>>,
    onSuccess: (data: SuccessResponse<Collection[]>) => {
      const { response } = data;
      console.log("all task", response?.data);
      setCollection(response?.data);
    },
  });
  useEffect(() => {
    if (state.id) {
      allTasksCall.mutateAsync(state.id);
    }
  }, [state.id]);
  const columns: TableProps<Collection>["columns"] = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, { id, index, ...rest }) => (
        <p
          onClick={() =>
            navigation(`/view-single-collection-questions/${id}`, {
              state: { ...rest, id, index, title: text },
            })
          }
          style={{ cursor: "pointer", color: "#1890ff" }}
        >
          {`${text}-${index}`}
        </p>
      ),
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
      title: "Status",
      dataIndex: "count",
      key: "count",
      render: (_, { published }) => <Switch checked={published} />,
    },
  ];
  return (
    <RibbonCard title={"Daily Tasks Collection"} className="w-full">
      <Table<Collection> dataSource={collection} columns={columns} />
    </RibbonCard>
  );
}

export default DailyTasksCollection;
