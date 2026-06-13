import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { products as staticProducts } from "@/content/products";

async function safeCount(table: string): Promise<number | null> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });
    if (error) return null;
    return count ?? 0;
  } catch {
    return null;
  }
}

export default async function AdminHome() {
  const [orders, messages, subscribers] = await Promise.all([
    safeCount("orders"),
    safeCount("messages"),
    safeCount("subscribers"),
  ]);
  const needsSetup =
    orders === null || messages === null || subscribers === null;

  const cards = [
    {
      label: "Commandes",
      value: orders ?? "—",
      href: "/admin/orders",
      hint: "Paiement à la livraison",
    },
    {
      label: "Produits",
      value: staticProducts.length,
      href: "/admin/products",
      hint: "Prix, textes & visibilité",
    },
    {
      label: "Messages",
      value: messages ?? "—",
      href: "/admin/messages",
      hint: "Formulaire de contact",
    },
    {
      label: "Abonnés",
      value: subscribers ?? "—",
      href: "/admin/subscribers",
      hint: "Lettre de l'écurie",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-[380]">Tableau de bord</h1>
      <p className="mt-2 text-ink/60">
        Gérez la collection et suivez les demandes de la maison.
      </p>

      {needsSetup && (
        <div className="mt-6 rounded-[2px] border border-leather/30 bg-leather/5 p-4 text-sm text-leather">
          Les tables ne sont pas encore créées. Ouvrez{" "}
          <code className="rounded bg-ink/10 px-1">SUPABASE_SETUP.md</code> et
          exécutez le script SQL dans Supabase → SQL Editor, puis rechargez.
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-[2px] border border-ink/10 bg-paper-2/40 p-6 transition-colors hover:border-ink/30"
          >
            <span className="label-xs text-stone">{c.label}</span>
            <p className="mt-3 font-display text-4xl font-[380] tabular-nums text-ink">
              {c.value}
            </p>
            <p className="mt-2 text-sm text-ink/55">{c.hint}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
