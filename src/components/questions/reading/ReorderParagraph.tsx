import React, { useState } from "react";
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="paragraphs">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                background: snapshot.isDraggingOver ? "#e6f7ff" : "transparent",
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
                        ...provided.draggableProps.style,
                      }}
                    >
                      <Space align="start">
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
    </QuestionLayout>
  );
};

export default ReorderParagraphs;
