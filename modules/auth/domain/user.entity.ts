import type { ObjectId } from "mongodb";
import type { UserRole } from "./auth.types";

export interface IUser {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  birthDate: Date;
  role: UserRole;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export const USERS_COLLECTION = "users";
