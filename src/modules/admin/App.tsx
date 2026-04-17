import SideMenu from "@/components/molecules/side-menu/side-menu";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import * as React from "react";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./dashboard/dashboard";
import ApplicationBody from "../common/body/body";
import LabVideos from "./lab-videos/lab-videos";
import MockTest from "./mock-test/mock-test";
import Schedule from "./schedule/schedule";
import ViewSingleMockTest from "./mock-test/view-single-mock-test";
import Login from "../common/pages/login";
import { PortalTypes } from "@/utils/model/common-enums";
import DailyTasks from "./daily-tasks/daily-tasks";
import DailyTasksCollection from "./daily-tasks/daily-task-collection";
import ViewSingleCollectionQuestions from "./daily-tasks/view-single-collection-questions";
import StudentList from "./students-feature/Student-list";
import StudentEditPage from "./students-feature/StudentEditPage";
import StudentCreatePage from "../students/components/StudentCreatePage";
import TheoryVideos from "./lab-videos/TheoryVideos";
import TheoryVideoConfigPage from "./lab-videos/TheoryVideoConfigPage";
import StudentDailyTaskReview from "@/pte-test-players/student-response-components/StudentDailyTaskReview";
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            lineWidth: 1.5,
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
              <Route path="/" element={<Login portal={PortalTypes.ADMIN} />} />{" "}
              <Route element={<ApplicationBody />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/labVideos" element={<LabVideos />} />
                {/* <Route path="/theoryVideos" element={<TheoryVideos />} /> */}
                <Route path="/mockTest" element={<MockTest />} />
                <Route path="/mockTest/:id" element={<ViewSingleMockTest />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/dailyTasks" element={<DailyTasks />} />
                <Route path="/students" element={<StudentList />} />
                <Route
                  path="/admin/student/:student_id/edit"
                  element={<StudentEditPage />}
                />
                <Route path="/add-student" element={<StudentCreatePage />} />
                <Route
                  path="/dailyTasks/:id"
                  element={<DailyTasksCollection />}
                />
                <Route
                  path="/view-single-collection-questions/:id"
                  element={<ViewSingleCollectionQuestions />}
                />
                <Route
                  path="/mock-test-review/:mts_id"
                  element={<StudentDailyTaskReview />}
                />
                <Route
                  path="/theory-videos-config"
                  element={<TheoryVideoConfigPage />}
                />
              </Route>
              <Route
                path="/login"
                element={<Login portal={PortalTypes.ADMIN} />}
              />
            </Routes>
          </BrowserRouter>
        </div>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
