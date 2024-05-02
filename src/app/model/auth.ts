export interface loginCredential {
  username: string;
  password: string;
}

export interface signupCredential {
  username: string;
  email: string;
  password: string;
  dateofbirth: Date;
}
export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  dateofbirth: string;
  isblocked: boolean;
  googleId: number;
}
interface IsAdminResponse {
  isAdmin: boolean;
}

export interface LoginResponse {
  message: string;
  token: string;
  isAdmin?: IsAdminResponse;
}
export interface SignupResponse {
  message: string;
}

export interface OtpResponse {
  message: string;
}
export interface ResendResponse {
  message: string;
}
export interface GetUsersResponse {
  message: string;
  users: User[];
}
