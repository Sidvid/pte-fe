import { create } from "zustand";

const initialData = {
  taskId: "",
  type: "",
  extra: null,
  text: "",
  isButtonEnabled: false,
};

interface QuestionData {
  taskId?: string;
  type?: any;
  extra?: any;
  text?: string;
  isButtonEnabled?: boolean;
}

interface CreateQuestionData {
  questionData: QuestionData;
  setCreateQuestionData: (params: QuestionData) => void;
  clearData: () => void;
}

export const useCreateQuestion = create<CreateQuestionData>((set) => ({
  questionData: { ...initialData },

  setCreateQuestionData: (params) =>
    set((state) => ({
      questionData: {
        ...state.questionData,
        ...params, // ✅ merge inside questionData
      },
    })),

  clearData: () => set({ questionData: initialData }),
}));
