/**
 * Central Supabase configuration + a single source of truth for "is the backend
 * wired up?". Every Supabase touch-point checks `isSupabaseConfigured` first, so
 * with no keys present the whole app falls back to the static catalogue and
 * behaves exactly as it did before — nothing can break from a missing backend.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** The single owner email allowed into /admin. */
export const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "").toLowerCase();

/** The maison's WhatsApp number (any format) for cash-on-delivery orders. */
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

/** True only when the public Supabase env vars are present. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Is this email the configured owner? (If no owner is set, allow any signed-in user.) */
export function isOwner(email?: string | null): boolean {
  if (!email) return false;
  if (!ADMIN_EMAIL) return true;
  return email.toLowerCase() === ADMIN_EMAIL;
}
