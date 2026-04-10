// src/hooks/useAuth.ts
import { cookieUtils, STORAGE_KEYS } from "@/utils/helpers/cookies";
import { useState, useEffect } from "react";
// import { cookieUtils, STORAGE_KEYS } from "../utils/cookies";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userPortal: "student" | "admin" | null;
  user: any;
}

export const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userPortal: null,
    user: null,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      // Get token from cookie
      const authToken = cookieUtils.get(STORAGE_KEYS.ACCESS_TOKEN);
      const userPortal = cookieUtils.get(STORAGE_KEYS.USER_PORTAL) as
        | "student"
        | "admin"
        | null;
      const userData = cookieUtils.getJSON(STORAGE_KEYS.USER_DATA);

      if (authToken && userPortal) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          userPortal,
          user: userData,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: true,
          userPortal: null,
          user: null,
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        userPortal: null,
        user: null,
      });
    }
  };

  return authState;
};
