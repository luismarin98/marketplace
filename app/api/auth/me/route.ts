import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { UserRepository } from "@/modules/auth/infrastructure/user.repository";
import { logToSentinel } from "@/lib/sentinel";

const userRepo = new UserRepository();

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    const user = await userRepo.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    await logToSentinel(request, {
      action: "get_me",
      userId: user._id.toString(),
      role: user.role,
    });

    return NextResponse.json({
      success: true,
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
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid token" },
      { status: 401 }
    );
  }
}
