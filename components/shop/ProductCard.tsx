"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import SmartImage from "@/components/ui/SmartImage";
import { IconArrowUpRight } from "@/components/Icons";
import { EASE, formatMAD } from "@/lib/utils";
import type { Product } from "@/content/products";

export default function ProductCard({
  product,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  delay = 0,
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const futureColors = product.colors.filter((c) => !c.available).length;

  const hidden = reduce ? { opacity: 0 } : { opacity: 0, scale: 1.03 };
  const shown = reduce ? { opacity: 1 } : { opacity: 1, scale: 1 };

  return (
    <Link
      ref={ref}
      href={`/produit/${product.slug}`}
      data-cursor="hover"
      className="group block"
    >
      <motion.div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-xs)] bg-paper-2"
        initial={hidden}
        animate={inView ? shown : hidden}
        transition={{ duration: 1, ease: EASE, delay }}
      >
        {/* base */}
        <SmartImage
          image={product.card}
          fill
          sizes={sizes}
          priority={priority}
          position="50% 30%"
          className="transition-opacity duration-700 group-hover:opacity-0"
        />
        {/* hover */}
        <SmartImage
          image={product.cardHover}
          fill
          sizes={sizes}
          position="50% 30%"
          className="scale-[1.03] opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100"
        />

        <span className="label-xs absolute left-4 top-4 rounded-full bg-paper/85 px-3 py-1.5 text-ink backdrop-blur-sm">
          {product.category === "cheval" ? "Cheval" : "Cavalier"}
        </span>

        <span className="absolute bottom-4 right-4 flex size-11 items-center justify-center rounded-full bg-paper text-ink opacity-0 transition-all duration-500 group-hover:opacity-100">
          <IconArrowUpRight className="size-5" />
        </span>
      </motion.div>

      <div className="mt-5 flex items-start justify-between gap-5">
        <div>
          <h3 className="font-display text-[1.35rem] font-[380] leading-tight text-ink transition-colors duration-300 group-hover:text-leather">
            {product.name}
          </h3>
          <p className="mt-1.5 text-sm text-ink/55">{product.tagline}</p>
        </div>
        <span className="shrink-0 pt-1 font-display text-lg font-[380] tabular-nums text-ink">
          {formatMAD(product.priceMAD)}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {product.colors.map((c) => (
          <span
            key={c.name}
            title={c.name}
            className="size-3.5 rounded-full ring-1 ring-ink/15"
            style={{ backgroundColor: c.hex, opacity: c.available ? 1 : 0.4 }}
          />
        ))}
        {futureColors > 0 && (
          <span className="label-xs ml-1 text-stone">+{futureColors} bientôt</span>
        )}
      </div>
    </Link>
  );
}
