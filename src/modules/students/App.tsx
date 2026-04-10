import { BrowserRouter, Routes, Route } from "react-router";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ApplicationBody from "../common/body/body";
import Dashboard from "@students/dashboard/dashboard";
import StudentTaskView from "./components/student-task-view";
import StudentMockTestView from "./components/student-mock-test-view";
import LabVideos from "../admin/lab-videos/lab-videos";
import StudentDailyTasks from "./components/student-daily-tasks";
import StudentSchedule from "./components/student-schedule";
import StudentMockTests from "./components/student-mock-tests";
import StudentVideos from "./components/student-videos";
import Login from "../common/pages/login";
import { PortalTypes } from "@/utils/model/common-enums";
import StudentDailyTaskReview from "@/pte-test-players/student-response-components/StudentDailyTaskReview";
import WatchVideoPage from "../common/videoPlayer/WatchVideoPage";
import ProtectedRoute from "../common/ProtectedRoute";
import NotFound from "../common/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            lineWidth: 2,
          },
          components: {
            Input: {
              activeShadow: `0 0 6px rgba(100, 92, 204, 0.4)`,
              hoverBorderColor: "#645CCC",
              activeBorderColor: "#645CCC",
            },
          },
        }}
      >
        <div className="min-h-full">
          <BrowserRouter>
            <Routes>
              // Public routes
              <Route
                path="/"
                element={<Login portal={PortalTypes.STUDENT} />}
              />
              <Route path="/unauthorized" element={<NotFound />} />
              // Protected routes for students
              {/* <Route element={<ProtectedRoute portal="student" />}> */}
              <Route element={<ApplicationBody />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/take-task/:id" element={<StudentTaskView />} />
                <Route
                  path="/mock-test/:id"
                  element={<StudentMockTestView />}
                />
                <Route path="/video/:id" element={<LabVideos />} />
                <Route path="/watch-video/:id" element={<WatchVideoPage />} />
                <Route path="/daily-tasks" element={<StudentDailyTasks />} />
                <Route path="/schedule" element={<StudentSchedule />} />
                <Route path="/mock-tests" element={<StudentMockTests />} />
                <Route path="/videos" element={<StudentVideos />} />
                <Route
                  path="/daily-task-review/:dts_id"
                  element={<StudentDailyTaskReview />}
                />
              </Route>
              {/* </Route> */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
