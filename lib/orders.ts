import { formatMAD } from "@/lib/utils";

/** Free delivery threshold, in MAD. */
export const FREE_SHIPPING = 800;

export type OrderItem = {
  slug: string;
  name: string;
  qty: number;
  price: number;
  fit?: string;
  size?: string;
  color?: string;
};

export type OrderInput = {
  reference: string;
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  note?: string;
  items: OrderItem[];
  subtotal: number;
  promo_code?: string | null;
  discount?: number;
};

export type PromoKind = "percent" | "fixed";

/** Discount in MAD for a subtotal, capped so the total never goes below 0. */
export function promoDiscount(
  subtotal: number,
  kind: PromoKind,
  value: number,
): number {
  if (!value || value <= 0) return 0;
  const raw = kind === "percent" ? Math.round((subtotal * value) / 100) : value;
  return Math.max(0, Math.min(raw, subtotal));
}

/** Short, human-friendly order reference, e.g. "NC-7Q4K". */
export function makeOrderRef(): string {
  const s = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "");
  return `NC-${(s + "0000").slice(0, 4)}`;
}

/** The pre-filled WhatsApp message the customer sends to the maison. */
export function buildWhatsAppMessage(o: OrderInput): string {
  const lines: string[] = [
    "Bonjour Nova Cavalia 🐎",
    `Nouvelle commande ${o.reference} — paiement à la livraison`,
    "",
    `👤 ${o.customer_name}`,
    `📞 ${o.phone}`,
    `📍 ${[o.city, o.address].filter(Boolean).join(" — ")}`,
    "",
    "🛒 Articles :",
  ];
  for (const it of o.items) {
    const variant = [it.color, it.fit, it.size].filter(Boolean).join(" · ");
    lines.push(
      `• ${it.name}${variant ? ` (${variant})` : ""} ×${it.qty} — ${formatMAD(
        it.price * it.qty,
      )}`,
    );
  }
  lines.push("");
  const discount = o.discount ?? 0;
  const total = o.subtotal - discount;
  if (discount > 0) {
    lines.push(`Sous-total : ${formatMAD(o.subtotal)}`);
    const label = o.promo_code ? `Remise (${o.promo_code})` : "Remise";
    lines.push(`${label} : -${formatMAD(discount)}`);
  }
  lines.push(`Total : ${formatMAD(total)}`);
  lines.push(
    total >= FREE_SHIPPING ? "Livraison : offerte" : "Livraison : à confirmer",
  );
  if (o.note?.trim()) {
    lines.push("");
    lines.push(`📝 ${o.note.trim()}`);
  }
  return lines.join("\n");
}

/** A wa.me deep link for the given number (any format) + order. Empty → null. */
export function whatsappHref(number: string, o: OrderInput): string | null {
  const digits = (number ?? "").replace(/[^\d]/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(
    buildWhatsAppMessage(o),
  )}`;
}
