"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/types";

type CartLine = { product: Product; quantity: number };
type CartContextValue = { lines: CartLine[]; count: number; add: (product: Product) => void; remove: (id: string) => void; clear: () => void };
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const value = useMemo<CartContextValue>(() => ({
    lines,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
    add: (product) => setLines((current) => {
      const found = current.find((line) => line.product.id === product.id);
      if (product.inventory <= 0 || (found && found.quantity >= product.inventory)) return current;
      return found ? current.map((line) => line.product.id === product.id ? { ...line, quantity: Math.min(line.quantity + 1, product.inventory) } : line) : [...current, { product, quantity: 1 }];
    }),
    remove: (id) => setLines((current) => current.filter((line) => line.product.id !== id)),
    clear: () => setLines([]),
  }), [lines]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
