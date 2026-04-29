import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Helper to find a specific cookie by name
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  };

  // Replace "token" with the exact name of your cookie
  const isAuthenticated = !!getCookie("token");

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
