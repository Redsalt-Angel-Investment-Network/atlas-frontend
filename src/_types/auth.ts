import { WorkspaceMemberType } from "./workspaceMembers";

export type RegisterPayload = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirmation: string;
};

export type UserType = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
};

export type RegisterResponse = {
  user: UserType;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LogoutPayload = {
  refresh: string;
};

export type LoginResponse = {
  access: string;
  refresh: string;
  user: UserType;
  memberships: WorkspaceMemberType[];
};

export type AuthContextType = {
  user: UserType | null;
  accessToken: string | null;
  refreshToken: string | null;
  memberships: WorkspaceMemberType[];
  currentMembership: WorkspaceMemberType | null;

  isAuthenticated: boolean;
  isLoading: boolean;

  login: (data: LoginResponse) => void;
  logout: () => void;

  setMemberships: (memberships: WorkspaceMemberType[]) => void;
  switchWorkspace: (Id: string) => void;
};

export type AuthState = {
  user: UserType | null;
  accessToken: string | null;
  refreshToken: string | null;
  memberships: WorkspaceMemberType[];
};