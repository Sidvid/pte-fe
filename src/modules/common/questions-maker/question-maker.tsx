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
import ReadAloudQuestion from "./read-aloud-question";
import DescribeImageQuestion from "./describe-image-question";
import RetellLectureQuestion from "./retell-lecture-question";
import FibDragDropQuestion from "./fib-drag-drop-question";
import SummarizeSpokenQuestion from "./summarize-spoken-question";
import FibListeningQuestion from "./fib-listening-question";
import HighlightIncorrectWordsQuestion from "./highlight-incorrect-words-question";
import WriteFromDictationQuestion from "./write-from-dictation-question";
import NoFlowReadAloudQuestion from "./no-flow-read-aloud-question";
import DictationPredictionQuestion from "./dictation-prediction-question";
import WFDPredictionQuestion from "./wfd-prediction-question";
const { TextArea } = Input;
interface QuestionMakerProps {
  typeOfQuestion: QuestionMappingType;
  children: React.ReactNode;
  taskId?: string;
  onQuestionAdded?: () => void;
}
function QuestionMaker({
  typeOfQuestion,
  children,
  taskId,
  onQuestionAdded,
}: QuestionMakerProps) {
  const [openModal, setOpenModal] = useState(false);
  const { sendRequest } = useHttp({ type: "auth" });
  const { questionData, clearData } = useCreateQuestion();
  const whichQuestionToRender = useMemo(() => {
    switch (typeOfQuestion) {
      case QuestionMapping.READ_ALOUD:
        return <ReadAloudQuestion />;
      case QuestionMapping.NO_FLOW_READ_ALOUD:
        return <NoFlowReadAloudQuestion />;
      case QuestionMapping.DESCRIBE_IMAGE:
        return <DescribeImageQuestion />;
      case QuestionMapping.RETELL_LECTURE:
        return <RetellLectureQuestion />;
      case QuestionMapping.SUMMARIZE_SPOKEN:
        return <SummarizeSpokenQuestion />;
      case QuestionMapping.FIB_DRAG_AND_DROP:
        return <FibDragDropQuestion />;
      case QuestionMapping.FIB_LISTENING:
        return <FibListeningQuestion />;
      case QuestionMapping.HIGHLIGHT_SUMMARY:
        return <HighlightIncorrectWordsQuestion />;
      case QuestionMapping.WRITE_FROM_DICTATION:
        return <WriteFromDictationQuestion />;
      case QuestionMapping.DICTATION_PREDICTION:
        return <DictationPredictionQuestion />;
      case QuestionMapping.WFD_PREDICTION:
        return <WFDPredictionQuestion />;
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
      if (!data) {
        console.error("⚠️ API returned undefined - check useHttp error handling");
        return;
      }
      
      console.log("✅ Question added successfully!", data);
      console.log("Full response:", JSON.stringify(data, null, 2));
      setOpenModal(false);
      clearData();
      
      if (onQuestionAdded) {
        console.log("Calling onQuestionAdded to refresh list...");
        setTimeout(() => {
          onQuestionAdded();
        }, 500);
      }
    },
    onError: (error) => {
      console.error("❌ Error adding question:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
    },
  });
  console.log("QQQ", questionData);
  console.log("Task ID being used:", taskId);
  
  const addNewQuestionHandler = () => {
    if (!taskId) {
      console.error("Task ID is missing!");
      return;
    }
    
    const formData = new FormData();
    
    formData.append("task_id", taskId);
    
    let actualType: string = typeOfQuestion;
    
    if (typeOfQuestion === QuestionMapping.READ_ALOUD) {
      actualType = "ra";
    } else if (typeOfQuestion === QuestionMapping.NO_FLOW_READ_ALOUD) {
      actualType = "fib_rw";
    } else if (typeOfQuestion === QuestionMapping.DESCRIBE_IMAGE) {
      actualType = "di";
    } else if (typeOfQuestion === QuestionMapping.REPEAT_SENTENCE) {
      actualType = "rs";
    } else if (typeOfQuestion === QuestionMapping.RETELL_LECTURE) {
      actualType = "rl";
    } else if (typeOfQuestion === QuestionMapping.FIB_RW) {
      actualType = "fib_rw";
    } else if (typeOfQuestion === QuestionMapping.FIB_DRAG_AND_DROP) {
      actualType = "fib_r";
    } else if (typeOfQuestion === QuestionMapping.FIB_LISTENING) {
      actualType = "fib_l";
    } else if (typeOfQuestion === QuestionMapping.SUMMARIZE_SPOKEN) {
      actualType = "sst";
    } else if (typeOfQuestion === QuestionMapping.HIGHLIGHT_SUMMARY) {
      actualType = "hiw";
    } else if (typeOfQuestion === QuestionMapping.WRITE_FROM_DICTATION) {
      actualType = "wfd";
    } else if (typeOfQuestion === QuestionMapping.DICTATION_PREDICTION) {
      actualType = "di";
    } else if (typeOfQuestion === QuestionMapping.WFD_PREDICTION) {
      actualType = "wfd"; 
    } else if (typeOfQuestion === QuestionMapping.MC_SINGLE) {
      actualType = "mc_single";
    } else if (typeOfQuestion === QuestionMapping.MC_MULTIPLE) {
      actualType = "mc_multiple";
    } else if (typeOfQuestion === QuestionMapping.REORDER_PARAGRAPH) {
      actualType = "rp";
    } else if (typeOfQuestion === QuestionMapping.DRAG_AND_DROP) {
      actualType = "dd";
    } else {
      actualType = typeOfQuestion;
    }
    
    formData.append("type", actualType);
    
    if (questionData.text) {
      const textValue = typeof questionData.text === 'object' 
        ? JSON.stringify(questionData.text) 
        : questionData.text;
      formData.append("text", textValue);
    }
    
    if (questionData.extra) {
      const extraValue = typeof questionData.extra === 'object' 
        ? JSON.stringify(questionData.extra) 
        : questionData.extra;
      formData.append("extra", extraValue);
    }
    
    if (questionData.type instanceof File) {
      formData.append("file", questionData.type);
    }
    
    console.log("Submitting question with FormData:");
    for (const [key, value] of formData.entries()) {
      console.log("  ", key, ":", value);
    }
    
    createQuestionCall.mutateAsync(formData);
  };
  const Footer = () => {
    return (
      <div>
        <GradientButton 
          onClick={addNewQuestionHandler}
          disabled={createQuestionCall.isPending}
        >
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
        onClose={() => {
          setOpenModal(false);
          clearData();
        }}
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
