import { UserRepository } from "@/modules/auth/infrastructure/user.repository";
import { hashPassword, validatePasswordStrength } from "@/lib/password";
import { verifyResetToken } from "@/lib/jwt";
import type { ResetPasswordDTO } from "@/modules/auth/domain/auth.types";

const userRepo = new UserRepository();

export async function resetPasswordUseCase(data: ResetPasswordDTO): Promise<void> {
  if (!data.token || !data.password || !data.confirmPassword) {
    throw new Error("All fields are required");
  }

  if (data.password !== data.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const passwordValidation = validatePasswordStrength(data.password);
  if (!passwordValidation.valid) {
    throw new Error(passwordValidation.errors.join(". "));
  }

  // Verify the reset token
  let decoded;
  try {
    decoded = verifyResetToken(data.token);
  } catch {
    throw new Error("Invalid or expired reset token. Please request a new verification code.");
  }

  // Update the password
  const hashedPassword = await hashPassword(data.password);
  await userRepo.updatePassword(decoded.userId, hashedPassword);
}
