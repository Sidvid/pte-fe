import { STORAGE_KEYS } from "@/utils/constants/app-constants";
import apiClient from "@/utils/helpers/interceptor";

export const URLS = {
  adminLogin: "api/auth/login",
  schdule: "api/admin/weekly-schedules",
  allDailyTask: "api/admin/daily-tasks",
  addNewQuestion: "api/admin/questions",
  deleteQuestion: "api/admin/questions",
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
