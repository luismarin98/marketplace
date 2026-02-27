"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { SafeUser } from "@/modules/auth/domain/auth.types";

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) throw new Error("Not authenticated");
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.user as SafeUser;
  });

export function useAuth() {
  const router = useRouter();
  const { data: user, error, isLoading, mutate } = useSWR("/api/auth/me", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await mutate(undefined, { revalidate: false });
    router.push("/login");
  }, [mutate, router]);

  return {
    user: user ?? null,
    loading: isLoading,
    isAuthenticated: !!user && !error,
    role: user?.role ?? null,
    logout,
    mutate,
  };
}
