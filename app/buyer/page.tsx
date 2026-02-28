"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Loader2 } from "lucide-react";

export default function BuyerDashboard() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const response = await fetch('/api/orders');
          if (response.ok) {
            const data = await response.json();
            setOrders(data);
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };
      fetchOrders();
    }
  }, [user]);

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
            {orders.length === 0 ? (
              <div>
                <p className="text-sm text-muted-foreground">
                  No orders yet. Start browsing products to place your first order.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <a href="/products">Browse products</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {orders.map((order) => (
                  <div key={order._id} className="rounded-lg border p-3 text-sm">
                    <div className="flex justify-between items-center mb-2 border-b pb-2">
                      <span className="text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className="font-bold text-green-600">${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="space-y-1">
                      {order.products.map((p: any, i: number) => (
                        <div key={i} className="flex justify-between">
                          <span className="line-clamp-1 max-w-[70%]">{p.title}</span>
                          <span className="text-muted-foreground">x{p.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
