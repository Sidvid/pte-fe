import { useEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import { useMutation } from "@tanstack/react-query";
import useHttp from "./use-http";
import { normalizeQuestionType } from "@/utils/constants/questtionTypes";

type ExistingResponse = {
  question_id: string;
  response: any;
};

type ExistingSectionAttempt = {
  mtss_id: string;
  section_id: string;
  submitted_at: string | null;
  count_responses?: number;
};

export const useMockTestFlow = ({
  testData,
  mtsId,
  existingSectionAttempts = [],
  existingResponsesByMtssId = {},
}: {
  testData: any;
  mtsId: string;
  existingSectionAttempts?: ExistingSectionAttempt[];
  existingResponsesByMtssId?: Record<string, ExistingResponse[]>;
}) => {
  const { sendRequest } = useHttp({ type: "auth" });

  const sections = testData?.mock_test_sections || [];

  const getInitialSectionIndex = () => {
    if (!sections.length) return 0;

    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      const attempt = existingSectionAttempts.find(
        (a) => a.section_id === sec.id,
      );
      if (!attempt || !attempt.submitted_at) return i;
    }

    return 0;
  };

  const [currentSectionIndex, setCurrentSectionIndex] = useState(
    getInitialSectionIndex(),
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentMtssId, setCurrentMtssId] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [sectionStarted, setSectionStarted] = useState(false);
  const [sectionCompletedMap, setSectionCompletedMap] = useState<
    Record<string, boolean>
  >({});
  const [showTransition, setShowTransition] = useState(false);
  const [resumeNotice, setResumeNotice] = useState<null | {
    sectionTitle: string;
    questionNumber: number;
  }>(null);

  const autoSubmittingRef = useRef(false);

  const currentSection = sections[currentSectionIndex] || null;

  const currentSectionQuestions = useMemo(() => {
    if (!currentSection?.questions) return [];
    return currentSection.questions.map((q: any) => ({
      ...q,
      type: normalizeQuestionType(q.type),
      originalType: q.type,
      sectionId: currentSection.id,
      sectionTitle: currentSection.title,
      sectionType: currentSection.type,
    }));
  }, [currentSection]);

  const currentQuestion = currentSectionQuestions[currentQuestionIndex] || null;
  const isLastQuestionInSection =
    currentQuestionIndex === currentSectionQuestions.length - 1;
  const isLastSection = currentSectionIndex === sections.length - 1;
  const mts_id = localStorage.getItem("current_mts_id") || mtsId;
  // const mtss_id = "61d91570-2930-4073-8b69-2dbdf0071b2b";

  const currentExistingAttempt = useMemo(() => {
    if (!currentSection?.id) return null;
    return (
      existingSectionAttempts.find((a) => a.section_id === currentSection.id) ||
      null
    );
  }, [existingSectionAttempts, currentSection?.id]);

  const startSectionCall = useMutation({
    mutationFn: (payload: any) =>
      sendRequest({
        url: "startMockTestSection",
        method: "POST",
        // endURL: `${payload.mts_id}/sections/${payload.section_id}/start`,
        endURL: `${payload.mts_id}/sections/${payload.section_id}/start`,
      }),
    onSuccess: (data: any) => {
      console.log("startSectionCall success raw response:", data);

      const mtssId =
        data?.response?.mtss_id ||
        data?.response?.data?.mtss_id ||
        data?.data?.mtss_id ||
        data?.mtss_id;

      if (!mtssId) {
        message.error("Section started but mtss_id not received");
        return;
      }

      setCurrentMtssId(mtssId);
      setSectionStarted(true);
      message.success("Section started");
    },
    onError: (err: any) => {
      console.error(err);
      message.error(err?.message || "Failed to start section");
    },
  });

  const saveQuestionResponseCall = useMutation({
    mutationFn: (payload: any) =>
      sendRequest({
        url: "saveQuestionResponse",
        method: "POST",
        payload,
      }),
    onError: (err: any) => {
      console.error(err);
      message.error(err?.message || "Failed to save response");
    },
  });

  const submitSectionCall = useMutation({
    mutationFn: (payload: any) =>
      sendRequest({
        url: "submitMockTestSection",
        method: "POST",
        endURL: `${payload.mts_id}/sections/${payload.mtss_id}/submit`,
      }),
    onSuccess: () => {
      if (currentSection?.id) {
        setSectionCompletedMap((prev) => ({
          ...prev,
          [currentSection.id]: true,
        }));
      }
      message.success("Section submitted successfully");
    },
    onError: (err: any) => {
      console.error(err);
      message.error(err?.message || "Failed to submit section");
    },
  });

  const submitMockTestCall = useMutation({
    mutationFn: (payload: any) =>
      sendRequest({
        url: "submitMockTest",
        method: "POST",
        payload,
      }),
    onSuccess: () => {
      message.success("Mock test submitted successfully");
    },
    onError: (err: any) => {
      console.error(err);
      message.error(err?.message || "Failed to submit mock test");
    },
  });

  useEffect(() => {
    if (!mtsId || !currentSection?.id || sectionStarted) return;

    startSectionCall.mutate({
      mts_id: mtsId,
      section_id: currentSection.id,
    });
  }, [mtsId, currentSection?.id, sectionStarted]);

  useEffect(() => {
    if (!currentMtssId || !currentSectionQuestions.length) return;

    const savedResponses = existingResponsesByMtssId[currentMtssId] || [];

    if (!savedResponses.length) {
      setCurrentQuestionIndex(0);
      return;
    }

    setResponses((prev) => {
      const updated = { ...prev };
      savedResponses.forEach((r) => {
        updated[r.question_id] = r.response;
      });
      return updated;
    });

    const answeredIds = new Set(savedResponses.map((r) => r.question_id));
    const firstUnansweredIndex = currentSectionQuestions.findIndex(
      (q: any) => !answeredIds.has(q.id),
    );

    const resumeIndex =
      firstUnansweredIndex === -1
        ? Math.min(savedResponses.length, currentSectionQuestions.length - 1)
        : firstUnansweredIndex;

    setCurrentQuestionIndex(resumeIndex);

    if (savedResponses.length > 0) {
      setResumeNotice({
        sectionTitle: currentSection.title,
        questionNumber: resumeIndex + 1,
      });
    }
  }, [currentMtssId, currentSectionQuestions, existingResponsesByMtssId]);

  const handleResponse = (response: any) => {
    if (!currentQuestion) return;

    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: response,
    }));
  };

  const handleNext = async () => {
    try {
      if (!currentQuestion || !currentMtssId || !mtsId) {
        message.error("Question/section not initialized");
        return;
      }

      const currentResponse = responses[currentQuestion.id];
      if (!currentResponse) {
        message.warning("Please answer the current question before proceeding");
        return;
      }

      await saveQuestionResponseCall.mutateAsync({
        question_id: currentQuestion.id,
        mtss_id: currentMtssId,
        response: currentResponse,
      });

      if (!isLastQuestionInSection) {
        setCurrentQuestionIndex((prev) => prev + 1);
        message.success("Response saved");
        return;
      }

      await submitSectionCall.mutateAsync({
        mts_id: mtsId,
        mtss_id: currentMtssId,
      });

      if (!isLastSection) {
        setShowTransition(true);
        return;
      }

      await submitMockTestCall.mutateAsync({
        mts_id: mtsId,
      });
    } catch (err: any) {
      console.error(err);
      message.error(err?.message || "Something went wrong");
    }
  };

  const handleAutoSubmitSection = async () => {
    if (autoSubmittingRef.current) return;
    autoSubmittingRef.current = true;

    try {
      if (!currentMtssId || !mtsId) {
        message.error("Section not initialized for auto submit");
        return;
      }

      // If current question has draft response, try save it first
      if (currentQuestion && responses[currentQuestion.id]) {
        try {
          await saveQuestionResponseCall.mutateAsync({
            question_id: currentQuestion.id,
            mtss_id: currentMtssId,
            response: responses[currentQuestion.id],
          });
        } catch (err) {
          console.warn("Auto-save before auto-submit failed:", err);
        }
      }

      await submitSectionCall.mutateAsync({
        mts_id: mtsId,
        mtss_id: currentMtssId,
      });

      if (!isLastSection) {
        setShowTransition(true);
      } else {
        await submitMockTestCall.mutateAsync({
          mts_id: mtsId,
        });
      }
    } catch (err: any) {
      console.error(err);
      message.error(err?.message || "Auto submit failed");
    } finally {
      autoSubmittingRef.current = false;
    }
  };

  const moveToNextSection = () => {
    const nextIndex = currentSectionIndex + 1;
    if (nextIndex >= sections.length) return;

    setCurrentSectionIndex(nextIndex);
    setCurrentQuestionIndex(0);
    setCurrentMtssId(null);
    setSectionStarted(false);
    setShowTransition(false);
    setResumeNotice(null);
  };

  return {
    sections,
    currentSection,
    currentQuestion,
    currentQuestionIndex,
    totalQuestionsInSection: currentSectionQuestions.length,
    currentSectionIndex,
    totalSections: sections.length,
    currentMtssId,
    responses,
    sectionStarted,
    showTransition,
    resumeNotice,
    isLastQuestionInSection,
    isLastSection,

    handleResponse,
    handleNext,
    handleAutoSubmitSection,
    moveToNextSection,

    startSectionLoading: startSectionCall.isPending,
    saveLoading: saveQuestionResponseCall.isPending,
    submitSectionLoading: submitSectionCall.isPending,
    submitMockLoading: submitMockTestCall.isPending,
  };
};
