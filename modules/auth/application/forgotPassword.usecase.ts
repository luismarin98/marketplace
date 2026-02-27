import { UserRepository } from "@/modules/auth/infrastructure/user.repository";
import { VerificationCodeRepository } from "@/modules/auth/infrastructure/verification-code.repository";
import { sendVerificationCode, generateVerificationCode } from "@/lib/mailer";
import type { ForgotPasswordDTO } from "@/modules/auth/domain/auth.types";

const userRepo = new UserRepository();
const codeRepo = new VerificationCodeRepository();

export async function forgotPasswordUseCase(data: ForgotPasswordDTO): Promise<void> {
  if (!data.email) {
    throw new Error("Email is required");
  }

  const user = await userRepo.findByEmail(data.email);
  if (!user) {
    // Return silently to prevent email enumeration
    return;
  }

  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await codeRepo.create({
    userId: user._id.toString(),
    code,
    expiresAt,
  });

  await sendVerificationCode(user.email, code);
}
