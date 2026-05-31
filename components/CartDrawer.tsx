"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCart, cartSubtotal, cartCount } from "@/lib/cart";
import { lockScroll } from "@/lib/lenis";
import { formatMAD, EASE } from "@/lib/utils";
import SmartImage from "./ui/SmartImage";
import HorseMark from "./HorseMark";
import { IconClose, IconPlus, IconMinus, IconArrowRight, IconBag } from "@/components/Icons";

const FREE_SHIPPING = 800;

export default function CartDrawer() {
  const reduce = useReducedMotion();
  const open = useCart((s) => s.open);
  const setOpen = useCart((s) => s.setOpen);
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const setQty = useCart((s) => s.setQty);

  const subtotal = cartSubtotal(items);
  const count = cartCount(items);
  const remaining = Math.max(0, FREE_SHIPPING - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING) * 100);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  const close = () => setOpen(false);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cart"
          className="fixed inset-0 z-[115]"
          initial="hidden"
          animate="show"
          exit="hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Panier"
        >
          {/* backdrop */}
          <motion.button
            aria-label="Fermer le panier"
            onClick={close}
            className="absolute inset-0 bg-ink-deep/55 backdrop-blur-[2px]"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            transition={{ duration: 0.4, ease: EASE }}
            data-cursor="hover"
          />

          {/* panel */}
          <motion.aside
            className="absolute right-0 top-0 flex h-[100dvh] w-[min(440px,100vw)] flex-col bg-paper text-ink shadow-[-20px_0_60px_rgba(9,20,34,0.25)]"
            variants={{
              hidden: reduce ? { opacity: 0 } : { x: "100%" },
              show: reduce ? { opacity: 1 } : { x: 0 },
            }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <div className="flex items-baseline gap-3">
                <h2 className="font-display text-2xl font-[380]">Panier</h2>
                <span className="label-xs text-stone">
                  {count} {count > 1 ? "articles" : "article"}
                </span>
              </div>
              <button
                onClick={close}
                aria-label="Fermer le panier"
                className="group -mr-1 p-1 text-ink/70 transition-colors hover:text-ink"
                data-cursor="hover"
              >
                <IconClose className="size-5 transition-transform duration-500 group-hover:rotate-90" />
              </button>
            </div>

            {/* free shipping bar */}
            {count > 0 && (
              <div className="border-b border-ink/10 bg-paper-2/60 px-6 py-4">
                <p className="text-[0.78rem] text-ink/75">
                  {remaining > 0 ? (
                    <>
                      Plus que{" "}
                      <span className="font-medium text-ink">
                        {formatMAD(remaining)}
                      </span>{" "}
                      pour la livraison offerte.
                    </>
                  ) : (
                    <span className="font-medium text-ink">
                      Livraison offerte débloquée.
                    </span>
                  )}
                </p>
                <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-ink/10">
                  <motion.div
                    className="h-full rounded-full bg-or"
                    initial={false}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                </div>
              </div>
            )}

            {/* items / empty */}
            {count === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <HorseMark className="w-20 text-ink/15" />
                <IconBag className="-mt-10 size-7 text-ink/40" />
                <p className="mt-6 font-display text-xl font-[380]">
                  Votre panier est vide
                </p>
                <p className="mt-2 max-w-xs text-sm text-ink/60">
                  La collection capsule 2026 n&apos;attend que vous.
                </p>
                <Link
                  href="/boutique"
                  onClick={close}
                  className="group mt-7 inline-flex items-center gap-3 rounded-[2px] bg-ink px-7 py-3.5 label text-paper transition-colors hover:bg-ink-deep"
                  data-cursor="hover"
                >
                  Découvrir la boutique
                  <IconArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
              </div>
            ) : (
              <ul className="no-scrollbar flex-1 divide-y divide-ink/8 overflow-y-auto px-6">
                {items.map((it) => (
                  <li key={it.id} className="flex gap-4 py-5">
                    <Link
                      href={it.href}
                      onClick={close}
                      className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-[2px] bg-paper-2"
                      data-cursor="hover"
                    >
                      <SmartImage image={it.image} fill sizes="80px" position="50% 40%" />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={it.href}
                          onClick={close}
                          className="font-display text-[1.05rem] font-[380] leading-tight u-link"
                          data-cursor="hover"
                        >
                          {it.name}
                        </Link>
                        <button
                          onClick={() => remove(it.id)}
                          aria-label={`Retirer ${it.name}`}
                          className="-mt-0.5 shrink-0 text-ink/40 transition-colors hover:text-leather"
                          data-cursor="hover"
                        >
                          <IconClose className="size-4" />
                        </button>
                      </div>

                      <p className="mt-1 text-[0.72rem] text-stone">
                        {[it.color, it.fit, it.size].filter(Boolean).join(" · ")}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center gap-3 rounded-full border border-ink/15 px-2 py-1">
                          <button
                            onClick={() => setQty(it.id, it.qty - 1)}
                            aria-label="Diminuer la quantité"
                            className="text-ink/70 transition-colors hover:text-ink disabled:opacity-30"
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
                            aria-label="Augmenter la quantité"
                            className="text-ink/70 transition-colors hover:text-ink"
                            data-cursor="hover"
                          >
                            <IconPlus className="size-3.5" />
                          </button>
                        </div>
                        <span className="label tabular-nums">
                          {formatMAD(it.price * it.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* footer */}
            {count > 0 && (
              <div className="border-t border-ink/10 px-6 py-5">
                <div className="flex items-baseline justify-between">
                  <span className="label-xs text-stone">Sous-total</span>
                  <span className="font-display text-xl font-[380] tabular-nums">
                    {formatMAD(subtotal)}
                  </span>
                </div>
                <p className="mt-1 text-[0.72rem] text-ink/55">
                  Taxes incluses. Livraison calculée à l&apos;étape suivante.
                </p>

                <Link
                  href="/panier"
                  onClick={close}
                  className="group mt-4 flex w-full items-center justify-center gap-3 rounded-[2px] bg-ink py-4 label text-paper transition-colors hover:bg-ink-deep"
                  data-cursor="hover"
                >
                  Passer la commande
                  <IconArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
                <button
                  onClick={close}
                  className="mt-2.5 w-full py-2 label-xs text-ink/60 u-link transition-colors hover:text-ink"
                  data-cursor="hover"
                >
                  Continuer mes achats
                </button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
