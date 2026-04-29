import React, { useState, useEffect } from "react";
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
  const [items, setItems] = useState([]);

  // 1. Sync state whenever the question changes
  useEffect(() => {
    console.log("Reorder Question Data Received:", question?.data);
    alert("hi");

    // ADJUST THIS KEY if your DB column uses something else (e.g., 'paragraphs')
    const sentences = question?.data?.sentences || [];

    if (sentences.length > 0) {
      setItems(
        sentences.map((text, index) => ({
          id: `item-${index}`,
          text,
        })),
      );
    } else {
      setItems([]);
    }
  }, [question]);

  const timer = useQuestionTimer(timeLimit, () => {
    onResponse?.({ inputs: items.map((item) => item.text) });
  });

  React.useEffect(() => {
    timer.start();
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
    onResponse?.({ inputs: newItems.map((item) => item.text) });
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
      {items.length > 0 ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="paragraphs">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  background: snapshot.isDraggingOver
                    ? "#e6f7ff"
                    : "transparent",
                  padding: "8px",
                  borderRadius: "8px",
                  minHeight: "400px",
                }}
              >
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          marginBottom: "12px",
                          background: snapshot.isDragging ? "#fff7e6" : "#fff",
                          border: snapshot.isDragging
                            ? "2px solid #ffa940"
                            : "1px solid #d9d9d9",
                        }}
                      >
                        <Space align="start" size={12}>
                          <div {...provided.dragHandleProps}>
                            <HolderOutlined
                              style={{
                                fontSize: "20px",
                                color: "#999",
                                cursor: "grab",
                              }}
                            />
                          </div>
                          <Text style={{ fontSize: "15px" }}>{item.text}</Text>
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
      ) : (
        <div style={{ textAlign: "center", padding: "50px", color: "#999" }}>
          No text content available for this question.
        </div>
      )}
    </QuestionLayout>
  );
};

export default ReorderParagraphs;
