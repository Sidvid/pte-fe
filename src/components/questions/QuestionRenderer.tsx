import React from "react";
import { Spin, Result } from "antd";

// Speaking
import ReadAloud from "./speaking/ReadAloud";
import RepeatSentence from "./speaking/RepeatSentence";
import DescribeImage from "./speaking/DescribeImage";
import HighlightIncorrectWords from "./listening/HighlightIncorrectWords";
import RetellLecture from "./speaking/RetellLecture";
import AnswerShortQuestion from "./speaking/AnswerShortQuestion";

// Writing
import WriteEssay from "./writing/WriteEassy";
import SummarizeWrittenText from "./writing/SummarizeWrittenText";
import SummarizeSpokenText from "./writing/SummarizeSpokenText";

// // Reading
import ReorderParagraphs from "./reading/ReorderParagraphs";
import ReadingFillBlanks from "./reading/ReadingFillBlanks";
import ReadingWritingFillBlanks from "./reading/ReadingWritingFillBlanks";
import MCQSingleAnswer from "./reading/MCQSingleAnswer";
import MCQMultipleAnswer from "./reading/MCQMultipleAnswer";

// // Listening
import ListeningFillBlanks from "./listening/ListeningFillBlanks";
import ListeningMCQSingle from "./listening/ListeningMCQSingle";
import ListeningMCQMultiple from "./listening/ListeningMCQMultiple";
import HighlightCorrectSummary from "./listening/HighlightCorrectSummary";
// import HighlightIncorrectWords from "./listening/HighlightIncorrectWords";
import WriteFromDictation from "./listening/WriteFromDictation";

const componentMap = {
  // Speaking
  ra: ReadAloud,
  rs: RepeatSentence,
  di: DescribeImage,
  rl: RetellLecture,
  asq: AnswerShortQuestion,

  // Writing
  we: WriteEssay,
  swt: SummarizeWrittenText,
  sst: SummarizeSpokenText,

  // Reading
  ro: ReorderParagraphs,
  rfib: ReadingFillBlanks,
  rwfib: ReadingWritingFillBlanks,
  rmcsa: MCQSingleAnswer,
  rmcma: MCQMultipleAnswer,
  hiw: HighlightIncorrectWords,

  // Listening
  lfib: ListeningFillBlanks,
  lmcsa: ListeningMCQSingle,
  lmcma: ListeningMCQMultiple,
  hcs: HighlightCorrectSummary,
  // hiw: HighlightIncorrectWords,
  wfd: WriteFromDictation,
};

const QuestionRenderer = ({
  question,
  questionNumber,
  totalQuestions,
  onResponse,
  loading = false,
}) => {
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px" }}>
        <Spin size="large" tip="Loading question..." />
      </div>
    );
  }

  if (!question) {
    return (
      <Result
        status="warning"
        title="No Question"
        subTitle="Question data is not available."
      />
    );
  }

  const QuestionComponent = componentMap[question.type];

  if (!QuestionComponent) {
    return (
      <Result
        status="error"
        title="Unknown Question Type"
        subTitle={`Question type "${question.type}" is not supported.`}
      />
    );
  }

  return (
    <QuestionComponent
      question={question}
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      onResponse={onResponse}
    />
  );
};

export default QuestionRenderer;
