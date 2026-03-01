import { NextResponse } from "next/server";
import { verifyCodeUseCase } from "@/modules/auth/application/verifyCode.usecase";
import { logToSentinel } from "@/lib/sentinel";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await verifyCodeUseCase(body);

    await logToSentinel(request, {
      action: "verify_code",
      email: body.email,
      success: true,
    });

    return NextResponse.json({ success: true, resetToken: result.resetToken }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
