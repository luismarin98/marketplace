export enum UserRole {
  BUYER = "buyer",
  SELLER = "seller",
}

export interface RegisterDTO {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  birthDate: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface VerifyCodeDTO {
  email: string;
  code: string;
}

export interface ResetPasswordDTO {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface JWTPayload {
  userId: string;
  role: UserRole;
  email: string;
}

export interface SafeUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  birthDate: string;
  role: UserRole;
  createdAt: string;
}
