"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isOwner } from "@/lib/supabase/config";

/** URL-safe slug from a product name. */
function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Sign the owner out and return to the login screen. */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/**
 * Create or update a product's live fields. The write goes through the
 * authenticated (cookie) client, so Supabase RLS independently verifies the
 * owner — we also re-check here. Public pages are revalidated so edits show
 * immediately.
 */
export async function upsertProduct(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isOwner(user?.email)) redirect("/admin/login");

  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) throw new Error("Référence produit manquante.");

  const str = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value.length ? value : null;
  };
  const int = (key: string) => {
    const digits = String(formData.get(key) ?? "").replace(/[^\d-]/g, "");
    if (!digits) return null;
    const n = parseInt(digits, 10);
    return Number.isFinite(n) ? n : null;
  };

  const row = {
    slug,
    name: str("name"),
    tagline: str("tagline"),
    short_desc: str("short_desc"),
    description: str("description"),
    price_mad: int("price_mad"),
    active: formData.get("active") === "on",
    sort_order: int("sort_order") ?? 0,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("products")
    .upsert(row, { onConflict: "slug" });
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/boutique");
  revalidatePath(`/produit/${slug}`);
  revalidatePath("/admin/products");
  redirect(`/admin/products?saved=${encodeURIComponent(slug)}`);
}

/** Update an order's fulfilment status (nouvelle / confirmée / livrée / annulée). */
export async function updateOrderStatus(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isOwner(user?.email)) redirect("/admin/login");

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !status) return;

  await supabase.from("orders").update({ status }).eq("id", id);
  revalidatePath("/admin/orders");
}

/**
 * Create or update a full product (used by the dashboard's new-product form).
 * Photos are already uploaded to Supabase Storage on the client; here we just
 * store their URLs alongside the rest of the fields.
 */
export async function saveProduct(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isOwner(user?.email)) redirect("/admin/login");

  const str = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value.length ? value : null;
  };
  const int = (key: string) => {
    const digits = String(formData.get(key) ?? "").replace(/[^\d-]/g, "");
    if (!digits) return null;
    const n = parseInt(digits, 10);
    return Number.isFinite(n) ? n : null;
  };

  const name = str("name");
  if (!name) throw new Error("Le nom du produit est requis.");

  const slug = str("slug") ?? slugify(name);
  if (!slug) throw new Error("Référence produit invalide.");

  let gallery: string[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("gallery") ?? "[]"));
    if (Array.isArray(parsed)) gallery = parsed.filter((x) => typeof x === "string");
  } catch {
    /* leave gallery empty */
  }

  const row = {
    slug,
    name,
    tagline: str("tagline"),
    short_desc: str("short_desc"),
    description: str("description"),
    price_mad: int("price_mad"),
    category: str("category") === "cheval" ? "cheval" : "cavalier",
    card_image: str("card_image"),
    hero_image: str("hero_image"),
    gallery,
    sizes: str("sizes"),
    active: formData.get("active") === "on",
    sort_order: int("sort_order") ?? 100,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("products")
    .upsert(row, { onConflict: "slug" });
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/boutique");
  revalidatePath(`/produit/${slug}`);
  revalidatePath("/admin/products");
  redirect(`/admin/products?saved=${encodeURIComponent(slug)}`);
}

/** Delete a dashboard-created product (built-in products live in code, not here). */
export async function deleteProduct(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isOwner(user?.email)) redirect("/admin/login");

  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return;

  await supabase.from("products").delete().eq("slug", slug);

  revalidatePath("/");
  revalidatePath("/boutique");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}
