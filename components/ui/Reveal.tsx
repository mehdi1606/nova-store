"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { EASE } from "@/lib/utils";

type Props = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
};

/** Fade + rise on scroll into view. Honors reduced motion. */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  once = true,
  amount = 0.3,
  ...rest
}: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
