import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Form,
  Card,
  Radio,
  Checkbox, // Import Checkbox
  Typography,
  Divider,
  message,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { AiOutlineInfoCircle, AiOutlineUndo } from "react-icons/ai";
import { QuestionMappingType } from "@/utils/constants/app-constants";

const { TextArea } = Input;
const { Title, Text } = Typography;

interface OptionItem {
  value: string;
}

interface FormData {
  paragraph?: string;
  question: string;
  options: OptionItem[];
  correctAnswerIndices: number[]; // Changed to array to support multiple
}

interface MultipleChoiceSingleAnswerProps {
  questionType: QuestionMappingType; // "MC_SINGLE" | "MC_MULTIPLE"
}

const MultipleChoiceSingleAnswer = ({
  questionType = "MC_MULTIPLE",
}: MultipleChoiceSingleAnswerProps) => {
  const [form] = Form.useForm();

  // We keep track of selected indices in state for UI updates
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  // Reset selection when question type changes
  useEffect(() => {
    setSelectedIndices([]);
    form.setFieldValue("correctAnswerIndices", []);
  }, [questionType, form]);

  const handleSelection = (index: number) => {
    let newSelection: number[] = [];

    if (questionType === "MC_SINGLE") {
      // Single: Replace entire array with just this index
      newSelection = [index];
    } else {
      // Multiple: Toggle logic
      if (selectedIndices.includes(index)) {
        newSelection = selectedIndices.filter((i) => i !== index);
      } else {
        newSelection = [...selectedIndices, index];
      }
    }

    setSelectedIndices(newSelection);
    // Sync with Ant Design Form for validation
    form.setFieldValue("correctAnswerIndices", newSelection);
  };

  const onFinish = (values: FormData) => {
    if (!values.options || values.options.length < 2) {
      message.error("Please provide at least 2 options.");
      return;
    }
    if (
      !values.correctAnswerIndices ||
      values.correctAnswerIndices.length === 0
    ) {
      message.error("Please select the correct answer(s).");
      return;
    }

    // Map indices to actual string values
    const correctAnswers = values.correctAnswerIndices.map(
      (index) => values.options[index].value
    );

    const payload = {
      ...values,
      correctAnswers: correctAnswers, // Returns an array of answers
    };

    console.log("Payload for Backend:", payload);
    message.success("Question created successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 text-center">
          <Text type="secondary">
            Create new{" "}
            {questionType === "MC_MULTIPLE"
              ? "multiple choice (multi-select)"
              : "multiple choice (single-select)"}{" "}
            question.
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            options: [{ value: "" }, { value: "" }],
            correctAnswerIndices: [],
          }}
        >
          <div className="flex flex-col gap-[20px] justify-center items-center">
            {/* Section 1: Question */}
            <Card className="shadow-sm w-[90%] m-auto rounded-xl mb-6 border-gray-200">
              <Title level={4}>1. Context & Question</Title>
              <Divider className="my-4" />

              <Form.Item label="Paragraph" name="paragraph">
                <TextArea
                  placeholder="Enter context or paragraph..."
                  rows={4}
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label="Question Text"
                name="question"
                rules={[
                  { required: true, message: "Please input the question" },
                ]}
              >
                <TextArea
                  placeholder="Enter the question here..."
                  rows={4}
                  className="text-lg font-medium rounded-lg"
                />
              </Form.Item>
            </Card>

            {/* Section 2: Options */}
            <Card className="shadow-sm rounded-xl w-[90%] m-auto mb-6 border-gray-200">
              <div className="flex gap-3 items-center mb-4">
                <Title level={4} style={{ margin: 0 }}>
                  2. Options & Answer
                </Title>
                <div className="flex flex-row gap-2 mt-2">
                  <Tooltip
                    title={
                      questionType === "MC_MULTIPLE"
                        ? "Select one or more checkboxes."
                        : "Select one radio button."
                    }
                  >
                    <span>
                      <AiOutlineInfoCircle className="text-gray-400 cursor-pointer" />
                    </span>
                  </Tooltip>
                </div>
              </div>

              {/* Hidden field to handle validation of "Selection" */}
              <Form.Item
                name="correctAnswerIndices"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one correct answer",
                  },
                ]}
                className="hidden" // Visually hidden, but exists for validation
              >
                <Input />
              </Form.Item>

              <Form.List name="options">
                {(fields, { add, remove }) => (
                  <div className="flex flex-col gap-4">
                    {fields.map((field, index) => {
                      const isSelected = selectedIndices.includes(index);

                      return (
                        <div
                          key={field.key}
                          className={`
                            rounded-xl px-4 transition-all duration-300 cursor-pointer
                            ${
                              isSelected
                                ? "p-[3px] bg-gradient-to-r  from-green-400 via-emerald-500 to-teal-500  bg-[length:200%_200%] animate-gradient-border shadow-[0_0_30px_rgba(16,185,129,0.65)]"
                                : "p-[1px] border border-gray-200 hover:border-blue-300"
                            }
                          `}
                          // Clicking the container toggles selection for better UX
                          onClick={() => handleSelection(index)}
                        >
                          <div className="bg-white rounded-[9px] p-3 flex items-center w-full h-full">
                            {/* Render Checkbox OR Radio based on Prop */}
                            <div
                              className="mr-3"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {questionType === "MC_MULTIPLE" ? (
                                <Checkbox
                                  checked={isSelected}
                                  onChange={() => handleSelection(index)}
                                >
                                  {isSelected ? (
                                    <span className="font-bold text-emerald-600">
                                      Correct
                                    </span>
                                  ) : (
                                    <span className="text-gray-400">
                                      Option {index + 1}
                                    </span>
                                  )}
                                </Checkbox>
                              ) : (
                                <Radio
                                  checked={isSelected}
                                  onChange={() => handleSelection(index)}
                                >
                                  {isSelected ? (
                                    <span className="font-bold text-emerald-600">
                                      Correct
                                    </span>
                                  ) : (
                                    <span className="text-gray-400">
                                      Option {index + 1}
                                    </span>
                                  )}
                                </Radio>
                              )}
                            </div>

                            <Form.Item
                              {...field}
                              name={[field.name, "value"]}
                              rules={[{ required: true, message: "Required" }]}
                              noStyle
                            >
                              <Input
                                placeholder={`Type option ${index + 1}`}
                                variant="borderless"
                                className="flex-1 font-medium text-gray-700"
                                onClick={(e) => e.stopPropagation()} // Stop propagation so clicking input doesn't toggle selection
                              />
                            </Form.Item>

                            {isSelected && (
                              <CheckCircleFilled className="text-emerald-500 text-xl ml-4 animate-bounce" />
                            )}

                            {fields.length > 1 && !isSelected && (
                              <Tooltip title="Remove Option">
                                <Button
                                  type="text"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    remove(field.name);
                                    // Clean up selection if removed
                                    const newIndices = selectedIndices
                                      .filter((i) => i !== index)
                                      .map((i) => (i > index ? i - 1 : i));
                                    setSelectedIndices(newIndices);
                                    form.setFieldValue(
                                      "correctAnswerIndices",
                                      newIndices
                                    );
                                  }}
                                  className="ml-2 text-gray-400 hover:text-red-500"
                                />
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      className="mt-4 border-gray-300 text-gray-500 hover:text-blue-500 hover:border-blue-500"
                    >
                      Add Another Option
                    </Button>
                    <div className="flex gap-4 my-6">
                      <Button
                        className="flex-1"
                        type="dashed"
                        danger
                        onClick={() => {
                          form.resetFields();
                          setSelectedIndices([]);
                        }}
                        icon={<AiOutlineUndo />}
                      >
                        Reset
                      </Button>
                      <Button
                        className="flex-1"
                        type="primary"
                        htmlType="submit"
                      >
                        Create Question
                      </Button>
                    </div>
                  </div>
                )}
              </Form.List>
            </Card>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default MultipleChoiceSingleAnswer;
