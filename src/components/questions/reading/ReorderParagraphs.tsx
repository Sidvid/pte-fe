import React, { useEffect, useState } from "react";
import { Card, Space, Typography } from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { HolderOutlined } from "@ant-design/icons";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../../../hooks/useQuestionTimer";

const { Text } = Typography;

const ReorderParagraphs = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
  timeLimit = 120,
  isOnlyViewQuestions,
}) => {
  const [items, setItems] = useState(
    question.data?.sentences?.map((text, index) => ({
      id: `item-${index}`,
      text,
      originalIndex: index,
    })) || [],
  );

  const timer = useQuestionTimer(timeLimit, () => {
    onResponse?.({
      inputs: items.map((item) => item.text),
    });
  });

  useEffect(() => {
    timer.start();
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updated = Array.from(items);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);

    setItems(updated);
    onResponse?.({
      type: "inputs",
      inputs: updated.map((item) => item.text),
    });
  };

  return (
    <QuestionLayout
      type="ro"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      timeRemaining={timer.formatTime()}
      isOnlyViewQuestions={isOnlyViewQuestions}
      instructions="The text boxes below have been placed in random order. Restore the original order by dragging the text boxes."
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="paragraphs">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                background: snapshot.isDraggingOver ? "#f0f5ff" : "transparent",
                padding: 8,
                borderRadius: 8,
                minHeight: 300,
              }}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        marginBottom: 12,
                        border: snapshot.isDragging
                          ? "2px solid #1890ff"
                          : "1px solid #d9d9d9",
                        background: snapshot.isDragging ? "#e6f7ff" : "#fff",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <Space align="start">
                        <div {...provided.dragHandleProps}>
                          <HolderOutlined
                            style={{
                              fontSize: 20,
                              color: "#999",
                              cursor: "grab",
                            }}
                          />
                        </div>
                        <Text style={{ fontSize: 15 }}>{item.text}</Text>
                      </Space>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </QuestionLayout>
  );
};

export default ReorderParagraphs;
