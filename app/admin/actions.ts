"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isOwner } from "@/lib/supabase/config";

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
