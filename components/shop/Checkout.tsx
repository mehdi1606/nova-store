"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart, cartSubtotal, cartCount } from "@/lib/cart";
import { formatMAD } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/lib/supabase/config";
import {
  makeOrderRef,
  whatsappHref,
  FREE_SHIPPING,
  type OrderInput,
} from "@/lib/orders";
import { placeOrder } from "@/lib/actions/orders";
import SmartImage from "@/components/ui/SmartImage";
import HorseMark from "@/components/HorseMark";
import MaskedHeading from "@/components/ui/MaskedHeading";
import { IconArrowRight, IconCheck, IconTruck } from "@/components/Icons";

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.207zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z" />
    </svg>
  );
}

const inputCls =
  "mt-2 w-full rounded-[2px] border border-ink/20 bg-paper px-3.5 py-3 text-ink placeholder:text-ink/35 transition-colors focus:border-ink focus:outline-none";

export default function Checkout() {
  const [mounted, setMounted] = useState(false);
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  useEffect(() => setMounted(true), []);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ reference: string; href: string | null } | null>(
    null,
  );

  const subtotal = cartSubtotal(items);
  const count = cartCount(items);
  const freeShipping = subtotal >= FREE_SHIPPING;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Indiquez votre nom complet.");
    if (!/^[0-9+\s().-]{8,}$/.test(phone))
      return setError("Indiquez un numéro de téléphone valide.");
    if (!address.trim()) return setError("Indiquez votre adresse de livraison.");
    setError(null);

    const order: OrderInput = {
      reference: makeOrderRef(),
      customer_name: name,
      phone,
      city,
      address,
      note,
      items: items.map((i) => ({
        slug: i.slug,
        name: i.name,
        qty: i.qty,
        price: i.price,
        fit: i.fit,
        size: i.size,
        color: i.color,
      })),
      subtotal,
    };

    setSubmitting(true);
    await placeOrder(order); // persist to the dashboard (no-op if unconfigured)
    setSubmitting(false);

    const href = whatsappHref(WHATSAPP_NUMBER, order);
    if (href) window.open(href, "_blank", "noopener,noreferrer");

    clear();
    setDone({ reference: order.reference, href });
  };

  if (!mounted) return <div className="min-h-[60vh] pt-32" aria-hidden />;

  // ── Confirmation ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <section className="edge-x flex min-h-[70vh] flex-col items-center justify-center pt-32 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-ink text-paper">
          <IconCheck className="size-7 text-or" />
        </span>
        <h1 className="mt-7 font-display text-3xl font-[380] text-ink">
          Commande {done.reference} enregistrée
        </h1>
        <p className="mt-3 max-w-md text-ink/65">
          Dernière étape : envoyez-la sur WhatsApp pour la confirmer. Un conseiller
          valide la livraison et le délai — vous payez à la réception.
        </p>

        {done.href ? (
          <a
            href={done.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="group mt-8 inline-flex items-center gap-3 rounded-[2px] bg-[#25D366] px-8 py-4 label text-white transition-transform hover:scale-[1.02]"
          >
            <IconWhatsApp className="size-5" />
            Confirmer sur WhatsApp
          </a>
        ) : (
          <p className="mt-8 max-w-md rounded-[2px] border border-ink/15 bg-paper-2/50 p-4 text-sm text-ink/70">
            Votre commande nous est parvenue — nous vous contactons très vite pour
            la confirmer.
          </p>
        )}

        <Link
          href="/boutique"
          data-cursor="hover"
          className="mt-6 label-xs text-ink/60 u-link transition-colors hover:text-ink"
        >
          Continuer mes achats
        </Link>
      </section>
    );
  }

  // ── Empty cart ────────────────────────────────────────────────────────────
  if (count === 0) {
    return (
      <section className="edge-x flex min-h-[70vh] flex-col items-center justify-center pt-32 text-center">
        <HorseMark className="w-24 text-ink/12" />
        <h1 className="mt-8 font-display text-3xl font-[380] text-ink">
          Votre panier est vide
        </h1>
        <p className="mt-3 max-w-sm text-ink/60">
          Ajoutez une pièce avant de passer commande.
        </p>
        <Link
          href="/boutique"
          data-cursor="hover"
          className="group mt-8 inline-flex items-center gap-3 rounded-[2px] bg-ink px-8 py-4 label text-paper transition-colors hover:bg-ink-deep"
        >
          Découvrir la boutique
          <IconArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
      </section>
    );
  }

  // ── Checkout form ─────────────────────────────────────────────────────────
  return (
    <section className="edge-x pb-24 pt-28 lg:pt-32">
      <MaskedHeading
        lines={["Commande"]}
        className="font-display text-[clamp(2.2rem,5vw,4rem)] font-[380] text-ink"
      />
      <p className="mt-3 flex items-center gap-2 label-xs text-stone">
        <IconTruck className="size-4 text-or" />
        Paiement à la livraison · confirmation sur WhatsApp
      </p>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_minmax(320px,380px)] lg:gap-16">
        {/* form */}
        <form onSubmit={submit} noValidate className="order-2 lg:order-1">
          <h2 className="font-display text-2xl font-[380] text-ink">
            Vos coordonnées
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            Pour la livraison et la confirmation de votre commande.
          </p>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="label-xs text-ink/55">Nom complet</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Prénom et nom"
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="label-xs text-ink/55">Téléphone</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                inputMode="tel"
                placeholder="06 00 00 00 00"
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="label-xs text-ink/55">Ville</span>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                autoComplete="address-level2"
                placeholder="Casablanca, Rabat…"
                className={inputCls}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="label-xs text-ink/55">Adresse de livraison</span>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                autoComplete="street-address"
                placeholder="Rue, numéro, quartier, étage…"
                className={`${inputCls} resize-none`}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="label-xs text-ink/55">Note (facultatif)</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Une précision pour la livraison ?"
                className={`${inputCls} resize-none`}
              />
            </label>
          </div>

          {error && (
            <p className="mt-5 text-sm text-leather" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            data-cursor="hover"
            className="group mt-7 flex w-full items-center justify-center gap-3 rounded-[2px] bg-[#25D366] py-4 label text-white transition-transform hover:scale-[1.01] disabled:opacity-60 sm:w-auto sm:px-10"
          >
            <IconWhatsApp className="size-5" />
            {submitting ? "Un instant…" : "Commander sur WhatsApp"}
          </button>
          <p className="mt-3 text-[0.78rem] text-ink/55">
            Aucun paiement en ligne. Vous réglez en espèces à la réception.
          </p>
        </form>

        {/* summary */}
        <aside className="order-1 lg:order-2 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[var(--radius-xs)] border border-ink/10 bg-paper-2/60 p-6 lg:p-7">
            <h2 className="font-display text-xl font-[380] text-ink">
              Votre commande
            </h2>

            <ul className="mt-5 space-y-4">
              {items.map((it) => (
                <li key={it.id} className="flex gap-4">
                  <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-[2px] bg-paper-2">
                    <SmartImage
                      image={it.image}
                      fill
                      sizes="64px"
                      position="50% 35%"
                    />
                    <span className="absolute right-0 top-0 flex size-5 items-center justify-center rounded-bl-[2px] bg-ink text-[0.65rem] tabular-nums text-paper">
                      {it.qty}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <span className="truncate font-display text-base font-[380] text-ink">
                      {it.name}
                    </span>
                    <span className="text-[0.72rem] text-stone">
                      {[it.color, it.fit, it.size].filter(Boolean).join(" · ")}
                    </span>
                  </div>
                  <span className="self-center label-xs tabular-nums text-ink">
                    {formatMAD(it.price * it.qty)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-2 border-t border-ink/12 pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/65">Sous-total</dt>
                <dd className="tabular-nums text-ink">{formatMAD(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/65">Livraison</dt>
                <dd className="text-ink">
                  {freeShipping ? "Offerte" : "À confirmer"}
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex items-baseline justify-between border-t border-ink/12 pt-4">
              <span className="label-xs text-ink">Total</span>
              <span className="font-display text-2xl font-[380] tabular-nums text-ink">
                {formatMAD(subtotal)}
              </span>
            </div>

            <Link
              href="/panier"
              data-cursor="hover"
              className="mt-4 block w-full py-2 text-center label-xs text-ink/60 u-link transition-colors hover:text-ink"
            >
              Modifier le panier
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
