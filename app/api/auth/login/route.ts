import { NextResponse } from "next/server";
import { loginUseCase } from "@/modules/auth/application/login.usecase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, user } = await loginUseCase(body);

    const response = NextResponse.json({ success: true, user }, { status: 200 });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ success: false, error: message }, { status: 401 });
  }
}
