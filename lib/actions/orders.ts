"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  buildWhatsAppMessage,
  type OrderInput,
  type PromoKind,
} from "@/lib/orders";

/** Validate a promo code at checkout. Returns its kind + value, or ok:false. */
export async function applyPromo(
  code: string,
): Promise<{ ok: boolean; kind?: PromoKind; value?: number }> {
  const trimmed = (code ?? "").trim();
  if (!trimmed || !isSupabaseConfigured) return { ok: false };
  try {
    const { createPublicClient } = await import("@/lib/supabase/public");
    const supabase = createPublicClient();
    const { data, error } = await supabase.rpc("validate_promo", {
      p_code: trimmed,
    });
    const row = Array.isArray(data) ? data[0] : null;
    if (error || !row) return { ok: false };
    const kind: PromoKind = row.kind === "fixed" ? "fixed" : "percent";
    return { ok: true, kind, value: Number(row.value) || 0 };
  } catch {
    return { ok: false };
  }
}

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
      promo_code: input.promo_code?.trim() || null,
      discount: input.discount ?? 0,
      status: "nouvelle",
    });
    return { ok: !error };
  } catch {
    return { ok: false };
  }
}
