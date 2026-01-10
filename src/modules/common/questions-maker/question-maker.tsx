import {
  QuestionMappingType,
  QuestionMapping,
} from "@/utils/constants/app-constants";
import { Button, Drawer, Form, Input, Radio } from "antd";
import React, { useMemo, useState } from "react";
import MultipleChoiceSingleAnswer from "./multiple-choice-single-answer";
import { FloatButton } from "antd";
import { FaPlusCircle } from "react-icons/fa";
import ReOrderQuestion from "./reorder-question";
import DragAndDropQuestion from "./drag-and-drop-question";
import RepeatSentence from "./repeat-sentence";
import GradientButton from "@/components/atoms/gradient-button";
import { useMutation } from "@tanstack/react-query";
import useHttp from "@/hooks/use-http";
import { useCreateQuestion } from "@/store/use-create-question";
import FillInBlankDropdown from "./fill-in-blank-drop-down";
const { TextArea } = Input;
interface QuestionMakerProps {
  typeOfQuestion: QuestionMappingType;
  children: React.ReactNode;
  taskId?: string;
}
function QuestionMaker({
  typeOfQuestion,
  children,
  taskId,
}: QuestionMakerProps) {
  const [openModal, setOpenModal] = useState(false);
  const { sendRequest } = useHttp({ type: "auth" });
  const { questionData } = useCreateQuestion();
  const whichQuestionToRender = useMemo(() => {
    switch (typeOfQuestion) {
      case QuestionMapping.MC_MULTIPLE:
        return <MultipleChoiceSingleAnswer questionType="MC_SINGLE" />;
      case QuestionMapping.MC_SINGLE:
        return <MultipleChoiceSingleAnswer questionType="MC_MULTIPLE" />;
      case QuestionMapping.REORDER_PARAGRAPH:
        return <ReOrderQuestion />;
      case QuestionMapping.DRAG_AND_DROP:
        return <DragAndDropQuestion />;
      case QuestionMapping.REPEAT_SENTENCE:
        return <RepeatSentence />;
      case QuestionMapping.FIB_RW:
        return <FillInBlankDropdown />;
      default:
        return null;
    }
  }, [typeOfQuestion]);
  const createQuestionCall = useMutation({
    mutationFn: (payload: any) =>
      sendRequest({ url: "addNewQuestion", method: "POST", payload }),
    onSuccess: (data) => {
      console.log("question added", data);
    },
  });
  console.log("QQQ", questionData);
  const addNewQuestionHandler = () => {
    const form = new FormData();
    form.append("extra", questionData.extra ?? "");
    form.append("text", questionData.text ?? "");
    form.append("type", questionData.type); // File
    form.append("taskId", taskId!);
    for (const [key, value] of form.entries()) {
      console.log("=>>>>))))", key, value);
    }

    createQuestionCall.mutateAsync(form);
  };
  const Footer = () => {
    return (
      <div>
        <GradientButton onClick={addNewQuestionHandler}>
          Submit Question
        </GradientButton>
      </div>
    );
  };
  return (
    <div>
      {children}
      <Drawer
        title={`Add New ${typeOfQuestion} Question`}
        size="large"
        onClose={() => setOpenModal(false)}
        footer={<Footer />}
        open={openModal}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <div className=" flex flex-col gap-10">{whichQuestionToRender}</div>
      </Drawer>

      <FloatButton
        shape="square"
        type="primary"
        style={{ insetInlineEnd: 24 }}
        icon={<FaPlusCircle />}
        onClick={() => setOpenModal(true)}
      />
    </div>
  );
}

export default QuestionMaker;
