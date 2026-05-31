"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { ElementType } from "react";
import { EASE, cn } from "@/lib/utils";

type Props = {
  lines: string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  amount?: number;
};

/**
 * Line-by-line masked reveal — each line rises out of an overflow-hidden mask.
 *
 * The in-view trigger is attached to the heading *container* (a normal,
 * untranslated element), never to the translated inner line. Observing the
 * translated/clipped child is unreliable and used to leave headings stuck in
 * their hidden state; observing the container guarantees the reveal always
 * fires and the headline is never left invisible.
 */
export default function MaskedHeading({
  lines,
  as: Tag = "h2",
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  amount = 0.3,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount });

  const hidden = reduce ? { opacity: 0 } : { y: "115%" };
  const shown = reduce ? { opacity: 1 } : { y: "0%" };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} aria-label={lines.join(" ")}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]" aria-hidden>
          <motion.span
            className={cn("block will-change-transform", lineClassName)}
            initial={hidden}
            animate={inView ? shown : hidden}
            transition={{ duration: 1.05, ease: EASE, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
