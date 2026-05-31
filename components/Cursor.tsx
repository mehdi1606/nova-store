"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** Minimal custom cursor: a precise dot + a lagging ring that scales on
 *  interactive elements. Desktop (fine pointer) only; off on touch. */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 32, mass: 0.4 });
  const ry = useSpring(y, { stiffness: 350, damping: 32, mass: 0.4 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.body.classList.add("has-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      setHover(
        !!t?.closest(
          'a,button,[data-cursor="hover"],input,textarea,select,label,summary',
        ),
      );
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      document.body.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] mix-blend-difference">
      <motion.span
        className="absolute block rounded-full border border-white"
        style={{ x: rx, y: ry, marginLeft: -16, marginTop: -16 }}
        animate={{ width: hover ? 52 : 32, height: hover ? 52 : 32, marginLeft: hover ? -26 : -16, marginTop: hover ? -26 : -16 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      />
      <motion.span
        className="absolute block rounded-full bg-white"
        style={{ x, y, marginLeft: -3, marginTop: -3 }}
        animate={{ scale: hover ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      >
        <span className="block size-[6px]" />
      </motion.span>
    </div>
  );
}
