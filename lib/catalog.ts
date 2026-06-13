import { cache } from "react";
import {
  products as staticProducts,
  look,
  type Product,
  type SizeOption,
} from "@/content/products";
import { isSupabaseConfigured } from "./supabase/config";
import type { ImageAsset } from "@/lib/images";

/**
 * The bridge between the rich static catalogue (content/products.ts) and the
 * editable Supabase `products` table.
 *
 *  • For the three built-in products, the DB only *overrides* the live fields
 *    (name, tagline, descriptions, price, visibility, order). Structure
 *    (galleries, sizes, colours, story…) stays in code.
 *  • Products *created in the dashboard* live entirely in the DB and are built
 *    into full Product objects with sensible defaults + uploaded photos.
 *
 * If Supabase is unreachable, or a row is malformed, we fall back to the static
 * catalogue — the public site can never break from the backend.
 */

export type ProductRow = {
  slug: string;
  name: string | null;
  tagline: string | null;
  short_desc: string | null;
  description: string | null;
  price_mad: number | null;
  active: boolean | null;
  sort_order: number | null;
  category: string | null;
  card_image: string | null;
  hero_image: string | null;
  gallery: string[] | null;
  sizes: string | null;
};

/** Back-compat alias — earlier code referred to override rows by this name. */
export type ProductOverride = ProductRow;

const SELECT =
  "slug,name,tagline,short_desc,description,price_mad,active,sort_order,category,card_image,hero_image,gallery,sizes";

const staticIndex = new Map(staticProducts.map((p, i) => [p.slug, i]));
const staticBySlug = new Map(staticProducts.map((p) => [p.slug, p]));

function applyOverride(p: Product, o?: ProductRow): Product {
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

function urlToAsset(url: string, alt: string): ImageAsset {
  return { src: url, w: 1200, h: 1500, blur: "", alt, role: "product", source: "" };
}

function parseSizes(raw: string | null): SizeOption[] {
  const labels = (raw ?? "")
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (!labels.length) return [{ label: "Taille unique", available: true }];
  return labels.map((label) => ({ label, available: true }));
}

/** Build a complete Product from a dashboard-created (DB-only) row. */
function dbRowToProduct(o: ProductRow): Product | null {
  const name = o.name ?? "Nouveau produit";
  const cardUrl = o.card_image || o.hero_image;
  if (!cardUrl) return null; // no photo → can't render; skip it

  const card = urlToAsset(cardUrl, name);
  const hero = o.hero_image ? urlToAsset(o.hero_image, name) : card;
  const galleryUrls = (
    o.gallery && o.gallery.length ? o.gallery : [o.hero_image || o.card_image]
  ).filter((u): u is string => Boolean(u));
  const gallery = galleryUrls.length
    ? galleryUrls.map((u) => urlToAsset(u, name))
    : [card];

  return {
    slug: o.slug,
    name,
    category: o.category === "cheval" ? "cheval" : "cavalier",
    eyebrow: "Nouveauté",
    tagline: o.tagline ?? "",
    priceMAD: o.price_mad ?? 0,
    shortDesc: o.short_desc ?? "",
    description: o.description ?? "",
    story: o.description ?? "",
    colors: [{ name: "Marine — Couleur signature", hex: "#16273D", available: true }],
    sizeType: "accessoire",
    sizeNote: "",
    sizes: parseSizes(o.sizes),
    hero,
    gallery,
    card,
    cardHover: card,
    macro: [],
    details: [],
    crossSell: [],
    chapterAlign: "left",
  };
}

/** Fetch every product row once per request. Never throws — returns an empty map. */
const fetchRows = cache(async (): Promise<Map<string, ProductRow>> => {
  if (!isSupabaseConfigured) return new Map();
  try {
    const { createPublicClient } = await import("./supabase/public");
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("products").select(SELECT);
    if (error || !data) return new Map();
    return new Map((data as ProductRow[]).map((o) => [o.slug, o]));
  } catch {
    return new Map();
  }
});

const priceOf = (rows: Map<string, ProductRow>, slug: string) => {
  const base = staticBySlug.get(slug);
  return rows.get(slug)?.price_mad ?? base?.priceMAD ?? 0;
};

/** Visible products (built-in + dashboard-created), overrides applied, ordered. */
export const getCatalog = cache(async (): Promise<Product[]> => {
  const rows = await fetchRows();

  const builtIn = staticProducts
    .filter((p) => rows.get(p.slug)?.active !== false)
    .map((p) => ({
      product: applyOverride(p, rows.get(p.slug)),
      order: rows.get(p.slug)?.sort_order ?? staticIndex.get(p.slug) ?? 0,
    }));

  const custom: { product: Product; order: number }[] = [];
  for (const [slug, row] of rows) {
    if (staticBySlug.has(slug) || row.active === false) continue;
    const product = dbRowToProduct(row);
    if (product) custom.push({ product, order: row.sort_order ?? 999 });
  }

  return [...builtIn, ...custom]
    .sort((a, b) => a.order - b.order)
    .map((x) => x.product);
});

/** A single product by slug (built-in override or dashboard-created), merged. */
export const getProductBySlug = cache(
  async (slug: string): Promise<Product | undefined> => {
    const rows = await fetchRows();
    const base = staticBySlug.get(slug);
    if (base) return applyOverride(base, rows.get(slug));
    const row = rows.get(slug);
    return row ? dbRowToProduct(row) ?? undefined : undefined;
  },
);

/** Merged products for a curated list of slugs (order preserved). */
export const getProductsBySlugs = cache(
  async (slugs: string[]): Promise<Product[]> => {
    const rows = await fetchRows();
    return slugs
      .map((slug) => {
        const base = staticBySlug.get(slug);
        if (base) return applyOverride(base, rows.get(slug));
        const row = rows.get(slug);
        return row ? dbRowToProduct(row) : undefined;
      })
      .filter((p): p is Product => Boolean(p));
  },
);

/** Look bundle totals, using live prices. */
export const getLookTotals = cache(
  async (): Promise<{ full: number; bundled: number }> => {
    const rows = await fetchRows();
    const full = look.items.reduce((sum, s) => sum + priceOf(rows, s), 0);
    return {
      full,
      bundled: Math.round((full * (1 - look.discountRate)) / 10) * 10,
    };
  },
);
