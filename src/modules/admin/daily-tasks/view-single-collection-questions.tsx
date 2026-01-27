import useHttp from "@/hooks/use-http";
import ReadAloud from "@/modules/common/show-question/read-aloud";
import RepeatSentence from "@/modules/common/show-question/repeat-sentence";
import DescribeImage from "@/modules/common/show-question/describe-image";
import RetellLecture from "@/modules/common/show-question/retell-lecture";
import FibDragDrop from "@/modules/common/show-question/fib-drag-drop";
import SummarizeSpoken from "@/modules/common/show-question/summarize-spoken";
import FibListening from "@/modules/common/show-question/fib-listening";
import HighlightIncorrectWords from "@/modules/common/show-question/highlight-incorrect-words";
import WriteFromDictation from "@/modules/common/show-question/write-from-dictation";
import DictationPrediction from "@/modules/common/show-question/dictation-prediction";
import WFDPrediction from "@/modules/common/show-question/wfd-prediction";
import {
  QuestionMapping,
  QuestionMappingType,
} from "@/utils/constants/app-constants";
import { SuccessResponse } from "@/utils/model/model";
import { QuestionItem } from "@/utils/model/response-models";
import { useMutation } from "@tanstack/react-query";
import { FloatButton } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { FaPlusCircle } from "react-icons/fa";
import QuestionMaker from "@/modules/common/questions-maker/question-maker";
import FillInTheBlanks from "@/modules/common/show-question/fill-in-the-blank";
function ViewSingleCollectionQuestions() {
  const { state } = useLocation();

  const [questions, setQuestions] = useState<QuestionItem[]>();
  const { sendRequest } = useHttp({ type: "auth" });
  
  const fetchQuestions = () => {
    if (state?.id) {
      allTasksCall.mutateAsync(state.id);
    } else {
      console.error("❌ Cannot fetch questions - state.id is missing");
    }
  };
  
  const allTasksCall = useMutation({
    mutationFn: (collectionId: string) =>
      sendRequest({
        url: "allDailyTask",
        method: "GET",
        endURL: `${collectionId}/questions`,
        params: { task_id: collectionId },
      }) as Promise<SuccessResponse<QuestionItem[]>>,
    onSuccess: (data: SuccessResponse<QuestionItem[]>) => {
      const { response } = data;
      
      if (response?.data && Array.isArray(response.data)) {
        setQuestions(
          response.data.map((items, index) => ({ ...items, sNo: index + 1 }))
        );
      } else {
        setQuestions([]);
      }
    },
    onError: (error) => {
      console.error("Error fetching questions:", error);
    },
  });
  
  const deleteQuestionCall = useMutation({
    mutationFn: (questionId: string) =>
      sendRequest({
        url: "deleteQuestion",
        method: "DELETE",
        endURL: questionId,
      }),
    onSuccess: () => {
      fetchQuestions();
    },
    onError: (error) => {
      console.error("Error deleting question:", error);
    },
  });
  
  const handleDeleteQuestion = (questionId: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      deleteQuestionCall.mutateAsync(questionId);
    }
  };
  //   useEffect(() => {
  //     questions?.map((items) => {
  //       console.log("item", items.data);
  //     });
  //   }, [questions]);
  useEffect(() => {
    if (state?.id) {
      allTasksCall.mutateAsync(state.id);
    } else {
      console.error("No state.id found, cannot fetch questions");
    }
  }, [state?.id]);

  const questionTypeMappings = [
    { includes: "Describe Image", value: QuestionMapping.DESCRIBE_IMAGE, key: "DESCRIBE_IMAGE" as const },
    { includes: "Read Aloud", value: QuestionMapping.READ_ALOUD, key: "READ_ALOUD" as const },
    { includes: "No Flow Read Aloud", value: QuestionMapping.NO_FLOW_READ_ALOUD, key: "NO_FLOW_READ_ALOUD" as const },
    { includes: "Repeat Sentence", value: QuestionMapping.REPEAT_SENTENCE, key: "REPEAT_SENTENCE" as const },
    { includes: "Retell Lecture", value: QuestionMapping.RETELL_LECTURE, key: "RETELL_LECTURE" as const },
    { includes: "Summarize Spoken", value: QuestionMapping.SUMMARIZE_SPOKEN, key: "SUMMARIZE_SPOKEN" as const },
    { includes: "FIB - Drag & Drop", value: QuestionMapping.FIB_DRAG_AND_DROP, key: "FIB_DRAG_AND_DROP" as const },
    { includes: "Listening Blanks", value: QuestionMapping.FIB_LISTENING, key: "FIB_LISTENING" as const },
    { includes: "Highlight Incorrect Words", value: QuestionMapping.HIGHLIGHT_SUMMARY, key: "HIGHLIGHT_SUMMARY" as const },
    { includes: "Write From Dictation", value: QuestionMapping.WRITE_FROM_DICTATION, key: "WRITE_FROM_DICTATION" as const },
    { includes: "Dictation Prediction", value: QuestionMapping.DICTATION_PREDICTION, key: "DICTATION_PREDICTION" as const },
    { includes: "WFD Prediction", value: QuestionMapping.WFD_PREDICTION, key: "WFD_PREDICTION" as const },
    { includes: "FIB - Drop Down", value: QuestionMapping.FIB_RW, key: "FIB_RW" as const },
  ];

  const getQuestionTypeInfo = () => {
    if (!state?.title) {
      return { value: QuestionMapping.DESCRIBE_IMAGE, key: "DESCRIBE_IMAGE" as QuestionMappingType };
    }
    
    for (const mapping of questionTypeMappings) {
      if (state.title.includes(mapping.includes)) {
        return { value: mapping.value, key: mapping.key };
      }
    }
    
    return { value: QuestionMapping.DESCRIBE_IMAGE, key: "DESCRIBE_IMAGE" as QuestionMappingType };
  };
  
  const { value: questionTypeValue, key: questionType } = getQuestionTypeInfo();
  const renderQuestion = useMemo(() => {
    switch (questionType) {
      case "READ_ALOUD":
        return <ReadAloud questions={questions!} onDelete={handleDeleteQuestion} />;
      case "NO_FLOW_READ_ALOUD":
        return <ReadAloud questions={questions!} onDelete={handleDeleteQuestion} />;
      case "REPEAT_SENTENCE":
        return <RepeatSentence questions={questions!} onDelete={handleDeleteQuestion} />;
      case "DESCRIBE_IMAGE":
        return <DescribeImage questions={questions!} onDelete={handleDeleteQuestion} />;
      case "RETELL_LECTURE":
        return <RetellLecture questions={questions!} onDelete={handleDeleteQuestion} />;
      case "SUMMARIZE_SPOKEN":
        return <SummarizeSpoken questions={questions!} onDelete={handleDeleteQuestion} />;
      case "FIB_DRAG_AND_DROP":
        return <FibDragDrop questions={questions!} onDelete={handleDeleteQuestion} />;
      case "FIB_LISTENING":
        return <FibListening questions={questions!} onDelete={handleDeleteQuestion} />;
      case "HIGHLIGHT_SUMMARY":
        return <HighlightIncorrectWords questions={questions!} onDelete={handleDeleteQuestion} />;
      case "WRITE_FROM_DICTATION":
        return <WriteFromDictation questions={questions!} onDelete={handleDeleteQuestion} />;
      case "DICTATION_PREDICTION":
        return <DictationPrediction questions={questions!} onDelete={handleDeleteQuestion} />;
      case "WFD_PREDICTION":
        return <WFDPrediction questions={questions!} onDelete={handleDeleteQuestion} />;
      case "FIB_RW":
        return (
          <div className="space-y-4">
            {questions?.map((question, index) => {
              try {
                const textData = typeof question.data === 'string' ? JSON.parse(question.data) : question.data;
                return (
                  <div key={question.id || index}>
                    <FillInTheBlanks text={textData?.text || ""} />
                    {question.sNo && (
                      <div className="mt-2 text-lg text-gray-500">Question #{question.sNo}</div>
                    )}
                  </div>
                );
              } catch (error) {
                console.error("Error parsing FIB_RW question data:", error);
                return (
                  <div key={question.id || index} className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-red-600">Error loading question data</p>
                  </div>
                );
              }
            })}
          </div>
        );

      default:
        break;
    }
  }, [state, questions, questionType]);
  return (
    <>
      <QuestionMaker 
        taskId={state?.id} 
        typeOfQuestion={questionTypeValue as unknown as QuestionMappingType}
        onQuestionAdded={fetchQuestions}
      >
        <p className="text-black">{questionType}</p>
        <p className="text-gray-600 text-xs">Collection ID: {state?.id}</p>
        {questions && questions.length > 0 ? (
          renderQuestion
        ) : (
          <div className="flex flex-col items-center justify-center p-12 mt-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-lg mb-2">No questions yet</p>
            <p className="text-gray-400 text-sm">Click the + button to add your first question</p>
          </div>
        )}
      </QuestionMaker>
    </>
  );
}

export default ViewSingleCollectionQuestions;
