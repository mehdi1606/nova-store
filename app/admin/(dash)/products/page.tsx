import Link from "next/link";
import Image from "next/image";
import { products as staticProducts } from "@/content/products";
import { createClient } from "@/lib/supabase/server";
import { formatMAD } from "@/lib/utils";
import type { ProductRow } from "@/lib/catalog";

const staticSlugs = new Set(staticProducts.map((p) => p.slug));

function Hidden() {
  return (
    <span className="ml-3 rounded-full bg-ink/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-ink/50">
      Masqué
    </span>
  );
}

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;

  let rows: ProductRow[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("products").select("*");
    if (data) rows = data as ProductRow[];
  } catch {
    /* table may not exist yet */
  }

  const overrides = new Map(rows.map((r) => [r.slug, r]));
  const custom = rows.filter((r) => !staticSlugs.has(r.slug));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-[380]">Produits</h1>
          <p className="mt-2 text-ink/60">
            Modifiez vos pièces ou créez-en de nouvelles. Les changements
            s&apos;appliquent au site immédiatement.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-[2px] bg-ink px-5 py-2.5 label text-paper transition-colors hover:bg-ink-deep"
        >
          + Nouveau produit
        </Link>
      </div>

      {saved && (
        <p className="mt-6 rounded-[2px] border border-or/40 bg-or/10 p-3 text-sm text-leather">
          Modifications enregistrées.
        </p>
      )}

      <h2 className="mt-10 label-xs text-stone">La collection</h2>
      <div className="mt-3 divide-y divide-ink/10 border-y border-ink/10">
        {staticProducts.map((p) => {
          const o = overrides.get(p.slug);
          const price = o?.price_mad ?? p.priceMAD;
          const name = o?.name ?? p.name;
          return (
            <Link
              key={p.slug}
              href={`/admin/products/${p.slug}`}
              className="flex items-center justify-between gap-4 py-4 transition-colors hover:bg-ink/[0.03]"
            >
              <div>
                <span className="font-display text-lg font-[380]">{name}</span>
                {o?.active === false && <Hidden />}
                <p className="text-sm text-ink/50">/{p.slug}</p>
              </div>
              <span className="shrink-0 font-display text-lg tabular-nums">
                {formatMAD(price)}
              </span>
            </Link>
          );
        })}
      </div>

      {custom.length > 0 && (
        <>
          <h2 className="mt-10 label-xs text-stone">Vos ajouts</h2>
          <div className="mt-3 divide-y divide-ink/10 border-y border-ink/10">
            {custom.map((r) => {
              const thumb = r.card_image || r.hero_image;
              return (
                <Link
                  key={r.slug}
                  href={`/admin/products/${r.slug}`}
                  className="flex items-center gap-4 py-4 transition-colors hover:bg-ink/[0.03]"
                >
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-[2px] bg-paper-2">
                    {thumb && (
                      <Image
                        src={thumb}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-display text-lg font-[380]">
                      {r.name ?? "Sans nom"}
                    </span>
                    {r.active === false && <Hidden />}
                    <p className="text-sm text-ink/50">/{r.slug}</p>
                  </div>
                  <span className="shrink-0 font-display text-lg tabular-nums">
                    {formatMAD(r.price_mad ?? 0)}
                  </span>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
