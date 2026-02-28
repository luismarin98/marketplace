"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PackageSearch, ShoppingCart, Minus, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IProduct } from "@/modules/product/domain/product.entity";

// Definimos una interfaz para la UI donde los ObjectId y Fechas son strings
export type ProductUI = Omit<IProduct, "_id" | "sellerId" | "createdAt" | "updatedAt"> & {
  _id: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
};

interface ProductCardProps {
  product: ProductUI;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    if (quantity < product.stock) setQuantity((q) => q + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  return (
    <Card className="flex flex-col justify-between h-full">
      <CardHeader>
        <CardTitle className="line-clamp-1 text-lg">{product.title}</CardTitle>
        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <PackageSearch className="mr-2 h-4 w-4" /> Ver Detalles
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{product.title}</DialogTitle>
              <DialogDescription>
                Detalles del producto y configuración de pedido.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                <PackageSearch className="h-16 w-16 text-muted-foreground/50" />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Descripción</h4>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <p className="text-sm font-medium">Precio Unitario</p>
                  <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Stock Disponible</p>
                  <p className="text-sm text-muted-foreground">{product.stock} unidades</p>
                </div>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-3">
               <div className="flex items-center justify-center rounded-md border p-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDecrement} disabled={quantity <= 1}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-12 text-center font-medium text-sm">{quantity}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleIncrement} disabled={quantity >= product.stock}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Button className="flex-1" onClick={() => alert(`Agregado ${quantity} ${product.title} al carrito`)}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Agregar al Carrito
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}