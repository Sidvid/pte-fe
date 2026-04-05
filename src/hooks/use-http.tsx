import { STORAGE_KEYS } from "@/utils/constants/app-constants";
import apiClient from "@/utils/helpers/interceptor";

export const URLS = {
  // Admin routes
  adminLogin: "api/auth/login",
  uploadAudio: "/api/auth/audio-upload",
  schdule: "api/admin/weekly-schedules",
  allDailyTask: "api/admin/daily-tasks",
  allMockTests: "api/admin/mock-tests",
  addNewQuestion: "api/admin/questions",
  deleteQuestion: "api/admin/questions",
  getAllStudents: "api/admin/students",
  getQuestionsFromTask: "api/admin",
  adminDashboard: "api/admin/dashboard",
  getStudentById: "api/admin/student",
  updateStudent: "api/admin/student",
  studentAttendanceHistory: "api/admin/attendance/student",
  studentPerformance: "api/admin/student",
  changePassword: "api/auth/change-password",
  activateStudentWithImage: "api/admin/student/activate",
  registerUser: "api/auth/register",
  scheduleLabVideo: "api/admin/lab-videos/schedule",
  adminLabVideos: "api/admin/lab-videos",
  theoryVideoMappings: "api/admin/theory-videos/mappings",
  theoryVideoOptions: "api/admin/theory-videos/options/videos",
  theoryTaskOptions: "api/admin/theory-videos/options/tasks",
  addTheoryVideoMapping: "api/admin/theory-videos/mappings",
  updateTheoryVideoMapping: "api/admin/theory-videos/mappings",
  deleteTheoryVideoMapping: "api/admin/theory-videos/mappings",
  // Student routes
  requestAssignments: "api/student/request-assignment",
  theoryVideosCompletionStatus: "api/student/videos/theory/status",
  getAllTheoryVideos: "api/student/videos/theory",
  saveQuestionResponse: "api/student/question-responses",
  submitDailyTask: "/api/student/daily-tasks/submit",
  studentDashboard: "/api/student/dashboard",
  submitMockTestSection: "/api/student/mock-tests",
  getMockTestQuestions: "/api/student/mock-tests",
  dailyTaskReview: "/api/student/daily-tasks",
  studentScheduledLabVideo: "/api/student/lab-videos/today",
  startMockTestSection: "/api/student/mock-tests",
  startMockTest: "/api/student/mock-tests",
  getMockTestById: "api/student/mock-tests",
};
type Methods = "POST" | "GET" | "PUT" | "DELETE";
interface RequestProps {
  url: keyof typeof URLS;
  method: Methods;
  payload?: any;
  params?: any;
  endURL?: string;
}
const useHttp = ({ type }: { type: "auth" | "raw" }) => {
  const sendRequest = async ({
    url,
    method,
    payload,
    params,
    endURL,
  }: RequestProps) => {
    const authTokenCookie = await cookieStore.get(STORAGE_KEYS.ACCESS_TOKEN);
    const authToken = authTokenCookie?.value;
    // const authToken =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxNzRmODFkLWU2YmQtNGU5MS1iOTkyLTcwOTVjYzk2ZDQ3MSIsInVzZXJuYW1lIjoidmlrYXMiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc3NDg5NTcwMCwiZXhwIjoxNzc0OTgyMTAwfQ.pLOGSOOKw0eTrXlDIZ3AHBgsGuqJ9LUVRvHdQnvO2oM";

    try {
      const response = await apiClient({
        method,
        url: endURL ? `${URLS[url]}/${endURL}` : URLS[url],
        data: payload,

        headers: {
          ...(type === "auth" && authToken
            ? { authorization: `Bearer ${authToken}` }
            : {}),
        },
        params,
      });
      console.log("API Response:", response);
      console.log("Status:", response.status);
      console.log("Data:", response.data);

      if (response.status === 200 || response.status === 201) {
        return {
          response: response.data,
          rawResponse: response,
        };
      } else {
        console.error("API returned non-success status:", response.status);
        throw new Error(JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };
  return {
    sendRequest,
  };
};
export default useHttp;
