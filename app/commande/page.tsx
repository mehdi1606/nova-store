import type { Metadata } from "next";
import Checkout from "@/components/shop/Checkout";

export const metadata: Metadata = {
  title: "Commande",
  description: "Paiement à la livraison, confirmation sur WhatsApp.",
  robots: { index: false, follow: true },
};

export default function CommandePage() {
  return <Checkout />;
}
