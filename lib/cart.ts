"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ImageRef } from "@/lib/images";

export type CartItem = {
  id: string; // slug + variant signature
  slug: string;
  name: string;
  price: number;
  qty: number;
  image: ImageRef;
  fit?: string;
  size?: string;
  color: string;
  href: string;
};

type CartState = {
  items: CartItem[];
  open: boolean;
  /** Order-level reduction, e.g. the look bundle saving. */
  discount: number;
  discountLabel: string | null;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  setDiscount: (amount: number, label: string | null) => void;
};

// Any manual change to the cart voids a bundle discount (the exact look no
// longer holds); the customer can re-compose the look to get it back.
const NO_DISCOUNT = { discount: 0, discountLabel: null };

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      open: false,
      discount: 0,
      discountLabel: null,
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === item.id);
          const items = existing
            ? s.items.map((i) =>
                i.id === item.id ? { ...i, qty: i.qty + qty } : i,
              )
            : [...s.items, { ...item, qty }];
          return { items, open: true, ...NO_DISCOUNT };
        }),
      remove: (id) =>
        set((s) => ({
          items: s.items.filter((i) => i.id !== id),
          ...NO_DISCOUNT,
        })),
      setQty: (id, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
            .filter((i) => i.qty > 0),
          ...NO_DISCOUNT,
        })),
      clear: () => set({ items: [], ...NO_DISCOUNT }),
      setOpen: (open) => set({ open }),
      setDiscount: (amount, label) =>
        set({ discount: Math.max(0, Math.round(amount)), discountLabel: label }),
    }),
    {
      name: "nova-cavalia-cart",
      partialize: (s) => ({
        items: s.items,
        discount: s.discount,
        discountLabel: s.discountLabel,
      }),
    },
  ),
);

export const cartCount = (items: CartItem[]) =>
  items.reduce((n, i) => n + i.qty, 0);
export const cartSubtotal = (items: CartItem[]) =>
  items.reduce((n, i) => n + i.qty * i.price, 0);
