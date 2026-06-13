import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isOwner, isSupabaseConfigured } from "@/lib/supabase/config";
import { signOut } from "../actions";
import HorseMark from "@/components/HorseMark";

const nav = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/orders", label: "Commandes" },
  { href: "/admin/products", label: "Produits" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/subscribers", label: "Abonnés" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured) redirect("/admin/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isOwner(user?.email)) redirect("/admin/login");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-ink/10 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4">
          <Link href="/admin" className="flex items-center gap-2.5">
            <HorseMark className="w-7 text-or" />
            <span className="label text-[0.7rem]">Nova Cavalia</span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-full px-4 py-2 text-sm text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden text-sm text-ink/55 hover:text-ink sm:inline"
            >
              Voir le site ↗
            </Link>
            <form action={signOut}>
              <button className="rounded-full border border-ink/20 px-4 py-2 text-sm transition-colors hover:border-ink">
                Déconnexion
              </button>
            </form>
          </div>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto px-5 pb-3 sm:hidden">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-ink/70 hover:bg-ink/5"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
    </div>
  );
}
