import { NextResponse } from "next/server";
import { resetPasswordUseCase } from "@/modules/auth/application/resetPassword.usecase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await resetPasswordUseCase(body);
    return NextResponse.json(
      { success: true, message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Password reset failed";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
