import type { Metadata } from "next";
import CartView from "@/components/shop/CartView";

export const metadata: Metadata = {
  title: "Panier",
  description: "Votre sélection Nova Cavalia.",
  robots: { index: false, follow: true },
};

export default function PanierPage() {
  return <CartView />;
}
