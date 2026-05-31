"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { formatMAD, cn, EASE } from "@/lib/utils";
import {
  IconPlus,
  IconMinus,
  IconRuler,
  IconTruck,
  IconCheck,
  IconScissors,
} from "@/components/Icons";
import SizeGuide from "./SizeGuide";
import CareAccordion from "./CareAccordion";
import type { Product, Fit, SizeOption } from "@/content/products";

const reassurance = [
  { icon: IconTruck, text: "Livraison offerte au Maroc dès 800 Dhs" },
  { icon: IconCheck, text: "Retours gratuits sous 14 jours" },
  { icon: IconScissors, text: "Cheval brodé, signature de la maison" },
];

export default function BuyBox({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const [color, setColor] = useState(
    product.colors.find((c) => c.available) ?? product.colors[0],
  );
  const [fit, setFit] = useState<Fit | undefined>(product.fits?.[0]);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);
  const [guide, setGuide] = useState(false);
  const [sticky, setSticky] = useState(false);

  const ctaRef = useRef<HTMLDivElement>(null);

  const sizes: SizeOption[] = product.fits
    ? product.sizesByFit?.[fit as Fit] ?? []
    : product.sizes ?? [];

  useEffect(() => setSize(undefined), [fit]);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setSticky(!e.isIntersecting && e.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onAdd = () => {
    if (!size) {
      setError(true);
      ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setError(false);
    const id = [product.slug, fit, size].filter(Boolean).join("-");
    add(
      {
        id,
        slug: product.slug,
        name: product.name,
        price: product.priceMAD,
        image: product.card,
        color: color.name.split(" — ")[0],
        fit,
        size,
        href: `/produit/${product.slug}`,
      },
      qty,
    );
  };

  return (
    <div>
      <span className="label text-leather">{product.eyebrow}</span>
      <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3.2rem)] font-[380] leading-[1.02] text-ink">
        {product.name}
      </h1>
      <p className="display-italic mt-2 font-display text-lg text-leather">
        {product.tagline}
      </p>
      <p className="mt-5 font-display text-2xl font-[380] tabular-nums text-ink">
        {formatMAD(product.priceMAD)}
      </p>
      <p className="mt-5 max-w-prose text-[0.95rem] leading-relaxed text-ink/75">
        {product.description}
      </p>

      {/* color */}
      <div className="mt-9">
        <div className="flex items-baseline justify-between">
          <span className="label-xs text-ink">Couleur</span>
          <span className="text-sm text-ink/60">{color.name}</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          {product.colors.map((c) => {
            const selected = c.name === color.name;
            return (
              <button
                key={c.name}
                onClick={() => c.available && setColor(c)}
                disabled={!c.available}
                title={c.available ? c.name : `${c.name} — bientôt`}
                aria-label={c.name}
                data-cursor="hover"
                className={cn(
                  "relative size-8 rounded-full ring-1 ring-ink/15 transition-transform",
                  selected && "ring-2 ring-ink ring-offset-2 ring-offset-paper",
                  !c.available && "cursor-not-allowed opacity-35",
                )}
                style={{ backgroundColor: c.hex }}
              >
                {!c.available && (
                  <span className="label-xs absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-stone">
                    bientôt
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* fit */}
      {product.fits && (
        <div className="mt-9">
          <span className="label-xs text-ink">Coupe</span>
          <div className="mt-3 inline-flex rounded-full border border-ink/15 p-1">
            {product.fits.map((f) => (
              <button
                key={f}
                onClick={() => setFit(f)}
                data-cursor="hover"
                className={cn(
                  "rounded-full px-6 py-2 label-xs transition-colors",
                  fit === f ? "bg-ink text-paper" : "text-ink/65 hover:text-ink",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* size */}
      <div className="mt-9">
        <div className="flex items-baseline justify-between">
          <span className="label-xs text-ink">Taille</span>
          <button
            onClick={() => setGuide(true)}
            data-cursor="hover"
            className="group inline-flex items-center gap-1.5 text-sm text-ink/60 transition-colors hover:text-ink"
          >
            <IconRuler className="size-4" />
            <span className="u-link">Guide des tailles</span>
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {sizes.map((s) => {
            const selected = size === s.label;
            return (
              <button
                key={s.label}
                onClick={() => {
                  setSize(s.label);
                  setError(false);
                }}
                disabled={!s.available}
                data-cursor="hover"
                className={cn(
                  "min-w-[3.5rem] rounded-[var(--radius-xs)] border px-4 py-3 text-sm transition-colors",
                  selected
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/20 text-ink hover:border-ink",
                  !s.available &&
                    "cursor-not-allowed border-ink/10 text-ink/30 line-through hover:border-ink/10",
                )}
                title={s.available ? s.label : `${s.label} — épuisé`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-sm text-leather"
            >
              Choisissez une taille pour continuer.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* qty + add */}
      <div ref={ctaRef} className="mt-9 flex items-stretch gap-3">
        <div className="flex items-center gap-4 rounded-[2px] border border-ink/15 px-4">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Diminuer"
            className="text-ink/70 hover:text-ink disabled:opacity-30"
            disabled={qty <= 1}
            data-cursor="hover"
          >
            <IconMinus className="size-4" />
          </button>
          <span className="label w-6 text-center text-[0.7rem] tabular-nums">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            aria-label="Augmenter"
            className="text-ink/70 hover:text-ink"
            data-cursor="hover"
          >
            <IconPlus className="size-4" />
          </button>
        </div>
        <button
          onClick={onAdd}
          data-cursor="hover"
          className="group flex flex-1 items-center justify-center gap-3 rounded-[2px] bg-ink py-4 label text-paper transition-colors hover:bg-ink-deep"
        >
          Ajouter au panier — {formatMAD(product.priceMAD * qty)}
        </button>
      </div>

      {/* reassurance */}
      <ul className="mt-10 border-t border-ink/12">
        {reassurance.map((r) => {
          const Icon = r.icon;
          return (
            <li
              key={r.text}
              className="flex items-center gap-3.5 border-b border-ink/10 py-3.5 text-sm text-ink/70"
            >
              <Icon className="size-4 shrink-0 text-or" />
              {r.text}
            </li>
          );
        })}
      </ul>

      {/* details */}
      <div className="mt-10">
        <CareAccordion details={product.details} />
      </div>

      <SizeGuide product={product} open={guide} onClose={() => setGuide(false)} />

      {/* sticky mobile CTA */}
      <AnimatePresence>
        {sticky && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[90] border-t border-ink/10 bg-paper/95 px-4 py-3 backdrop-blur-md lg:hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-base font-[380] text-ink">
                  {product.name}
                </p>
                <p className="label-xs tabular-nums text-ink/60">
                  {formatMAD(product.priceMAD)}
                  {size ? ` · ${size}` : ""}
                </p>
              </div>
              <button
                onClick={onAdd}
                data-cursor="hover"
                className="shrink-0 rounded-[var(--radius-xs)] bg-ink px-6 py-3 label-xs text-paper"
              >
                Ajouter
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
