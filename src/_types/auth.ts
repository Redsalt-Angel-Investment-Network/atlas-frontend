export type RegisterPayload = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirmation: string;
};

export type RegisterResponse = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access: string;
  refresh: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
};