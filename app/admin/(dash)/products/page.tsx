import Link from "next/link";
import { products as staticProducts } from "@/content/products";
import { createClient } from "@/lib/supabase/server";
import { formatMAD } from "@/lib/utils";
import type { ProductOverride } from "@/lib/catalog";

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;

  let overrides = new Map<string, ProductOverride>();
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("products").select("*");
    if (data) {
      overrides = new Map(
        (data as ProductOverride[]).map((o) => [o.slug, o]),
      );
    }
  } catch {
    /* table may not exist yet — fall back to static values */
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-[380]">Produits</h1>
      <p className="mt-2 text-ink/60">
        Modifiez le prix, les textes et la visibilité. Les changements
        s&apos;appliquent au site immédiatement.
      </p>

      {saved && (
        <p className="mt-6 rounded-[2px] border border-or/40 bg-or/10 p-3 text-sm text-leather">
          Modifications enregistrées.
        </p>
      )}

      <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
        {staticProducts.map((p) => {
          const o = overrides.get(p.slug);
          const price = o?.price_mad ?? p.priceMAD;
          const name = o?.name ?? p.name;
          const hidden = o?.active === false;
          return (
            <Link
              key={p.slug}
              href={`/admin/products/${p.slug}`}
              className="flex items-center justify-between gap-4 py-4 transition-colors hover:bg-ink/[0.03]"
            >
              <div>
                <span className="font-display text-lg font-[380]">{name}</span>
                {hidden && (
                  <span className="ml-3 rounded-full bg-ink/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-ink/50">
                    Masqué
                  </span>
                )}
                <p className="text-sm text-ink/50">/{p.slug}</p>
              </div>
              <span className="shrink-0 font-display text-lg tabular-nums">
                {formatMAD(price)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
