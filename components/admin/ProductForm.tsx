"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { saveProduct, deleteProduct } from "@/app/admin/actions";

export type ProductFormInitial = {
  slug?: string;
  name?: string;
  category?: string;
  tagline?: string;
  price_mad?: number | null;
  short_desc?: string;
  description?: string;
  sizes?: string;
  card_image?: string;
  hero_image?: string;
  gallery?: string[];
  active?: boolean;
  sort_order?: number | null;
};

const inputCls =
  "mt-2 w-full rounded-[2px] border border-ink/20 bg-paper px-3.5 py-3 text-ink placeholder:text-ink/35 focus:border-ink focus:outline-none";

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

function ImagePicker({
  label,
  url,
  onPick,
  onClear,
  required,
}: {
  label: string;
  url: string;
  onPick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  required?: boolean;
}) {
  return (
    <div>
      <span className="label-xs text-ink/55">
        {label}
        {required && " *"}
      </span>
      <div className="mt-3 flex items-center gap-4">
        <div className="relative size-28 shrink-0 overflow-hidden rounded-[2px] border border-ink/10 bg-paper-2">
          {url ? (
            <Image src={url} alt="" fill sizes="112px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-ink/35">
              Aucune
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="cursor-pointer rounded-[2px] border border-ink/20 px-4 py-2 text-sm transition-colors hover:border-ink">
            {url ? "Changer l'image" : "Choisir une image"}
            <input
              type="file"
              accept="image/*"
              onChange={onPick}
              className="hidden"
            />
          </label>
          {url && (
            <button
              type="button"
              onClick={onClear}
              className="text-left text-xs text-ink/50 hover:text-leather"
            >
              Retirer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductForm({
  initial,
}: {
  initial?: ProductFormInitial;
}) {
  const isEdit = Boolean(initial?.slug);
  const [card, setCard] = useState(initial?.card_image ?? "");
  const [hero, setHero] = useState(initial?.hero_image ?? "");
  const [gallery, setGallery] = useState<string[]>(initial?.gallery ?? []);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    const supabase = createClient();
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage
      .from("products")
      .upload(path, file, { cacheControl: "31536000", upsert: false });
    if (error) {
      setErr("Échec de l'envoi : " + error.message);
      return null;
    }
    return supabase.storage.from("products").getPublicUrl(path).data.publicUrl;
  };

  const pickSingle =
    (setter: (v: string) => void) =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setErr(null);
      setUploading(true);
      const url = await uploadFile(file);
      setUploading(false);
      if (url) setter(url);
      e.target.value = "";
    };

  const pickGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setErr(null);
    setUploading(true);
    for (const file of files) {
      const url = await uploadFile(file);
      if (url) setGallery((g) => [...g, url]);
    }
    setUploading(false);
    e.target.value = "";
  };

  return (
    <>
      <form action={saveProduct} className="max-w-2xl space-y-6">
        {initial?.slug && (
          <input type="hidden" name="slug" value={initial.slug} />
        )}
        <input type="hidden" name="card_image" value={card} />
        <input type="hidden" name="hero_image" value={hero} />
        <input type="hidden" name="gallery" value={JSON.stringify(gallery)} />

        <ImagePicker
          label="Photo principale (vignette boutique)"
          url={card}
          onPick={pickSingle(setCard)}
          onClear={() => setCard("")}
          required
        />

        <Field label="Nom du produit">
          <input
            name="name"
            defaultValue={initial?.name}
            placeholder="Bonnet en laine, Gants…"
            className={inputCls}
            required
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Catégorie">
            <select
              name="category"
              defaultValue={initial?.category ?? "cavalier"}
              className={inputCls}
            >
              <option value="cavalier">Le Cavalier</option>
              <option value="cheval">Le Cheval</option>
            </select>
          </Field>
          <Field label="Prix (Dhs)">
            <input
              name="price_mad"
              type="number"
              min="0"
              step="10"
              defaultValue={initial?.price_mad ?? ""}
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Accroche">
          <input
            name="tagline"
            defaultValue={initial?.tagline}
            placeholder="Une ligne courte et élégante."
            className={inputCls}
          />
        </Field>

        <Field label="Description courte">
          <textarea
            name="short_desc"
            rows={2}
            defaultValue={initial?.short_desc}
            className={`${inputCls} resize-none`}
          />
        </Field>

        <Field label="Description longue">
          <textarea
            name="description"
            rows={5}
            defaultValue={initial?.description}
            className={`${inputCls} resize-none`}
          />
        </Field>

        <Field label="Tailles (séparées par des virgules)">
          <input
            name="sizes"
            defaultValue={initial?.sizes}
            placeholder="S, M, L, XL — ou vide pour « Taille unique »"
            className={inputCls}
          />
        </Field>

        <ImagePicker
          label="Photo de présentation (page produit) — facultatif"
          url={hero}
          onPick={pickSingle(setHero)}
          onClear={() => setHero("")}
        />

        <div>
          <span className="label-xs text-ink/55">
            Galerie (page produit) — facultatif
          </span>
          <div className="mt-3 flex flex-wrap gap-3">
            {gallery.map((u, i) => (
              <div
                key={u + i}
                className="relative size-20 overflow-hidden rounded-[2px] border border-ink/10"
              >
                <Image src={u} alt="" fill sizes="80px" className="object-cover" />
                <button
                  type="button"
                  onClick={() =>
                    setGallery((g) => g.filter((_, j) => j !== i))
                  }
                  className="absolute right-0 top-0 bg-ink/80 px-1.5 text-xs leading-5 text-paper"
                  aria-label="Retirer"
                >
                  ×
                </button>
              </div>
            ))}
            <label className="flex size-20 cursor-pointer items-center justify-center rounded-[2px] border border-dashed border-ink/30 text-2xl text-ink/40 transition-colors hover:border-ink">
              +
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={pickGallery}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-8">
          <Field label="Ordre d'affichage">
            <input
              name="sort_order"
              type="number"
              defaultValue={initial?.sort_order ?? 100}
              className={`${inputCls} w-28`}
            />
          </Field>
          <label className="flex items-center gap-3 pb-3">
            <input
              type="checkbox"
              name="active"
              defaultChecked={initial?.active ?? true}
              className="size-4 accent-ink"
            />
            <span className="text-sm">Visible sur le site</span>
          </label>
        </div>

        {uploading && (
          <p className="text-sm text-ink/60">Envoi de l&apos;image en cours…</p>
        )}
        {err && <p className="text-sm text-leather">{err}</p>}
        {!card && (
          <p className="text-sm text-ink/55">
            Ajoutez d&apos;abord une photo principale.
          </p>
        )}

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={uploading || !card}
            className="rounded-[2px] bg-ink px-8 py-3.5 label text-paper transition-colors hover:bg-ink-deep disabled:opacity-50"
          >
            {isEdit ? "Enregistrer" : "Créer le produit"}
          </button>
          <Link
            href="/admin/products"
            className="text-sm text-ink/55 hover:text-ink"
          >
            Annuler
          </Link>
        </div>
      </form>

      {isEdit && initial?.slug && (
        <form
          action={deleteProduct}
          className="mt-8 max-w-2xl border-t border-ink/10 pt-6"
        >
          <input type="hidden" name="slug" value={initial.slug} />
          <button
            type="submit"
            className="text-sm text-leather transition-opacity hover:opacity-70"
          >
            Supprimer ce produit
          </button>
        </form>
      )}
    </>
  );
}
