import { UserRepository } from "@/modules/auth/infrastructure/user.repository";
import { hashPassword, validatePasswordStrength } from "@/lib/password";
import type { RegisterDTO, SafeUser } from "@/modules/auth/domain/auth.types";

const userRepo = new UserRepository();

export async function registerUseCase(data: RegisterDTO): Promise<SafeUser> {
  // Validate required fields
  if (!data.firstName || !data.lastName || !data.username || !data.email || !data.birthDate || !data.role || !data.password) {
    throw new Error("All fields are required");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error("Invalid email format");
  }

  // Validate age (must be >= 18)
  const birthDate = new Date(data.birthDate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  if (age < 18) {
    throw new Error("You must be at least 18 years old to register");
  }

  // Validate password strength
  const passwordValidation = validatePasswordStrength(data.password);
  if (!passwordValidation.valid) {
    throw new Error(passwordValidation.errors.join(". "));
  }

  // Validate password match
  if (data.password !== data.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  // Check email uniqueness
  const existingEmail = await userRepo.findByEmail(data.email);
  if (existingEmail) {
    throw new Error("An account with this email already exists");
  }

  // Check username uniqueness
  const existingUsername = await userRepo.findByUsername(data.username);
  if (existingUsername) {
    throw new Error("This username is already taken");
  }

  // Hash password and create user
  const hashedPassword = await hashPassword(data.password);
  const user = await userRepo.create({
    ...data,
    password: hashedPassword,
  });

  return {
    _id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    birthDate: user.birthDate.toISOString(),
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}
