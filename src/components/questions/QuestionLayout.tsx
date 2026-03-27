import React from "react";
import { Card, Typography, Tag, Space, Divider } from "antd";
import {
  SoundOutlined,
  EditOutlined,
  ReadOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import Timer from "./Timer";
import {
  getQuestionCategory,
  getQuestionTitle,
} from "@/utils/constants/questtionTypes";

const { Title, Text } = Typography;

const categoryIcons = {
  speaking: <SoundOutlined />,
  writing: <EditOutlined />,
  reading: <ReadOutlined />,
  listening: <CustomerServiceOutlined />,
};

const categoryColors = {
  speaking: "blue",
  writing: "green",
  reading: "orange",
  listening: "purple",
};

const QuestionLayout = ({
  type,
  questionNumber,
  totalQuestions,
  timeRemaining,
  instructions,
  children,
}) => {
  const category = getQuestionCategory(type);
  const title = getQuestionTitle(type);

  return (
    <Card
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Space>
          <Tag
            icon={categoryIcons[category]}
            color={categoryColors[category]}
            style={{ fontSize: "14px", padding: "4px 8px" }}
          >
            {category.toUpperCase()}
          </Tag>
          <Title level={4} style={{ margin: 0 }}>
            {title}
          </Title>
        </Space>

        <Space>
          <Text type="secondary">
            Question {questionNumber} of {totalQuestions}
          </Text>
          {timeRemaining && (
            <Timer
              time={timeRemaining}
              isWarning={
                parseInt(timeRemaining.split(":")[0]) === 0 &&
                parseInt(timeRemaining.split(":")[1]) < 30
              }
            />
          )}
        </Space>
      </div>

      <Divider style={{ margin: "12px 0" }} />

      {/* Instructions */}
      {instructions && (
        <div
          style={{
            background: "#e6f7ff",
            padding: "12px 16px",
            borderRadius: "4px",
            marginBottom: "16px",
          }}
        >
          <Text>{instructions}</Text>
        </div>
      )}

      {/* Question Content */}
      <div style={{ minHeight: "300px" }}>{children}</div>
    </Card>
  );
};

export default QuestionLayout;
