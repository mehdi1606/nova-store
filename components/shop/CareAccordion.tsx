"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { IconChevronDown } from "@/components/Icons";
import { EASE } from "@/lib/utils";
import type { ProductDetail } from "@/content/products";

export default function CareAccordion({ details }: { details: ProductDetail[] }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(0);

  return (
    <div className="divide-y divide-ink/12 border-y border-ink/12">
      {details.map((d, i) => {
        const isOpen = open === i;
        return (
          <div key={d.title}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
              aria-expanded={isOpen}
              data-cursor="hover"
            >
              <span className="font-display text-lg font-[380] text-ink">
                {d.title}
              </span>
              <IconChevronDown
                className={`size-5 shrink-0 text-ink/60 transition-transform duration-500 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 pr-8 text-sm leading-relaxed text-ink/70">
                    {d.body}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
