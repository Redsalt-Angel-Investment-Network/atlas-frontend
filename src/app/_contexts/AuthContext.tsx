"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { loginApi } from "@/app/(auth)/index";
import { AuthContextType, AuthState, LoginPayload, LoginResponse, UserType } from "@/_types/auth";
import { useEffect } from "react";
import { parseCookies, setCookie, destroyCookie } from "nookies";


/* ================= CONFIG ================= */

const INITIAL_STATE: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

export const cookieOptions = {
  maxAge: 30 * 24 * 60 * 60, // 30 days
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);

  /* ========== RESTORE FROM COOKIES ON MOUNT ========== */
  useEffect(() => {
    const cookies = parseCookies();

    if (cookies.userData && cookies.accessToken) {
      try {
        const user: UserType = JSON.parse(cookies.userData);

        setAuthState({
          user,
          accessToken: cookies.accessToken,
          refreshToken: cookies.refreshToken || null,
        });
      } catch (err) {
        console.error("Failed to parse user cookie", err);
      }
    }

    setIsLoading(false);
  }, []);

  /* ========== ACTIONS ========== */

  const login = (data: LoginResponse) => {
    const { user, access, refresh } = data;

    setAuthState({
      user,
      accessToken: access,
      refreshToken: refresh,
    });

    setCookie(null, "userData", JSON.stringify(user), cookieOptions);
    setCookie(null, "accessToken", access, cookieOptions);
    setCookie(null, "refreshToken", refresh, cookieOptions);
  };

  const logout = () => {
    destroyCookie(null, "userData", { path: "/" });
    destroyCookie(null, "accessToken", { path: "/" });
    destroyCookie(null, "refreshToken", { path: "/" });

    setAuthState(INITIAL_STATE);
  };
  return (
    <AuthContext.Provider
      value={{
        ...authState,
        isAuthenticated: !!authState.accessToken,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}