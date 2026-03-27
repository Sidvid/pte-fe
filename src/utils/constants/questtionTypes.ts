export const QUESTION_TYPES = {
  // Speaking
  RA: "ra",
  RS: "rs",
  DI: "di",
  RL: "rl",
  ASQ: "asq",

  // Writing
  WE: "we",
  SWT: "swt",
  SST: "sst",

  // Reading
  RO: "ro",
  RFIB: "rfib",
  RWFIB: "rwfib",
  RMCSA: "rmcsa",
  RMCMA: "rmcma",

  // Listening
  LFIB: "lfib",
  LMCSA: "lmcsa",
  LMCMA: "lmcma",
  HCS: "hcs",
  HIW: "hiw",
  WFD: "wfd",
};

export const SPEAKING_TYPES = ["ra", "rs", "di", "rl", "asq"];
export const WRITING_TYPES = ["we", "swt", "sst"];
export const READING_TYPES = ["ro", "rfib", "rwfib", "rmcsa", "rmcma"];
export const LISTENING_TYPES = [
  "lfib",
  "lmcsa",
  "lmcma",
  "hcs",
  "hiw",
  "wfd",
  "sst",
];

export const AUDIO_INPUT_TYPES = ["ra", "rs", "di", "rl", "asq"];
export const TEXT_INPUT_TYPES = ["we", "swt", "sst", "wfd"];
export const AUDIO_PLAYBACK_TYPES = [
  "rs",
  "rl",
  "asq",
  "sst",
  "lfib",
  "lmcsa",
  "lmcma",
  "hcs",
  "hiw",
  "wfd",
];

export const getQuestionCategory = (type) => {
  if (SPEAKING_TYPES.includes(type)) return "speaking";
  if (WRITING_TYPES.includes(type)) return "writing";
  if (READING_TYPES.includes(type)) return "reading";
  if (LISTENING_TYPES.includes(type)) return "listening";
  return "unknown";
};

export const getQuestionTitle = (type) => {
  const titles = {
    ra: "Read Aloud",
    rs: "Repeat Sentence",
    di: "Describe Image",
    rl: "Retell Lecture",
    asq: "Answer Short Question",
    we: "Write Essay",
    swt: "Summarize Written Text",
    sst: "Summarize Spoken Text",
    ro: "Re-order Paragraphs",
    rfib: "Reading: Fill in the Blanks",
    rwfib: "Reading & Writing: Fill in the Blanks",
    rmcsa: "Multiple Choice, Single Answer",
    rmcma: "Multiple Choice, Multiple Answer",
    lfib: "Listening: Fill in the Blanks",
    lmcsa: "Listening: Multiple Choice, Single Answer",
    lmcma: "Listening: Multiple Choice, Multiple Answer",
    hcs: "Highlight Correct Summary",
    hiw: "Highlight Incorrect Words",
    wfd: "Write From Dictation",
  };
  return titles[type] || "Unknown Question Type";
};
