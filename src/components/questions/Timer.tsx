import React from "react";
import { Tag } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

const Timer = ({ time, isWarning = false }) => {
  return (
    <Tag
      icon={<ClockCircleOutlined />}
      color={isWarning ? "red" : "blue"}
      style={{ fontSize: "16px", padding: "4px 12px" }}
    >
      {time}
    </Tag>
  );
};

export default Timer;
