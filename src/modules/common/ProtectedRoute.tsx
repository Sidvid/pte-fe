// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  portal: "student" | "admin";
}

const ProtectedRoute = ({ portal }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, userPortal } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if user is accessing correct portal
  if (userPortal !== portal) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
