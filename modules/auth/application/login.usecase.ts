import { UserRepository } from "@/modules/auth/infrastructure/user.repository";
import { comparePassword } from "@/lib/password";
import { signToken } from "@/lib/jwt";
import type { LoginDTO, SafeUser, JWTPayload } from "@/modules/auth/domain/auth.types";

const userRepo = new UserRepository();

export async function loginUseCase(
  data: LoginDTO
): Promise<{ token: string; user: SafeUser }> {
  if (!data.email || !data.password) {
    throw new Error("Email and password are required");
  }

  const user = await userRepo.findByEmail(data.email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await comparePassword(data.password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const payload: JWTPayload = {
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
  };

  const token = signToken(payload);

  return {
    token,
    user: {
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      birthDate: user.birthDate.toISOString(),
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    },
  };
}
