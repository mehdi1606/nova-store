"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import SmartImage from "./SmartImage";
import type { ImageKey, ImageAsset } from "@/lib/images";
import { EASE, cn } from "@/lib/utils";

type Ratio = "tall" | "portrait" | "square" | "landscape" | "wide" | "auto";

const ratioClass: Record<Ratio, string> = {
  tall: "aspect-[3/4]",
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
  auto: "",
};

type Props = {
  image: ImageKey | ImageAsset;
  alt?: string;
  ratio?: Ratio;
  sizes?: string;
  position?: string;
  priority?: boolean;
  grayscale?: boolean;
  /** scroll clip-path reveal (off for above-the-fold LCP images) */
  reveal?: boolean;
  /** slow hover zoom (responds to hover on this frame) */
  zoom?: boolean;
  rounded?: boolean;
  className?: string;
  /** absolutely-positioned children: gradients, labels, captions */
  overlay?: ReactNode;
  delay?: number;
};

/**
 * The single image-presentation primitive for Nova Cavalia. Consistent ratio,
 * object-fit cover with focal point, blur-up, a cinematic clip-path reveal on
 * scroll, and a slow hover zoom — all honoring prefers-reduced-motion.
 */
export default function MediaFrame({
  image,
  alt,
  ratio = "portrait",
  sizes = "(min-width: 1024px) 45vw, 100vw",
  position = "50% 50%",
  priority = false,
  grayscale = false,
  reveal = true,
  zoom = true,
  rounded = true,
  className,
  overlay,
  delay = 0,
}: Props) {
  const reduce = useReducedMotion();
  const doReveal = reveal && !reduce;

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden bg-paper-2",
        rounded && "rounded-[var(--radius-xs)]",
        ratioClass[ratio],
        className,
      )}
      initial={
        doReveal
          ? { clipPath: "inset(0 0 100% 0)", opacity: 0.6 }
          : reduce && reveal
            ? { opacity: 0 }
            : false
      }
      whileInView={
        doReveal
          ? { clipPath: "inset(0 0 0% 0)", opacity: 1 }
          : reduce && reveal
            ? { opacity: 1 }
            : undefined
      }
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.15, ease: EASE, delay }}
    >
      <div
        className={cn(
          "absolute inset-0 will-change-transform",
          zoom &&
            "transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]",
        )}
      >
        <SmartImage
          image={image}
          alt={alt}
          fill
          sizes={sizes}
          position={position}
          priority={priority}
          grayscale={grayscale}
        />
      </div>
      {overlay}
    </motion.div>
  );
}
