"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { IconClose } from "@/components/Icons";
import { lockScroll } from "@/lib/lenis";
import { EASE } from "@/lib/utils";
import type { Product } from "@/content/products";

const VET: Record<string, { poitrine: string; taille: string }> = {
  XS: { poitrine: "84", taille: "66" },
  S: { poitrine: "90", taille: "72" },
  M: { poitrine: "96", taille: "78" },
  L: { poitrine: "102", taille: "84" },
  XL: { poitrine: "110", taille: "92" },
  "34": { poitrine: "80", taille: "62" },
  "36": { poitrine: "84", taille: "66" },
  "38": { poitrine: "88", taille: "70" },
  "40": { poitrine: "92", taille: "74" },
  "42": { poitrine: "96", taille: "78" },
  "44": { poitrine: "100", taille: "82" },
  "46": { poitrine: "104", taille: "86" },
  "48": { poitrine: "108", taille: "90" },
  "50": { poitrine: "112", taille: "94" },
  "52": { poitrine: "116", taille: "98" },
  "54": { poitrine: "120", taille: "102" },
};

const TAPIS = [
  { taille: "Cob", dos: "55 cm", chute: "55 cm", profil: "Chevaux légers & poneys" },
  { taille: "Full", dos: "60 cm", chute: "60 cm", profil: "Chevaux de selle" },
];

export default function SizeGuide({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const allSizes =
    product.sizeType === "vetement"
      ? product.fits
        ? Array.from(
            new Set(
              Object.values(product.sizesByFit ?? {}).flatMap((s) =>
                s.map((x) => x.label),
              ),
            ),
          )
        : (product.sizes ?? []).map((s) => s.label)
      : [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[118]" initial="h" animate="s" exit="h">
          <motion.button
            aria-label="Fermer le guide des tailles"
            onClick={onClose}
            className="absolute inset-0 bg-ink-deep/55 backdrop-blur-[2px]"
            variants={{ h: { opacity: 0 }, s: { opacity: 1 } }}
            transition={{ duration: 0.4, ease: EASE }}
            data-cursor="hover"
          />
          <motion.aside
            className="absolute right-0 top-0 flex h-[100dvh] w-[min(480px,100vw)] flex-col bg-paper text-ink"
            variants={{
              h: reduce ? { opacity: 0 } : { x: "100%" },
              s: reduce ? { opacity: 1 } : { x: 0 },
            }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="font-display text-2xl font-[380]">Guide des tailles</h2>
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="group p-1 text-ink/70 hover:text-ink"
                data-cursor="hover"
              >
                <IconClose className="size-5 transition-transform duration-500 group-hover:rotate-90" />
              </button>
            </div>

            <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-6">
              <p className="text-sm leading-relaxed text-ink/70">
                {product.sizeNote}
              </p>

              {product.sizeType === "vetement" ? (
                <>
                  <table className="mt-7 w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink/15 text-left">
                        <th className="label py-3 text-[0.56rem] text-stone">Taille</th>
                        <th className="label py-3 text-[0.56rem] text-stone">Poitrine</th>
                        <th className="label py-3 text-[0.56rem] text-stone">Taille (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allSizes.map((s) => (
                        <tr key={s} className="border-b border-ink/8">
                          <td className="py-3 font-medium text-ink">{s}</td>
                          <td className="py-3 tabular-nums text-ink/70">
                            {VET[s]?.poitrine ?? "—"} cm
                          </td>
                          <td className="py-3 tabular-nums text-ink/70">
                            {VET[s]?.taille ?? "—"} cm
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-6 text-xs leading-relaxed text-ink/55">
                    Mesures du corps, en centimètres. Mesurez le tour de poitrine
                    à l&apos;endroit le plus fort et le tour de taille au plus
                    creux. En cas d&apos;hésitation entre deux tailles, choisissez
                    la plus grande.
                  </p>
                </>
              ) : (
                <table className="mt-7 w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-ink/15 text-left">
                      <th className="label py-3 text-[0.56rem] text-stone">Taille</th>
                      <th className="label py-3 text-[0.56rem] text-stone">Dos</th>
                      <th className="label py-3 text-[0.56rem] text-stone">Chute</th>
                      <th className="label py-3 text-[0.56rem] text-stone">Profil</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TAPIS.map((r) => (
                      <tr key={r.taille} className="border-b border-ink/8">
                        <td className="py-3 font-medium text-ink">{r.taille}</td>
                        <td className="py-3 tabular-nums text-ink/70">{r.dos}</td>
                        <td className="py-3 tabular-nums text-ink/70">{r.chute}</td>
                        <td className="py-3 text-ink/70">{r.profil}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
