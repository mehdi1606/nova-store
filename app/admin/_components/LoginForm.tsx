"use client";

/**
 * LoginForm — uses a Server Action via useActionState (React 19).
 *
 * Why a Server Action instead of the previous browser-client approach:
 *
 * The old flow was:
 *   1. Browser calls signInWithPassword → Supabase writes cookies via document.cookie
 *   2. window.location.assign("/admin") fires immediately
 *   3. Middleware reads request.cookies — sometimes sees nothing (race condition)
 *   4. Middleware redirects back to /admin/login → infinite loop
 *
 * The new flow:
 *   1. Server Action calls signInWithPassword server-side
 *   2. Supabase calls setAll() → Next.js writes cookies into the HTTP *response*
 *   3. Browser receives the response with Set-Cookie headers already committed
 *   4. Next.js calls redirect("/admin") from the Server Action
 *   5. The browser's GET /admin carries the session cookies — middleware sees them
 *
 * No window.location, no router.push, no race condition.
 */

import { useActionState } from "react";
import { loginAction } from "@/app/admin/login/actions";
import { IconArrowRight } from "@/components/Icons";

const initialState = { error: null };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="label-xs text-ink/55">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 w-full border-b border-ink/20 bg-transparent pb-2 text-ink focus:border-ink focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="password" className="label-xs text-ink/55">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full border-b border-ink/20 bg-transparent pb-2 text-ink focus:border-ink focus:outline-none"
        />
      </div>

      {state.error && (
        <p className="text-sm text-leather">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group flex w-full items-center justify-center gap-2.5 rounded-[2px] bg-ink py-3.5 label text-paper transition-colors hover:bg-ink-deep disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Se connecter"}
        <IconArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
      </button>
    </form>
  );
}
