export interface ScheduleResponse {
  weekday_name: string;
  weekday_number: number;
  tasks: [
    {
      id: string;
      name: string;
    },
    {
      id: string;
      name: string;
    },
  ];
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

export type QuestionType =
  | "ra"
  | "rs"
  | "di"
  | "rl"
  | "fib_r"
  | "fib_rw"
  | "sst"
  | "fib_l"
  | "hiw"
  | "wfd"
  | "we"
  | "swt"
  | string;

export interface Task {
  id: number;
  title: string;
  question_type: QuestionType;
  duration: number;
  length: number;
  count: number;
}

export interface TaskData {}

export interface DailyTasksResponse {
  pagination: Pagination;
  tasks: Task[];
}
export interface Collection {
  id: string;
  index: number;
  created_at: Date;
  updated_at: Date;
  collection_id: number;
  published: boolean;
  title: string;
  question_type: string;
  length: number;
  duration: number;
}
export interface QuestionContent {
  text: string;
}
interface RepeatSentence {
  script: string;
}

export interface QuestionItem {
  id: string;
  index: number;

  type: string;

  data: QuestionContent | string;

  extra: Record<string, unknown> | string | RepeatSentence;

  created_at: string;
  sNo?: number;
}

export interface MockTestResponse {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  tests: MockTestInterface[];
}

export interface MockTestInterface {
  id: string;
  title: string;
  index: number;
  published: boolean;
  created_at: string;
  total_sections: number;
  total_questions: number;
  total_duration: number;
  sections: Section[];
}

export interface Section {
  id: string;
  title: string;
  type: string;
  questions_count: number;
  duration: number;
}

export interface RequestAssignmentResponse {
  type: string;
  collection: string;
  assigned_task_id: string;
}
