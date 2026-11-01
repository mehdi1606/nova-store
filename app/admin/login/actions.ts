"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_EMAIL, isOwner, isSupabaseConfigured } from "@/lib/supabase/config";

export type LoginState = {
  error: string | null;
};

/**
 * Server Action for owner login.
 *
 * Running signInWithPassword on the SERVER means that when Supabase calls
 * setAll(), Next.js writes the session cookies directly into the HTTP
 * response before the browser ever makes the next request. This eliminates
 * the race condition that existed when the browser client wrote cookies and
 * window.location.assign() fired before the browser could flush them.
 */
export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isSupabaseConfigured) {
    console.log("[loginAction] Supabase non configuré");
    return { error: "Supabase n'est pas configuré sur ce déploiement." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "E-mail et mot de passe requis." };
  }

  console.log("[loginAction] Tentative — longueur email:", email.length);

  const supabase = await createClient();

  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    // Never log the full error object — it may contain credentials
    console.log("[loginAction] Échec signInWithPassword:", signInError.message);
    return { error: "E-mail ou mot de passe incorrect." };
  }

  console.log("[loginAction] signInWithPassword OK — user présent:", Boolean(data.user?.id));
  console.log("[loginAction] Session access_token présent:", Boolean(data.session?.access_token));

  // Verify this account is the configured owner
  if (!isOwner(data.user?.email)) {
    const mask = (e: string) => e.replace(/^(.{2}).*(@.*)$/, "$1***$2");
    console.log(
      `[loginAction] Compte non autorisé — compte=${mask(data.user?.email ?? "")}` +
      ` | NEXT_PUBLIC_ADMIN_EMAIL=${mask(ADMIN_EMAIL)} (longueur ${ADMIN_EMAIL.length})`
    );
    await supabase.auth.signOut();
    return { error: "Ce compte n'est pas autorisé à accéder à l'administration." };
  }

  console.log("[loginAction] Owner confirmé → redirect /admin");
  // redirect() throws a NEXT_REDIRECT — must not be inside try/catch
  redirect("/admin");
}
