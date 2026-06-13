"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { IconArrowRight } from "@/components/Icons";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("E-mail ou mot de passe incorrect.");
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="label-xs text-ink/55">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border-b border-ink/20 bg-transparent pb-2 text-ink focus:border-ink focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="password" className="label-xs text-ink/55">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full border-b border-ink/20 bg-transparent pb-2 text-ink focus:border-ink focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-leather">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="group flex w-full items-center justify-center gap-2.5 rounded-[2px] bg-ink py-3.5 label text-paper transition-colors hover:bg-ink-deep disabled:opacity-60"
      >
        {loading ? "Connexion…" : "Se connecter"}
        <IconArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
      </button>
    </form>
  );
}
