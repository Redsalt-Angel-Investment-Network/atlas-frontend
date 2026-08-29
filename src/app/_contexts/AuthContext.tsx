"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useEffect } from "react";
import { parseCookies, setCookie, destroyCookie } from "nookies";

import {
  AuthContextType,
  AuthState,
  LoginResponse,
  UserType,
} from "@/_types/auth";
import { WorkspaceMemberType } from "@/_types/workspaceMembers";

const INITIAL_STATE: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  memberships: [],
};

export const cookieOptions = {
  maxAge: 30 * 24 * 60 * 60, // 30 days
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cookies = parseCookies();

    if (cookies.userData && cookies.accessToken) {
      try {
        const user: UserType = JSON.parse(cookies.userData);

        const memberships: WorkspaceMemberType[] = cookies.memberships
          ? JSON.parse(cookies.memberships)
          : [];

        setAuthState({
          user,
          accessToken: cookies.accessToken,
          refreshToken: cookies.refreshToken || null,
          memberships,
        });
      } catch (err) {
        console.error("Failed to parse auth cookies", err);
      }
    }

    setIsLoading(false);
  }, []);

  const currentMembership =
    authState.memberships.find(
      (workspace) => workspace.is_current,
    ) ?? null;

  const login = (data: LoginResponse) => {
    const { user, access, refresh, memberships } = data;

    setAuthState({
      user,
      accessToken: access,
      refreshToken: refresh,
      memberships,
    });

    setCookie(null, "userData", JSON.stringify(user), cookieOptions);
    setCookie(null, "memberships", JSON.stringify(memberships), cookieOptions);
    setCookie(null, "accessToken", access, cookieOptions);
    setCookie(null, "refreshToken", refresh, cookieOptions);
  };

  const setMemberships = (memberships: WorkspaceMemberType[]) => {
    setAuthState((previousState) => ({
      ...previousState,
      memberships,
    }));

    setCookie(
      null,
      "memberships",
      JSON.stringify(memberships),
      cookieOptions,
    );
  };

  const switchWorkspace = (membershipId: string) => {
    const updatedMemberships = authState.memberships.map(
      (workspace) => ({
        ...workspace,
        is_current: workspace.id === membershipId,
      }),
    );

    setAuthState((previousState) => ({
      ...previousState,
      memberships: updatedMemberships,
    }));

    setCookie(
      null,
      "memberships",
      JSON.stringify(updatedMemberships),
      cookieOptions,
    );
  };

  const logout = () => {
    destroyCookie(null, "userData", { path: "/" });
    destroyCookie(null, "accessToken", { path: "/" });
    destroyCookie(null, "refreshToken", { path: "/" });
    destroyCookie(null, "memberships", { path: "/" });

    setAuthState(INITIAL_STATE);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        currentMembership,
        isAuthenticated: !!authState.accessToken,
        isLoading,
        login,
        logout,
        setMemberships,
        switchWorkspace,
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