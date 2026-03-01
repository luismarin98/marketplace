import { NextResponse } from "next/server";
import { logToSentinel } from "@/lib/sentinel";

export async function POST(request: Request) {
  await logToSentinel(request, {
    action: "logout",
    success: true,
  });

  const response = NextResponse.json(
    { success: true, message: "Logged out successfully" },
    { status: 200 }
  );

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
