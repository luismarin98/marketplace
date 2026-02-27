import jwt from "jsonwebtoken";
import type { JWTPayload } from "@/modules/auth/domain/auth.types";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Please define the JWT_SECRET environment variable");
}

export function signToken(payload: JWTPayload, expiresIn: string = "24h"): string {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET!) as JWTPayload;
}

export function signResetToken(payload: { userId: string; email: string }): string {
  return jwt.sign({ ...payload, purpose: "reset" }, JWT_SECRET!, { expiresIn: "10m" });
}

export function verifyResetToken(token: string): { userId: string; email: string; purpose: string } {
  const decoded = jwt.verify(token, JWT_SECRET!) as {
    userId: string;
    email: string;
    purpose: string;
  };
  if (decoded.purpose !== "reset") {
    throw new Error("Invalid reset token");
  }
  return decoded;
}
