import { title } from "process";
import { PortalTypes, SectionType } from "../model/common-enums";

export const SectionTypeTitle = {
  [SectionType.SW]: "Speaking & Writing",
  [SectionType.RD]: "Reading",
  [SectionType.LS]: "Listening",
};
// 1. Single Source of Truth
export const QuestionMapping = {
  READ_ALOUD: "Read Aloud",
  REPEAT_SENTENCE: "Repeat Sentences",
  DESCRIBE_IMAGE: "Describe Image",
  RETELL_LECTURE: "Retell Lecture",
  NO_FLOW_READ_ALOUD: "No Flow Read Aloud",
  FIB_RW: "FIB - Drop Down",
  DRAG_AND_DROP: "Drag & Drop",
  REORDER_PARAGRAPH: "Reorder Paragraph",
  MC_SINGLE: "Multiple Choice - Single Answer",
  MC_MULTIPLE: "Multiple Choice - Multiple Answer",

  FIB_DRAG_AND_DROP: "FIB - Drag & Drop",
  FIB_LISTENING: "Listening Blanks",
  SUMMARIZE_SPOKEN: "Summarize Spoken Text",
  HIGHLIGHT_SUMMARY: "Highlight Incorrect Words",
  WRITE_FROM_DICTATION: "Write From Dictation",
  DICTATION_PREDICTION: "Dictation Prediction",
  WFD_PREDICTION: "WFD PREDICTION",
};
export type QuestionMappingType = keyof typeof QuestionMapping;

// will create new mapping for correspoding value once shukla provide the mapping
export const TypesOfQuestion = {
  [SectionType.SW]: [
    {
      title: QuestionMapping.READ_ALOUD,
      value: QuestionMapping.READ_ALOUD,
    },
    {
      title: QuestionMapping.REPEAT_SENTENCE,
      value: QuestionMapping.REPEAT_SENTENCE,
    },
    {
      title: QuestionMapping.DESCRIBE_IMAGE,
      value: QuestionMapping.DESCRIBE_IMAGE,
    },
    {
      title: QuestionMapping.RETELL_LECTURE,
      value: QuestionMapping.RETELL_LECTURE,
    },
  ],
  [SectionType.RD]: [
    {
      title: QuestionMapping.FIB_RW,
      value: QuestionMapping.FIB_RW,
    },
    {
      title: QuestionMapping.DRAG_AND_DROP,
      value: QuestionMapping.DRAG_AND_DROP,
    },
    {
      title: QuestionMapping.REORDER_PARAGRAPH,
      value: QuestionMapping.REORDER_PARAGRAPH,
    },
    {
      title: QuestionMapping.MC_SINGLE,
      value: QuestionMapping.MC_SINGLE,
    },
    {
      title: QuestionMapping.MC_MULTIPLE,
      value: QuestionMapping.MC_MULTIPLE,
    },
  ],
  [SectionType.LS]: [
    {
      title: QuestionMapping.FIB_DRAG_AND_DROP,
      value: QuestionMapping.FIB_DRAG_AND_DROP,
    },
    {
      title: QuestionMapping.FIB_LISTENING,
      value: QuestionMapping.FIB_LISTENING,
    },
    {
      title: QuestionMapping.SUMMARIZE_SPOKEN,
      value: QuestionMapping.SUMMARIZE_SPOKEN,
    },
    {
      title: QuestionMapping.HIGHLIGHT_SUMMARY,
      value: QuestionMapping.HIGHLIGHT_SUMMARY,
    },
    {
      title: QuestionMapping.WRITE_FROM_DICTATION,
      value: QuestionMapping.WRITE_FROM_DICTATION,
    },
    {
      title: QuestionMapping.DICTATION_PREDICTION,
      value: QuestionMapping.DICTATION_PREDICTION,
    },
    {
      title: QuestionMapping.WFD_PREDICTION,
      value: QuestionMapping.WFD_PREDICTION,
    },
  ],
};
export const QuestionToSectionMap = {
  // Speaking & Writing
  [QuestionMapping.READ_ALOUD]: SectionType.SW,
  [QuestionMapping.REPEAT_SENTENCE]: SectionType.SW,
  [QuestionMapping.DESCRIBE_IMAGE]: SectionType.SW,
  [QuestionMapping.RETELL_LECTURE]: SectionType.SW,
  [QuestionMapping.NO_FLOW_READ_ALOUD]: SectionType.SW,

  // Reading
  [QuestionMapping.FIB_RW]: SectionType.RD,
  [QuestionMapping.DRAG_AND_DROP]: SectionType.RD,
  [QuestionMapping.REORDER_PARAGRAPH]: SectionType.RD,
  [QuestionMapping.MC_SINGLE]: SectionType.RD,
  [QuestionMapping.MC_MULTIPLE]: SectionType.RD,

  // Listening
  [QuestionMapping.FIB_DRAG_AND_DROP]: SectionType.LS,
  [QuestionMapping.FIB_LISTENING]: SectionType.LS,
  [QuestionMapping.SUMMARIZE_SPOKEN]: SectionType.LS,
  [QuestionMapping.HIGHLIGHT_SUMMARY]: SectionType.LS,
  [QuestionMapping.WRITE_FROM_DICTATION]: SectionType.LS,
  [QuestionMapping.DICTATION_PREDICTION]: SectionType.LS,
  [QuestionMapping.WFD_PREDICTION]: SectionType.LS,
};
export const SectionTagColor = {
  [SectionTypeTitle["ls"]]: "pink",
  [SectionTypeTitle["rd"]]: "cyan",
  [SectionTypeTitle["sw"]]: "purple",
};
export const numberToLetterMap: Record<number, string> = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
  5: "E",
  6: "F",
  7: "G",
  8: "H",
  9: "I",
  10: "J",
  11: "K",
  12: "L",
  13: "M",
  14: "N",
  15: "O",
  16: "P",
  17: "Q",
  18: "R",
  19: "S",
  20: "T",
  21: "U",
  22: "V",
  23: "W",
  24: "X",
  25: "Y",
  26: "Z",
};
export const portalConfig = {
  [PortalTypes.ADMIN]: {
    payload: "admin",
    heading: "Welcome to Admin Portal (Riddhima PTE Coaching)",
    url: "http://localhost:3000",
  },
  [PortalTypes.STUDENT]: {
    payload: "student",
    heading: "Welcome to Student Portal (Riddhima PTE Coaching)",
    url: "http://localhost:3000",
  },
};
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
};
