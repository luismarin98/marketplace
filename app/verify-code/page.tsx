"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { KeyRound, Loader2 } from "lucide-react";

function VerifyCodeForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  async function handleSubmit() {
    if (code.length !== 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || "Verification failed");
        return;
      }

      toast.success("Code verified! Set your new password.");
      router.push(`/reset-password?token=${encodeURIComponent(data.resetToken)}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-card-foreground">Enter verification code</CardTitle>
          <CardDescription>
            {"We sent a 6-digit code to "}
            <span className="font-medium text-foreground">{email || "your email"}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Button onClick={handleSubmit} className="w-full" disabled={loading || code.length !== 6}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify code
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {"Didn't receive a code? Check your spam folder or "}
            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={() => router.push("/forgot-password")}
            >
              try again
            </button>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default function VerifyCodePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </main>
      }
    >
      <VerifyCodeForm />
    </Suspense>
  );
}
