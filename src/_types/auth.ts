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

export type WorkspaceType = {
  workspace_id: string;
  workspace_name: string;
  role: string;
  is_current: boolean;
};

export type LoginResponse = {
  access: string;
  refresh: string;
  user: UserType;
  workspaces: WorkspaceType[];
};

export type AuthContextType = {
  user: UserType | null;
  accessToken: string | null;
  refreshToken: string | null;
  workspaces: WorkspaceType[];
  currentWorkspace: WorkspaceType | null;

  isAuthenticated: boolean;
  isLoading: boolean;

  login: (data: LoginResponse) => void;
  logout: () => void;

  setWorkspaces: (workspaces: WorkspaceType[]) => void;
};

export type AuthState = {
  user: UserType | null;
  accessToken: string | null;
  refreshToken: string | null;
  workspaces: WorkspaceType[];
};