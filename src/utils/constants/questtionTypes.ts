// export const QUESTION_TYPES = {
//   // Speaking
//   RA: "ra",
//   RS: "rs",
//   DI: "di",
//   RL: "rl",
//   ASQ: "asq",

//   // Writing
//   WE: "we",
//   SWT: "swt",
//   SST: "sst",

//   // Reading
//   RO: "ro",
//   RFIB: "rfib",
//   RWFIB: "rwfib",
//   RMCSA: "rmcsa",
//   RMCMA: "rmcma",

//   // Listening
//   LFIB: "lfib",
//   LMCSA: "lmcsa",
//   LMCMA: "lmcma",
//   HCS: "hcs",
//   HIW: "hiw",
//   WFD: "wfd",
// };

// export const SPEAKING_TYPES = ["ra", "rs", "di", "rl", "asq"];
// export const WRITING_TYPES = ["we", "swt", "sst"];
// export const READING_TYPES = ["ro", "rfib", "rwfib", "rmcsa", "rmcma"];
// export const LISTENING_TYPES = [
//   "lfib",
//   "lmcsa",
//   "lmcma",
//   "hcs",
//   "hiw",
//   "wfd",
//   "sst",
// ];

// export const AUDIO_INPUT_TYPES = ["ra", "rs", "di", "rl", "asq"];
// export const TEXT_INPUT_TYPES = ["we", "swt", "sst", "wfd"];
// export const AUDIO_PLAYBACK_TYPES = [
//   "rs",
//   "rl",
//   "asq",
//   "sst",
//   "lfib",
//   "lmcsa",
//   "lmcma",
//   "hcs",
//   "hiw",
//   "wfd",
// ];

// export const getQuestionCategory = (type) => {
//   if (SPEAKING_TYPES.includes(type)) return "speaking";
//   if (WRITING_TYPES.includes(type)) return "writing";
//   if (READING_TYPES.includes(type)) return "reading";
//   if (LISTENING_TYPES.includes(type)) return "listening";
//   return "unknown";
// };

// export const getQuestionTitle = (type) => {
//   const titles = {
//     ra: "Read Aloud",
//     rs: "Repeat Sentence",
//     di: "Describe Image",
//     rl: "Retell Lecture",
//     asq: "Answer Short Question",
//     we: "Write Essay",
//     swt: "Summarize Written Text",
//     sst: "Summarize Spoken Text",
//     ro: "Re-order Paragraphs",
//     rfib: "Reading: Fill in the Blanks",
//     rwfib: "Reading & Writing: Fill in the Blanks",
//     rmcsa: "Multiple Choice, Single Answer",
//     rmcma: "Multiple Choice, Multiple Answer",
//     lfib: "Listening: Fill in the Blanks",
//     lmcsa: "Listening: Multiple Choice, Single Answer",
//     lmcma: "Listening: Multiple Choice, Multiple Answer",
//     hcs: "Highlight Correct Summary",
//     hiw: "Highlight Incorrect Words",
//     wfd: "Write From Dictation",
//   };
//   return titles[type] || "Unknown Question Type";
// };

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

  // Reading backend aliases
  FIB_R: "fib_r",
  FIB_RW: "fib_rw",
  MCS_R: "mcs_r",
  MCM_R: "mcm_r",

  // Listening
  LFIB: "lfib",
  LMCSA: "lmcsa",
  LMCMA: "lmcma",
  HCS: "hcs",
  HIW: "hiw",
  WFD: "wfd",
  SMW: "smw",

  // Listening backend aliases
  FIB_L: "fib_l",
  MCS_L: "mcs_l",
  MCM_L: "mcm_l",
};

export const SPEAKING_TYPES = ["ra", "rs", "di", "rl", "asq", "sgd", "rts"];

export const WRITING_TYPES = ["we", "swt", "sst"];

export const READING_TYPES = [
  "ro",
  "rfib",
  "rwfib",
  "rmcsa",
  "rmcma",
  "fib_r",
  "fib_rw",
  "mcs_r",
  "mcm_r",
];

export const LISTENING_TYPES = [
  "lfib",
  "lmcsa",
  "lmcma",
  "hcs",
  "hiw",
  "wfd",
  "smw",
  "fib_l",
  "mcs_l",
  "mcm_l",
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
  "smw",
  "fib_l",
  "mcs_l",
  "mcm_l",
];

/**
 * Normalize backend question types into frontend-supported canonical types.
 */
export const normalizeQuestionType = (type: string) => {
  const typeMap: Record<string, string> = {
    // Reading
    fib_r: "fib_r",
    fib_rw: "rwfib",
    mcs_r: "rmcsa",
    mcm_r: "rmcma",

    // Listening
    fib_l: "lfib",
    mcs_l: "lmcsa",
    mcm_l: "lmcma",

    // Already canonical / supported directly
    ra: "ra",
    rs: "rs",
    di: "di",
    rl: "rl",
    asq: "asq",
    we: "we",
    swt: "swt",
    sst: "sst",
    ro: "ro",
    rfib: "fib_r",
    rwfib: "rwfib",
    rmcsa: "rmcsa",
    rmcma: "rmcma",
    lfib: "fib_l",
    lmcsa: "lmcsa",
    lmcma: "lmcma",
    hcs: "hcs",
    hiw: "hiw",
    wfd: "wfd",
    smw: "smw",
    sgd: "sgd",
    rts: "rts",
  };

  return typeMap[type] || type;
};

export const getQuestionCategory = (type: string) => {
  const normalizedType = normalizeQuestionType(type);

  if (SPEAKING_TYPES.includes(normalizedType)) return "speaking";
  if (WRITING_TYPES.includes(normalizedType)) return "writing";
  if (READING_TYPES.includes(type) || READING_TYPES.includes(normalizedType))
    return "reading";
  if (
    LISTENING_TYPES.includes(type) ||
    LISTENING_TYPES.includes(normalizedType)
  )
    return "listening";

  return "unknown";
};

export const getQuestionTitle = (type: string) => {
  const normalizedType = normalizeQuestionType(type);

  const titles: Record<string, string> = {
    // Speaking
    ra: "Read Aloud",
    rs: "Repeat Sentence",
    di: "Describe Image",
    rl: "Retell Lecture",
    asq: "Answer Short Question",
    sgd: "Summarize Group Discussion",
    rts: "Respond to Situation",
    // Writing
    we: "Write Essay",
    swt: "Summarize Written Text",
    sst: "Summarize Spoken Text",

    // Reading
    ro: "Re-order Paragraphs",
    fib_r: "Reading: Fill in the Blanks",
    rwfib: "Reading & Writing: Fill in the Blanks",
    rmcsa: "Reading: Multiple Choice, Single Answer",
    rmcma: "Reading: Multiple Choice, Multiple Answer",

    // Listening
    lfib: "Listening: Fill in the Blanks",
    lmcsa: "Listening: Multiple Choice, Single Answer",
    lmcma: "Listening: Multiple Choice, Multiple Answer",
    hcs: "Highlight Correct Summary",
    hiw: "Highlight Incorrect Words",
    wfd: "Write From Dictation",
    smw: "Select Missing Word",
  };

  return titles[normalizedType] || "Unknown Question Type";
};
