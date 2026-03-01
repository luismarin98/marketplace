"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/shared/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, BarChart3, Loader2, ShoppingBag, Pencil } from "lucide-react"; 
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  stock: z.coerce.number().int().min(0, "Stock can't be negative"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormDialogProps {
  children: React.ReactNode;
  productToEdit?: any;
  onProductSave: (data: ProductFormValues) => Promise<boolean>;
  isSubmitting: boolean;
}

function ProductFormDialog({ children, productToEdit, onProductSave, isSubmitting }: ProductFormDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      stock: 0,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: productToEdit?.title || "",
        description: productToEdit?.description || "",
        price: productToEdit?.price || 0,
        stock: productToEdit?.stock || 0,
      });
    }
  }, [open, productToEdit, form]);

  const onSubmit = async (data: ProductFormValues) => {
    const success = await onProductSave(data);
    if (success) {
      form.reset();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{productToEdit ? "Edit Product" : "Add a new product"}</DialogTitle>
          <DialogDescription>
            {productToEdit ? "Make changes to your product here." : "Fill in the details below to add a new product to your store."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Awesome T-Shirt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="A short description of the product" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {productToEdit ? "Save Changes" : "Save Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function SellerDashboard() {
  const { user, loading } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?._id) {
      const fetchProducts = async () => {
        try {
          const response = await fetch(`/api/products?sellerId=${user._id}`);
          if (response.ok) {
            const data = await response.json();
            setProducts(data);
          } else {
            console.error("Failed to fetch seller products");
          }
        } catch (error) {
          console.error("Error fetching seller products:", error);
        }
      };

      const fetchOrders = async () => {
        try {
          const response = await fetch(`/api/orders`);
          if (response.ok) {
            const data = await response.json();
            setOrders(data);
          }
        } catch (error) { console.error(error); }
      };

      const fetchSales = async () => {
        try {
          const response = await fetch(`/api/orders?role=seller`);
          if (response.ok) {
            const data = await response.json();
            setSales(data);
          }
        } catch (error) { console.error(error); }
      };

      fetchProducts();
      fetchOrders();
      fetchSales();
    }
  }, [user]);

  const handleSaveProduct = async (productData: ProductFormValues): Promise<boolean> => {
    if (!user) return false;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...productData, sellerId: user._id }),
      });

      if (!response.ok) throw new Error('Failed to save product');

      const newProduct = await response.json();
      setProducts((prev) => [newProduct, ...prev]);
      return true;
    } catch (error) {
      console.error(error);
      alert('There was an error saving the product.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (productId: string, productData: ProductFormValues): Promise<boolean> => {
    if (!user) return false;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...productData, sellerId: user._id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update product' }));
        throw new Error(errorData.message || 'Failed to update product');
      }

      const updatedProduct = await response.json();
      setProducts((prev) => prev.map((p) => (p._id === productId ? updatedProduct : p)));
      return true;
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'An unknown error occurred while updating the product.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcular métricas de ventas
  const totalRevenue = sales.reduce((acc, order) => {
    const orderRevenue = order.products
      .filter((p: any) => p.sellerId === user?._id)
      .reduce((sum: number, p: any) => sum + (p.price * p.quantity), 0);
    return acc + orderRevenue;
  }, 0);

  const totalItemsSold = sales.reduce((acc, order) => {
    const orderItems = order.products
      .filter((p: any) => p.sellerId === user?._id)
      .reduce((sum: number, p: any) => sum + p.quantity, 0);
    return acc + orderItems;
  }, 0);

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
            {products.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {"You haven't listed any products yet. Start by adding your first product."}
              </p>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product._id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-muted-foreground">${product.price} • Stock: {product.stock}</p>
                    </div>
                    <ProductFormDialog
                      productToEdit={product}
                      onProductSave={(data) => handleUpdateProduct(product._id, data)}
                      isSubmitting={isSubmitting}
                    >
                      <Button variant="outline" size="sm">
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    </ProductFormDialog>
                  </div>
                ))}
              </div>
            )}
            <ProductFormDialog onProductSave={handleSaveProduct} isSubmitting={isSubmitting}>
              <Button className="mt-4">Add product</Button>
            </ProductFormDialog>
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
            {sales.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Sales data will appear here once you start selling.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="rounded-lg border p-3 bg-primary/5">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Total Revenue</p>
                    <p className="text-2xl font-bold text-primary">${totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg border p-3 bg-primary/5">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Items Sold</p>
                    <p className="text-2xl font-bold text-primary">{totalItemsSold}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Recent Sales</p>
                  <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2">
                    {sales.map((sale) => (
                      <div key={sale._id} className="text-sm border-b pb-2 last:border-0">
                         <div className="flex justify-between">
                           <span className="text-muted-foreground">{new Date(sale.createdAt).toLocaleDateString()}</span>
                           <span className="font-medium text-green-600">
                             +${sale.products
                                .filter((p: any) => p.sellerId === user?._id)
                                .reduce((sum: number, p: any) => sum + (p.price * p.quantity), 0)
                                .toFixed(2)}
                           </span>
                         </div>
                         <div className="text-xs text-muted-foreground mt-1">
                            {sale.products
                              .filter((p: any) => p.sellerId === user?._id)
                              .map((p: any) => `${p.quantity}x ${p.title}`)
                              .join(", ")}
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">My Purchases</CardTitle>
              <CardDescription>History of bought items</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You haven't purchased anything yet.
              </p>
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
      </div>
    </main>
  );
}
