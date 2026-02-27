"use client";

import { useAuth } from "@/shared/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, BarChart3, Loader2 } from "lucide-react";

export default function SellerDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome, {user?.firstName}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Your seller dashboard - manage your products and orders
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">My Products</CardTitle>
              <CardDescription>Manage your product listings</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {"You haven't listed any products yet. Start by adding your first product."}
            </p>
            <Button className="mt-4">Add product</Button>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Sales Overview</CardTitle>
              <CardDescription>Your sales at a glance</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sales data will appear here once you start selling.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
