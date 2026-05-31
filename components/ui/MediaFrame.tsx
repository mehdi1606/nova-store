"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
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
  /** scroll reveal (off for above-the-fold LCP images) */
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
 * object-fit cover with focal point, blur-up, a soft scroll reveal, and a slow
 * hover zoom — all honoring prefers-reduced-motion.
 *
 * The in-view trigger is attached to the *outer, untransformed* frame (via
 * `useInView`), never to the animating child. Observing the animated element
 * itself proved unreliable and used to leave frames stuck in their hidden state
 * (empty image boxes) — observing the stable container guarantees the reveal
 * always fires and the image is never left invisible. Same fix as MaskedHeading.
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const hidden = reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 };
  const shown = reduce ? { opacity: 1 } : { opacity: 1, scale: 1 };

  return (
    <div
      ref={ref}
      className={cn(
        "group relative overflow-hidden bg-paper-2",
        rounded && "rounded-[var(--radius-xs)]",
        ratioClass[ratio],
        className,
      )}
    >
      <motion.div
        className="absolute inset-0 will-change-transform"
        initial={reveal ? hidden : false}
        animate={reveal ? (inView ? shown : hidden) : false}
        transition={{ duration: 1.15, ease: EASE, delay }}
      >
        <div
          className={cn(
            "absolute inset-0",
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
      </motion.div>
      {overlay}
    </div>
  );
}
