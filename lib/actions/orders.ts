"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { OrderInput } from "@/lib/orders";

/**
 * Persist a cash-on-delivery order to the platform. The WhatsApp hand-off
 * happens on the client regardless — if Supabase isn't configured we simply
 * skip the save and report success, so ordering never breaks.
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
