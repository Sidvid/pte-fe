import SideMenu from "@/components/molecules/side-menu/side-menu";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import * as React from "react";
import { ConfigProvider } from "antd";
import ApplicationBody from "../common/body/body";
import Dashboard from "@students/dashboard/dashboard";

function App() {
  return (
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
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ConfigProvider>
  );
}

export default App;
