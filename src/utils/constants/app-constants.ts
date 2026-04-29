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
    url: "http://192.168.1.9:3000/",
  },
  [PortalTypes.STUDENT]: {
    payload: "student",
    heading: "Welcome to Student Portal (Riddhima PTE Coaching)",
    url: "http://192.168.1.9:3000/",
  },
};
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
};

export const allSampleQuestions = {
  // Speaking
  ra: {
    id: "q-ra-001",
    type: "ra",
    index: 1,
    data: {
      text: "Climate change is one of the most pressing issues of our time. Scientists around the world have documented rising temperatures, melting ice caps, and increasingly severe weather events.",
    },
    extra: {},
  },

  // rs: {
  //   id: "q-rs-001",
  //   type: "rs",
  //   index: 1,
  //   data: {
  //     audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  //   },
  //   extra: {
  //     script:
  //       "The university library will be closed for renovations next month.",
  //   },
  // },

  // di: {
  //   id: "q-di-001",
  //   type: "di",
  //   index: 1,
  //   data: {
  //     image:
  //       "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg",
  //   },
  //   extra: {},
  // },

  // rl: {
  //   id: "q-rl-001",
  //   type: "rl",
  //   index: 1,
  //   data: {
  //     audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  //     image: "https://via.placeholder.com/400x300?text=Lecture+Slide",
  //   },
  //   extra: {},
  // },

  // asq: {
  //   id: "q-asq-001",
  //   type: "asq",
  //   index: 1,
  //   data: {
  //     audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  //   },
  //   extra: {
  //     answers: ["author", "writer"],
  //   },
  // },

  // // Writing
  // we: {
  //   id: "q-we-001",
  //   type: "we",
  //   index: 1,
  //   data: {
  //     prompt:
  //       "Do you agree or disagree with the following statement? Technology has made our lives easier.",
  //   },
  //   extra: {},
  // },

  // swt: {
  //   id: "q-swt-001",
  //   type: "swt",
  //   index: 1,
  //   data: {
  //     text: "The Great Barrier Reef is the world's largest coral reef system, stretching over 2,300 kilometers off the coast of Australia. It faces threats from climate change and pollution.",
  //   },
  //   extra: {},
  // },

  // sst: {
  //   id: "q-sst-001",
  //   type: "sst",
  //   index: 1,
  //   data: {
  //     audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  //   },
  //   extra: {},
  // },

  // // Reading
  // ro: {
  //   id: "q-ro-001",
  //   type: "ro",
  //   index: 1,
  //   data: {
  //     sentences: [
  //       "Finally, the water reaches the ocean.",
  //       "The water cycle begins when the sun heats water.",
  //       "This water vapor rises and forms clouds.",
  //       "Precipitation occurs as rain or snow.",
  //       "The precipitation flows into rivers.",
  //     ],
  //   },
  //   extra: {},
  // },

  // rfib: {
  //   id: "q-rfib-001",
  //   type: "rfib",
  //   index: 1,
  //   data: {
  //     text: "The human brain is a remarkable _____. It controls all of our _____ functions.",
  //     options: [
  //       ["organ", "muscle", "bone"],
  //       ["bodily", "mental", "physical"],
  //     ],
  //   },
  //   extra: {
  //     answers: ["organ", "bodily"],
  //   },
  // },

  // rwfib: {
  //   id: "q-rwfib-001",
  //   type: "rwfib",
  //   index: 1,
  //   data: {
  //     text: "Climate change is having a profound _____ on ecosystems worldwide.",
  //     blanks: [{ index: 0, options: ["impact", "effect", "affect"] }],
  //   },
  //   extra: {
  //     answers: ["impact"],
  //   },
  // },

  // rmcsa: {
  //   id: "q-rmcsa-001",
  //   type: "rmcsa",
  //   index: 1,
  //   data: {
  //     text: "The Industrial Revolution transformed agricultural economies into industrial ones.",
  //     question: "What was the main impact of the Industrial Revolution?",
  //     options: [
  //       "Decline in agriculture",
  //       "Transformation to industrial economy",
  //       "Reduced efficiency",
  //       "Eliminated factory workers",
  //     ],
  //   },
  //   extra: {
  //     answer: 1,
  //   },
  // },

  // rmcma: {
  //   id: "q-rmcma-001",
  //   type: "rmcma",
  //   index: 1,
  //   data: {
  //     text: "Renewable energy sources include solar, wind, and hydroelectric power.",
  //     question: "Which are characteristics of renewable energy?",
  //     options: [
  //       "Do not deplete resources",
  //       "More expensive",
  //       "Minimal emissions",
  //       "Require lots of water",
  //     ],
  //   },
  //   extra: {
  //     answers: [0, 2],
  //   },
  // },

  // // Listening
  // lfib: {
  //   id: "q-lfib-001",
  //   type: "lfib",
  //   index: 1,
  //   data: {
  //     audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  //     text: "The professor explained that _____ is essential for understanding scientific _____.",
  //   },
  //   extra: {
  //     answers: ["critical analysis", "concepts"],
  //   },
  // },

  // lmcsa: {
  //   id: "q-lmcsa-001",
  //   type: "lmcsa",
  //   index: 1,
  //   data: {
  //     audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  //     question: "What is the main topic?",
  //     options: [
  //       "Ancient history",
  //       "Agriculture",
  //       "Technology in education",
  //       "Conservation",
  //     ],
  //   },
  //   extra: {
  //     answer: 2,
  //   },
  // },

  // lmcma: {
  //   id: "q-lmcma-001",
  //   type: "lmcma",
  //   index: 1,
  //   data: {
  //     audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  //     question: "Which factors contribute to climate change?",
  //     options: [
  //       "Deforestation",
  //       "Renewable energy",
  //       "Industrial emissions",
  //       "Organic farming",
  //     ],
  //   },
  //   extra: {
  //     answers: [0, 2],
  //   },
  // },

  // hcs: {
  //   id: "q-hcs-001",
  //   type: "hcs",
  //   index: 1,
  //   data: {
  //     audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  //     options: [
  //       "Exercise benefits mental health",
  //       "Sedentary lifestyles harm cardiovascular health",
  //       "Diet plans for weight loss",
  //       "Mental health unrelated to exercise",
  //     ],
  //   },
  //   extra: {
  //     answer: 0,
  //   },
  // },

  // hiw: {
  //   id: "q-hiw-001",
  //   type: "hiw",
  //   index: 1,
  //   data: {
  //     audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
  //     text: "The university library will be closed for maintenance next week. Students can access online resources.",
  //   },
  //   extra: {
  //     incorrectWords: [7, 9],
  //   },
  // },

  // wfd: {
  //   id: "q-wfd-001",
  //   type: "wfd",
  //   index: 1,
  //   data: {
  //     audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
  //   },
  //   extra: {
  //     script: "The assignment must be submitted by the end of this week.",
  //   },
  // },
};

// Usage: Pick any question type to test
const questionToTest = allSampleQuestions.ra; // Change to rs, di, we, ro, etc.
