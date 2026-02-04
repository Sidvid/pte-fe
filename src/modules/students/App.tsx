import SideMenu from "@/components/molecules/side-menu/side-menu";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import * as React from "react";
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
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route element={<ApplicationBody />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route 
                  path="/take-task/:id" 
                  element={<StudentTaskView />} 
                />
                <Route 
                  path="/mock-test/:id" 
                  element={<StudentMockTestView />} 
                />
                <Route 
                  path="/video/:id" 
                  element={<LabVideos />} 
                />
                <Route 
                  path="/daily-tasks" 
                  element={<StudentDailyTasks />} 
                />
                <Route 
                  path="/schedule" 
                  element={<StudentSchedule />} 
                />
                <Route 
                  path="/mock-tests" 
                  element={<StudentMockTests />} 
                />
                <Route 
                  path="/videos" 
                  element={<StudentVideos />} 
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
