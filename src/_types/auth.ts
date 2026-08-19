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
};