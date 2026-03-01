import { NextResponse } from "next/server";
import { registerUseCase } from "@/modules/auth/application/register.usecase";
import { logToSentinel } from "@/lib/sentinel";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await registerUseCase(body);

    await logToSentinel(request, {
      action: "register_user",
      email: body.email,
      role: body.role || "buyer",
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
