"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export type LeadResult = { ok: boolean };

/**
 * Store a contact-form message. If Supabase isn't configured we return success
 * so the form keeps working exactly as before (the UI shows its thank-you), we
 * just don't persist anything. Anonymous insert is allowed by RLS.
 */
export async function sendContactMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<LeadResult> {
  const name = input.name?.trim();
  const email = input.email?.trim().toLowerCase();
  const message = input.message?.trim();
  if (!name || !emailRe.test(email ?? "") || (message?.length ?? 0) < 10) {
    return { ok: false };
  }
  if (!isSupabaseConfigured) return { ok: true };
  try {
    const { createPublicClient } = await import("@/lib/supabase/public");
    const supabase = createPublicClient();
    const { error } = await supabase.from("messages").insert({
      name,
      email,
      subject: input.subject?.trim() || null,
      message,
    });
    return { ok: !error };
  } catch {
    return { ok: false };
  }
}

/** Add a newsletter subscriber (idempotent — duplicates are treated as success). */
export async function subscribeEmail(emailInput: string): Promise<LeadResult> {
  const email = emailInput?.trim().toLowerCase();
  if (!emailRe.test(email ?? "")) return { ok: false };
  if (!isSupabaseConfigured) return { ok: true };
  try {
    const { createPublicClient } = await import("@/lib/supabase/public");
    const supabase = createPublicClient();
    const { error } = await supabase.from("subscribers").insert({ email });
    // 23505 = unique violation → already subscribed, which is fine.
    if (error && error.code !== "23505") return { ok: false };
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
