import { cache } from "react";
import {
  products as staticProducts,
  look,
  type Product,
} from "@/content/products";
import { isSupabaseConfigured } from "./supabase/config";

/**
 * The bridge between the rich static catalogue (content/products.ts) and the
 * editable Supabase `products` table.
 *
 * Structure (galleries, sizes, colours, story…) always comes from code. The
 * dashboard only overrides the "live" fields a shop owner changes often — name,
 * tagline, descriptions, price, visibility and order. If Supabase is not
 * configured, or a row is missing, or the request fails, we fall back to the
 * static value. The public site therefore can NEVER break from the backend.
 */

export type ProductOverride = {
  slug: string;
  name: string | null;
  tagline: string | null;
  short_desc: string | null;
  description: string | null;
  price_mad: number | null;
  active: boolean | null;
  sort_order: number | null;
};

const OVERRIDE_COLUMNS =
  "slug,name,tagline,short_desc,description,price_mad,active,sort_order";

const staticIndex = new Map(staticProducts.map((p, i) => [p.slug, i]));

function applyOverride(p: Product, o?: ProductOverride): Product {
  if (!o) return p;
  return {
    ...p,
    name: o.name ?? p.name,
    tagline: o.tagline ?? p.tagline,
    shortDesc: o.short_desc ?? p.shortDesc,
    description: o.description ?? p.description,
    priceMAD: o.price_mad ?? p.priceMAD,
  };
}

/** Fetch all overrides once per request. Never throws — returns an empty map. */
const fetchOverrides = cache(async (): Promise<Map<string, ProductOverride>> => {
  if (!isSupabaseConfigured) return new Map();
  try {
    const { createPublicClient } = await import("./supabase/public");
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select(OVERRIDE_COLUMNS);
    if (error || !data) return new Map();
    return new Map(
      (data as ProductOverride[]).map((o) => [o.slug, o]),
    );
  } catch {
    return new Map();
  }
});

const priceOf = (overrides: Map<string, ProductOverride>, slug: string) => {
  const base = staticProducts.find((p) => p.slug === slug);
  return overrides.get(slug)?.price_mad ?? base?.priceMAD ?? 0;
};

/** Visible products, with overrides applied, ordered by sort_order. */
export const getCatalog = cache(async (): Promise<Product[]> => {
  const overrides = await fetchOverrides();
  const orderOf = (slug: string) =>
    overrides.get(slug)?.sort_order ?? staticIndex.get(slug) ?? 0;
  return staticProducts
    .filter((p) => overrides.get(p.slug)?.active !== false)
    .map((p) => applyOverride(p, overrides.get(p.slug)))
    .sort((a, b) => orderOf(a.slug) - orderOf(b.slug));
});

/** A single product by slug (merged), regardless of visibility. */
export const getProductBySlug = cache(
  async (slug: string): Promise<Product | undefined> => {
    const overrides = await fetchOverrides();
    const base = staticProducts.find((p) => p.slug === slug);
    return base ? applyOverride(base, overrides.get(slug)) : undefined;
  },
);

/** Merged products for an explicit, curated list of slugs (order preserved). */
export const getProductsBySlugs = cache(
  async (slugs: string[]): Promise<Product[]> => {
    const overrides = await fetchOverrides();
    return slugs
      .map((slug) => {
        const base = staticProducts.find((p) => p.slug === slug);
        return base ? applyOverride(base, overrides.get(slug)) : undefined;
      })
      .filter((p): p is Product => Boolean(p));
  },
);

/** Look bundle totals, using live prices. */
export const getLookTotals = cache(
  async (): Promise<{ full: number; bundled: number }> => {
    const overrides = await fetchOverrides();
    const full = look.items.reduce((sum, s) => sum + priceOf(overrides, s), 0);
    return {
      full,
      bundled: Math.round((full * (1 - look.discountRate)) / 10) * 10,
    };
  },
);
