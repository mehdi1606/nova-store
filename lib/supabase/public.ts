import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

/**
 * Cookie-less anon client for PUBLIC reads/writes (catalogue overrides, contact
 * + newsletter inserts). It never touches auth cookies, so pages that use it can
 * still be statically generated / ISR-cached. Row-Level Security governs what it
 * may do (public read of products, anonymous insert of leads).
 */
export function createPublicClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
