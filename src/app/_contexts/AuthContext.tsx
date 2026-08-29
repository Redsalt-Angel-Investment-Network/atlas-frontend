"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { loginApi } from "@/app/(auth)/index";
import { AuthContextType, AuthState, LoginPayload, LoginResponse, UserType, WorkspaceType } from "@/_types/auth";
import { useEffect } from "react";
import { parseCookies, setCookie, destroyCookie } from "nookies";


/* ================= CONFIG ================= */

const INITIAL_STATE: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  workspaces: [],
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

        const workspaces: WorkspaceType[] = cookies.workspaces
          ? JSON.parse(cookies.workspaces)
          : [];

        setAuthState({
          user,
          accessToken: cookies.accessToken,
          refreshToken: cookies.refreshToken || null,
          workspaces,
        });
      } catch (err) {
        console.error("Failed to parse auth cookies", err);
      }
    }

    setIsLoading(false);
  }, []);

  /* ========== ACTIONS ========== */

  const currentWorkspace =
    authState.workspaces.find(
      (workspace) => workspace.is_current,
    ) ?? null;

  const login = (data: LoginResponse) => {
    const { user, access, refresh, workspaces } = data;

    setAuthState({
      user,
      accessToken: access,
      refreshToken: refresh,
      workspaces,
    });

    setCookie(null, "userData", JSON.stringify(user), cookieOptions);
    setCookie(null, "workspaces", JSON.stringify(workspaces), cookieOptions);
    setCookie(null, "accessToken", access, cookieOptions);
    setCookie(null, "refreshToken", refresh, cookieOptions);
  };

  const setWorkspaces = (workspaces: WorkspaceType[]) => {
    setAuthState((previousState) => ({
      ...previousState,
      workspaces,
    }));

    setCookie(
      null,
      "workspaces",
      JSON.stringify(workspaces),
      cookieOptions,
    );
  };

  const logout = () => {
    destroyCookie(null, "userData", { path: "/" });
    destroyCookie(null, "accessToken", { path: "/" });
    destroyCookie(null, "refreshToken", { path: "/" });
    destroyCookie(null, "workspaces", { path: "/" });

    setAuthState(INITIAL_STATE);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        currentWorkspace,
        isAuthenticated: !!authState.accessToken,
        isLoading,
        login,
        logout,
        setWorkspaces,
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