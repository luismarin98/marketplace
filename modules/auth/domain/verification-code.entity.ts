import type { ObjectId } from "mongodb";

export interface IVerificationCode {
  _id: ObjectId;
  userId: ObjectId;
  code: string;
  expiresAt: Date;
  used: boolean;
}

export const VERIFICATION_CODES_COLLECTION = "verification_codes";
