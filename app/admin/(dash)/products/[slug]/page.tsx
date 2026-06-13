import Link from "next/link";
import { notFound } from "next/navigation";
import { products as staticProducts } from "@/content/products";
import { createClient } from "@/lib/supabase/server";
import { upsertProduct } from "../../../actions";
import type { ProductOverride } from "@/lib/catalog";

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
  const base = staticProducts.find((p) => p.slug === slug);
  if (!base) notFound();

  let o: ProductOverride | undefined;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (data) o = data as ProductOverride;
  } catch {
    /* table may not exist yet */
  }

  const v = {
    name: o?.name ?? base.name,
    tagline: o?.tagline ?? base.tagline,
    short_desc: o?.short_desc ?? base.shortDesc,
    description: o?.description ?? base.description,
    price_mad: o?.price_mad ?? base.priceMAD,
    active: o?.active ?? true,
    sort_order: o?.sort_order ?? staticProducts.findIndex((p) => p.slug === slug),
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
        Note : les photos, tailles et couleurs restent gérées dans le code pour
        l&apos;instant. Ce panneau pilote les champs qui changent souvent — prix,
        nom, descriptions et visibilité.
      </p>
    </div>
  );
}
