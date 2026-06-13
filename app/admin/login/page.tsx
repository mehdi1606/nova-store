import LoginForm from "../_components/LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import HorseMark from "@/components/HorseMark";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <HorseMark className="mx-auto w-12 text-or" />
        <h1 className="mt-6 text-center font-display text-3xl font-[380] text-ink">
          Administration
        </h1>
        <p className="mt-2 text-center text-sm text-ink/55">
          Nova Cavalia — espace privé
        </p>

        {isSupabaseConfigured ? (
          <LoginForm />
        ) : (
          <p className="mt-8 rounded-[2px] border border-leather/30 bg-leather/5 p-4 text-sm text-leather">
            Supabase n&apos;est pas encore configuré. Renseignez vos clés dans{" "}
            <code className="rounded bg-ink/10 px-1">.env.local</code> puis
            relancez le serveur.
          </p>
        )}
      </div>
    </div>
  );
}
