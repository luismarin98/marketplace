import { NextResponse } from "next/server";
import { registerUseCase } from "@/modules/auth/application/register.usecase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await registerUseCase(body);
    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
