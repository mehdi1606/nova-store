"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import HorseMark from "./HorseMark";
import { lockScroll } from "@/lib/lenis";
import { EASE } from "@/lib/utils";

export default function Preloader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("nc-preloaded")) {
      setShow(false);
      return;
    }
    lockScroll(true);
    const total = reduce ? 600 : 2500;
    const t = setTimeout(() => {
      sessionStorage.setItem("nc-preloaded", "1");
      lockScroll(false);
      setShow(false);
    }, total);
    return () => {
      clearTimeout(t);
      lockScroll(false);
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-ink-deep"
          initial={{ y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: 1, ease: EASE }}
        >
          <div className="flex flex-col items-center px-8">
            <motion.div
              className="w-[min(58vw,340px)] text-or-soft"
              initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 100% 0 0)", opacity: 0.25 }}
              animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0% 0 0)", opacity: 1 }}
              transition={{ duration: 1.25, ease: EASE, delay: 0.15 }}
            >
              <HorseMark className="w-full" title="Nova Cavalia" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: reduce ? 0.1 : 1.05 }}
              className="mt-9 w-[min(50vw,260px)]"
            >
              <Image
                src="/wordmark-light.png"
                alt="Nova Cavalia"
                width={488}
                height={134}
                priority
                className="h-auto w-full opacity-90"
              />
            </motion.div>
          </div>

          {!reduce && (
            <motion.span
              className="label absolute bottom-10 text-stone/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0.8] }}
              transition={{ duration: 1.6, ease: "easeInOut", delay: 0.6 }}
            >
              Riding Team — Est. 2026
            </motion.span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
