"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { buildWhatsAppMessage, type OrderInput } from "@/lib/orders";

/**
 * Push the order straight to the maison's WhatsApp via CallMeBot — a free
 * service that delivers messages to a number that has authorised it once. This
 * runs on the server the moment an order is placed, so the owner is notified
 * automatically, without depending on the customer pressing "send".
 *
 * Best-effort: any failure here is swallowed — the order is still saved to the
 * dashboard, which remains the source of truth. Requires:
 *   NEXT_PUBLIC_WHATSAPP_NUMBER  (the owner's number, digits)
 *   CALLMEBOT_APIKEY             (from the one-time CallMeBot activation)
 */
async function notifyOwner(order: OrderInput): Promise<void> {
  const phone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(
    /[^\d]/g,
    "",
  );
  const apikey = process.env.CALLMEBOT_APIKEY ?? "";
  if (!phone || !apikey) return;

  const url =
    `https://api.callmebot.com/whatsapp.php?phone=${phone}` +
    `&text=${encodeURIComponent(buildWhatsAppMessage(order))}` +
    `&apikey=${encodeURIComponent(apikey)}`;

  try {
    await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
  } catch {
    /* best-effort notification */
  }
}

/**
 * Store a cash-on-delivery order and notify the owner. The notification and the
 * save are independent — either can fail without breaking the other.
 */
export async function placeOrder(input: OrderInput): Promise<{ ok: boolean }> {
  if (
    !input?.customer_name?.trim() ||
    !input?.phone?.trim() ||
    !input?.address?.trim() ||
    !input?.items?.length
  ) {
    return { ok: false };
  }

  // Send it directly to the owner's WhatsApp, automatically.
  await notifyOwner(input);

  if (!isSupabaseConfigured) return { ok: true };

  try {
    const { createPublicClient } = await import("@/lib/supabase/public");
    const supabase = createPublicClient();
    const { error } = await supabase.from("orders").insert({
      reference: input.reference,
      customer_name: input.customer_name.trim(),
      phone: input.phone.trim(),
      city: input.city?.trim() || null,
      address: input.address.trim(),
      note: input.note?.trim() || null,
      items: input.items,
      subtotal: input.subtotal,
      status: "nouvelle",
    });
    return { ok: !error };
  } catch {
    return { ok: false };
  }
}
