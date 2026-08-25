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

export type LoginResponse = {
  access: string;
  refresh: string;
  user: UserType;
};

export type AuthContextType = {
  user: UserType | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginResponse) => void;
  logout: () => void;
};

export type AuthState = {
  user: UserType | null;
  accessToken: string | null;
  refreshToken: string | null;
};