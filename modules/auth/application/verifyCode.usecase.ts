import { UserRepository } from "@/modules/auth/infrastructure/user.repository";
import { VerificationCodeRepository } from "@/modules/auth/infrastructure/verification-code.repository";
import { signResetToken } from "@/lib/jwt";
import type { VerifyCodeDTO } from "@/modules/auth/domain/auth.types";

const userRepo = new UserRepository();
const codeRepo = new VerificationCodeRepository();

export async function verifyCodeUseCase(
  data: VerifyCodeDTO
): Promise<{ resetToken: string }> {
  if (!data.email || !data.code) {
    throw new Error("Email and code are required");
  }

  const user = await userRepo.findByEmail(data.email);
  if (!user) {
    throw new Error("Invalid verification code");
  }

  const validCode = await codeRepo.findValidCode(user._id.toString(), data.code);
  if (!validCode) {
    throw new Error("Invalid or expired verification code");
  }

  // Mark code as used
  await codeRepo.markAsUsed(validCode._id.toString());

  // Generate short-lived reset token
  const resetToken = signResetToken({
    userId: user._id.toString(),
    email: user.email,
  });

  return { resetToken };
}
