import SideMenu from "@/components/molecules/side-menu/side-menu";
import { BrowserRouter, Routes, Route } from "react-router";
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
              <Route element={<ApplicationBody />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/labVideos" element={<LabVideos />} />
                <Route path="/mockTest" element={<MockTest />} />
                <Route path="/mockTest/:id" element={<ViewSingleMockTest />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/dailyTasks" element={<DailyTasks />} />
                <Route
                  path="/dailyTasks/:id"
                  element={<DailyTasksCollection />}
                />
                <Route
                  path="/view-single-collection-questions/:id"
                  element={<ViewSingleCollectionQuestions />}
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
