import useHttp from "@/hooks/use-http";
import ReadAloud from "@/modules/common/show-question/read-aloud";
import RepeatSentence from "@/modules/common/show-question/repeat-sentence";
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
  console.log("my state", state);
  const allTasksCall = useMutation({
    mutationFn: (payload: string) =>
      sendRequest({
        url: "allDailyTask",
        method: "GET",
        endURL: payload!,
      }) as Promise<SuccessResponse<QuestionItem[]>>,
    onSuccess: (data: SuccessResponse<QuestionItem[]>) => {
      const { response } = data;

      setQuestions(
        response?.data.map((items, index) => ({ ...items, sNo: index + 1 }))
      );
    },
  });
  //   useEffect(() => {
  //     questions?.map((items) => {
  //       console.log("item", items.data);
  //     });
  //   }, [questions]);
  useEffect(() => {
    if (state.id) {
      allTasksCall.mutateAsync(`${state.id}/questions`);
    }
  }, [state.id]);

  const questionType = state.title as QuestionMappingType;
  console.log("Question type", questionType);
  const renderQuestion = useMemo(() => {
    switch (questionType) {
      case QuestionMapping.READ_ALOUD:
        return <ReadAloud questions={questions!} />;
      case QuestionMapping.NO_FLOW_READ_ALOUD:
        return <ReadAloud questions={questions!} />;
      case QuestionMapping.REPEAT_SENTENCE:
        return <RepeatSentence questions={questions!} />;
      case QuestionMapping.FIB_RW:
        return questions?.map(({ data }) => (
          <FillInTheBlanks text={data.text} />
        ));

      default:
        break;
    }
  }, [state, questions]);
  console.log("my state", state);
  return (
    <>
      <QuestionMaker taskId={state.id} typeOfQuestion={questionType}>
        <p className="text-black">{questionType}</p>
        {renderQuestion}
      </QuestionMaker>
    </>
  );
}

export default ViewSingleCollectionQuestions;
