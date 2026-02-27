"use client";

import { useAuth } from "@/shared/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Loader2 } from "lucide-react";

export default function BuyerDashboard() {
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
          Your buyer dashboard - browse and manage your orders
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">My Orders</CardTitle>
              <CardDescription>View your order history</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No orders yet. Start browsing products to place your first order.
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <a href="/products">Browse products</a>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Cart</CardTitle>
              <CardDescription>Items in your cart</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your cart is empty. Add items to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
