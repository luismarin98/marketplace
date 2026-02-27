import { NextResponse } from "next/server";
import { forgotPasswordUseCase } from "@/modules/auth/application/forgotPassword.usecase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await forgotPasswordUseCase(body);
    // Always return success to prevent email enumeration
    return NextResponse.json(
      { success: true, message: "If an account exists with that email, a verification code has been sent." },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
