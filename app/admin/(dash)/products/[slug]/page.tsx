import Link from "next/link";
import { notFound } from "next/navigation";
import { products as staticProducts } from "@/content/products";
import { createClient } from "@/lib/supabase/server";
import { upsertProduct } from "../../../actions";
import ProductForm from "@/components/admin/ProductForm";
import type { ProductRow } from "@/lib/catalog";

const staticBySlug = new Map(staticProducts.map((p) => [p.slug, p]));

const inputCls =
  "mt-2 w-full rounded-[2px] border border-ink/20 bg-paper px-3 py-2.5 text-ink focus:border-ink focus:outline-none";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label-xs text-ink/55">{label}</span>
      {children}
    </label>
  );
}

export default async function EditProduct({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const base = staticBySlug.get(slug);

  let row: ProductRow | undefined;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (data) row = data as ProductRow;
  } catch {
    /* table may not exist yet */
  }

  if (!base && !row) notFound();

  // ── Dashboard-created product → full form with photo upload ────────────────
  if (!base && row) {
    return (
      <div>
        <Link
          href="/admin/products"
          className="text-sm text-ink/55 hover:text-ink"
        >
          ← Tous les produits
        </Link>
        <h1 className="mt-4 font-display text-3xl font-[380]">
          {row.name ?? "Produit"}
        </h1>
        <p className="mt-1 text-sm text-ink/50">/{slug}</p>
        <div className="mt-8">
          <ProductForm
            initial={{
              slug: row.slug,
              name: row.name ?? "",
              category: row.category ?? "cavalier",
              tagline: row.tagline ?? "",
              price_mad: row.price_mad ?? null,
              short_desc: row.short_desc ?? "",
              description: row.description ?? "",
              sizes: row.sizes ?? "",
              card_image: row.card_image ?? "",
              hero_image: row.hero_image ?? "",
              gallery: row.gallery ?? [],
              active: row.active ?? true,
              sort_order: row.sort_order ?? 100,
            }}
          />
        </div>
      </div>
    );
  }

  // ── Built-in product → live override (text / price / visibility) ───────────
  const p = base!;
  const v = {
    name: row?.name ?? p.name,
    tagline: row?.tagline ?? p.tagline,
    short_desc: row?.short_desc ?? p.shortDesc,
    description: row?.description ?? p.description,
    price_mad: row?.price_mad ?? p.priceMAD,
    active: row?.active ?? true,
    sort_order: row?.sort_order ?? staticProducts.findIndex((x) => x.slug === slug),
  };

  return (
    <div className="max-w-2xl">
      <Link href="/admin/products" className="text-sm text-ink/55 hover:text-ink">
        ← Tous les produits
      </Link>
      <h1 className="mt-4 font-display text-3xl font-[380]">{v.name}</h1>
      <p className="mt-1 text-sm text-ink/50">/{slug}</p>

      <form action={upsertProduct} className="mt-8 space-y-6">
        <input type="hidden" name="slug" value={slug} />

        <Field label="Nom">
          <input name="name" defaultValue={v.name} className={inputCls} />
        </Field>
        <Field label="Accroche">
          <input name="tagline" defaultValue={v.tagline} className={inputCls} />
        </Field>
        <Field label="Prix (Dhs)">
          <input
            name="price_mad"
            type="number"
            min="0"
            step="10"
            defaultValue={v.price_mad}
            className={inputCls}
          />
        </Field>
        <Field label="Description courte">
          <textarea
            name="short_desc"
            rows={2}
            defaultValue={v.short_desc}
            className={`${inputCls} resize-none`}
          />
        </Field>
        <Field label="Description longue">
          <textarea
            name="description"
            rows={5}
            defaultValue={v.description}
            className={`${inputCls} resize-none`}
          />
        </Field>

        <div className="flex flex-wrap items-end gap-8">
          <Field label="Ordre d'affichage">
            <input
              name="sort_order"
              type="number"
              defaultValue={v.sort_order}
              className={`${inputCls} w-28`}
            />
          </Field>
          <label className="flex items-center gap-3 pb-3">
            <input
              type="checkbox"
              name="active"
              defaultChecked={v.active}
              className="size-4 accent-ink"
            />
            <span className="text-sm">Visible sur le site</span>
          </label>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="rounded-[2px] bg-ink px-8 py-3.5 label text-paper transition-colors hover:bg-ink-deep"
          >
            Enregistrer
          </button>
          <Link
            href="/admin/products"
            className="text-sm text-ink/55 hover:text-ink"
          >
            Annuler
          </Link>
        </div>
      </form>

      <p className="mt-8 max-w-prose text-xs leading-relaxed text-ink/45">
        Les photos, tailles et couleurs de cette pièce restent gérées dans le
        code. Ce panneau pilote les champs qui changent souvent — prix, nom,
        descriptions et visibilité. Pour une pièce entièrement modifiable (photos
        comprises), créez un nouveau produit.
      </p>
    </div>
  );
}
