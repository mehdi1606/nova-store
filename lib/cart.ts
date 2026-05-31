"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ImageKey } from "@/lib/images";

export type CartItem = {
  id: string; // slug + variant signature
  slug: string;
  name: string;
  price: number;
  qty: number;
  image: ImageKey;
  fit?: string;
  size?: string;
  color: string;
  href: string;
};

type CartState = {
  items: CartItem[];
  open: boolean;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      open: false,
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === item.id);
          const items = existing
            ? s.items.map((i) =>
                i.id === item.id ? { ...i, qty: i.qty + qty } : i,
              )
            : [...s.items, { ...item, qty }];
          return { items, open: true };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
      setOpen: (open) => set({ open }),
    }),
    { name: "nova-cavalia-cart", partialize: (s) => ({ items: s.items }) },
  ),
);

export const cartCount = (items: CartItem[]) =>
  items.reduce((n, i) => n + i.qty, 0);
export const cartSubtotal = (items: CartItem[]) =>
  items.reduce((n, i) => n + i.qty * i.price, 0);
