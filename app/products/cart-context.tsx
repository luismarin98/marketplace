// c:\Users\luismarin\Documents\ProyectoNewman2\app\products\cart-context.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import { IProduct } from "@/modules/product/domain/product.entity";

// Defined here to be shared and avoid circular dependencies
export type ProductUI = Omit<IProduct, "_id" | "sellerId" | "createdAt" | "updatedAt"> & {
  _id: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
};

export interface CartItem extends ProductUI {
  cartQuantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: ProductUI, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: ProductUI, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        // Update quantity if already in cart
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, cartQuantity: item.cartQuantity + quantity }
            : item
        );
      }
      // Add new item
      return [...prev, { ...product, cartQuantity: quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((acc, item) => acc + item.price * item.cartQuantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
