"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart, cartSubtotal, cartCount } from "@/lib/cart";
import { formatMAD } from "@/lib/utils";
import SmartImage from "@/components/ui/SmartImage";
import HorseMark from "@/components/HorseMark";
import MaskedHeading from "@/components/ui/MaskedHeading";
import {
  IconPlus,
  IconMinus,
  IconClose,
  IconArrowRight,
  IconTruck,
} from "@/components/Icons";

const FREE_SHIPPING = 800;

export default function CartView() {
  const [mounted, setMounted] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const setQty = useCart((s) => s.setQty);

  useEffect(() => setMounted(true), []);

  const subtotal = cartSubtotal(items);
  const count = cartCount(items);
  const remaining = Math.max(0, FREE_SHIPPING - subtotal);

  if (!mounted) {
    return <div className="min-h-[60vh] pt-32" aria-hidden />;
  }

  if (count === 0) {
    return (
      <section className="edge-x flex min-h-[70vh] flex-col items-center justify-center pt-32 text-center">
        <HorseMark className="w-24 text-ink/12" />
        <h1 className="mt-8 font-display text-3xl font-[380] text-ink">
          Votre panier est vide
        </h1>
        <p className="mt-3 max-w-sm text-ink/60">
          La collection capsule 2026 vous attend — trois pièces, une signature.
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

  return (
    <section className="edge-x pb-24 pt-28 lg:pt-32">
      <MaskedHeading
        lines={["Votre panier"]}
        className="font-display text-[clamp(2.2rem,5vw,4rem)] font-[380] text-ink"
      />
      <p className="mt-3 label-xs text-stone">
        {count} {count > 1 ? "articles" : "article"}
      </p>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_minmax(320px,380px)] lg:gap-16">
        {/* items */}
        <ul className="divide-y divide-ink/10 border-t border-ink/10">
          {items.map((it) => (
            <li key={it.id} className="flex gap-6 py-7">
              <Link
                href={it.href}
                data-cursor="hover"
                className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-[2px] bg-paper-2 sm:w-28"
              >
                <SmartImage image={it.image} fill sizes="112px" position="50% 35%" />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={it.href}
                      data-cursor="hover"
                      className="font-display text-xl font-[380] text-ink u-link"
                    >
                      {it.name}
                    </Link>
                    <p className="mt-1.5 text-sm text-stone">
                      {[it.color, it.fit, it.size].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(it.id)}
                    aria-label={`Retirer ${it.name}`}
                    className="shrink-0 text-ink/40 transition-colors hover:text-leather"
                    data-cursor="hover"
                  >
                    <IconClose className="size-5" />
                  </button>
                </div>

                <div className="mt-auto flex items-end justify-between pt-4">
                  <div className="flex items-center gap-4 rounded-full border border-ink/15 px-3 py-1.5">
                    <button
                      onClick={() => setQty(it.id, it.qty - 1)}
                      aria-label="Diminuer"
                      className="text-ink/70 hover:text-ink disabled:opacity-30"
                      disabled={it.qty <= 1}
                      data-cursor="hover"
                    >
                      <IconMinus className="size-3.5" />
                    </button>
                    <span className="label w-5 text-center text-[0.7rem] tabular-nums">
                      {it.qty}
                    </span>
                    <button
                      onClick={() => setQty(it.id, it.qty + 1)}
                      aria-label="Augmenter"
                      className="text-ink/70 hover:text-ink"
                      data-cursor="hover"
                    >
                      <IconPlus className="size-3.5" />
                    </button>
                  </div>
                  <span className="font-display text-lg font-[380] tabular-nums text-ink">
                    {formatMAD(it.price * it.qty)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[var(--radius-xs)] border border-ink/10 bg-paper-2/60 p-7 lg:p-8">
            <h2 className="font-display text-2xl font-[380] text-ink">Récapitulatif</h2>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/65">Sous-total</dt>
                <dd className="tabular-nums text-ink">{formatMAD(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/65">Livraison</dt>
                <dd className="text-ink">
                  {remaining > 0 ? "Calculée à l'étape suivante" : "Offerte"}
                </dd>
              </div>
            </dl>

            {remaining > 0 && (
              <p className="mt-4 flex items-center gap-2 rounded-[2px] bg-paper px-3 py-2.5 text-[0.78rem] text-ink/70">
                <IconTruck className="size-4 shrink-0 text-or" />
                Plus que {formatMAD(remaining)} pour la livraison offerte.
              </p>
            )}

            <div className="mt-6 flex items-baseline justify-between border-t border-ink/12 pt-5">
              <span className="label-xs text-ink">Total</span>
              <span className="font-display text-2xl font-[380] tabular-nums text-ink">
                {formatMAD(subtotal)}
              </span>
            </div>

            <button
              onClick={() => setCheckout(true)}
              data-cursor="hover"
              className="group mt-6 flex w-full items-center justify-center gap-3 rounded-[2px] bg-ink py-4 label text-paper transition-colors hover:bg-ink-deep"
            >
              Passer au paiement
              <IconArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </button>

            {checkout && (
              <p className="mt-4 text-center text-[0.8rem] leading-relaxed text-ink/70">
                Le paiement en ligne arrive très bientôt. Pour commander dès
                maintenant,{" "}
                <Link href="/contact" className="u-link font-medium text-ink" data-cursor="hover">
                  écrivez-nous
                </Link>
                .
              </p>
            )}

            <Link
              href="/boutique"
              data-cursor="hover"
              className="mt-3 block w-full py-2 text-center label-xs text-ink/60 u-link transition-colors hover:text-ink"
            >
              Continuer mes achats
            </Link>
          </div>

          <p className="mt-5 label-xs leading-relaxed text-stone/70">
            Taxes incluses. Retours gratuits sous 14 jours au Maroc.
          </p>
        </aside>
      </div>
    </section>
  );
}
