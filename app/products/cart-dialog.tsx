// c:\Users\luismarin\Documents\ProyectoNewman2\app\products\cart-dialog.tsx
"use client";

import { useState } from "react";
import { ShoppingCart, Trash2, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { useCart } from "./cart-context";
import { useRouter } from "next/navigation";

export function CartDialog() {
  const { items, removeFromCart, clearCart, total } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsProcessing(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error("Error al procesar el pago");
      }

      // Éxito
      clearCart();
      setIsOpen(false);
      router.refresh(); // Recarga la página para ver el stock actualizado
      alert("¡Compra realizada con éxito!");
    } catch (error) {
      console.error(error);
      alert("Hubo un error al procesar tu compra. Inténtalo de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="relative">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Ver Carrito
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center text-white font-bold">
              {items.reduce((acc, item) => acc + item.cartQuantity, 0)}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tu Carrito de Compras</DialogTitle>
          <DialogDescription>
            Revisa los productos que has agregado antes de proceder al pago.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="mx-auto h-12 w-12 opacity-20 mb-2" />
              <p>Tu carrito está vacío.</p>
            </div>
          ) : (
            items.map((item) => (
              <Card key={item._id} className="flex flex-row items-center justify-between p-4 shadow-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold line-clamp-1">{item.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.cartQuantity} x ${item.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg">
                    ${(item.price * item.cartQuantity).toFixed(2)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeFromCart(item._id)}
                    disabled={isProcessing}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {items.length > 0 && (
          <DialogFooter className="sm:justify-between items-center gap-4 border-t pt-4">
            <div className="text-xl font-bold">Total: ${total.toFixed(2)}</div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={clearCart} disabled={isProcessing}>
                Vaciar
              </Button>
              <Button className="flex-1 sm:flex-none" onClick={handleCheckout} disabled={isProcessing}>
                {isProcessing ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                    </>
                ) : (
                    <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pagar
                    </>
                )}
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
