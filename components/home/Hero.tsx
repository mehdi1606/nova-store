"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import DarkHero from "@/components/DarkHero";
import SmartImage from "@/components/ui/SmartImage";
import MaskedHeading from "@/components/ui/MaskedHeading";
import CTA from "@/components/ui/CTA";
import HorseMark from "@/components/HorseMark";
import { IconArrowRight } from "@/components/Icons";
import { EASE } from "@/lib/utils";

export default function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "16%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.14]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-ink-deep text-paper"
    >
      <DarkHero />

      <motion.div style={{ y, scale }} className="absolute inset-0">
        <SmartImage
          image="hero-rider-horse"
          priority
          fill
          sizes="100vw"
          position="50% 28%"
          className="h-full w-full"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-ink-deep/45 via-ink-deep/15 to-ink-deep/85" />
      <div className="vignette absolute inset-0" />

      <motion.div
        style={{ opacity: fade }}
        className="edge-x relative z-10 flex h-full flex-col justify-end pb-[13svh]"
      >
        <motion.span
          className="label mb-5 inline-flex items-center gap-3 text-or-soft"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.9, ease: EASE }}
        >
          <HorseMark className="w-6 text-or-soft" />
          Collection Capsule 2026
        </motion.span>

        <MaskedHeading
          as="h1"
          lines={["L'allure du concours,", "l'âme de l'écurie."]}
          className="max-w-[18ch] font-display text-[clamp(2.6rem,8vw,6.4rem)] font-[380] leading-[0.96]"
          delay={0.25}
        />

        <motion.p
          className="mt-6 max-w-md text-base text-paper/80 sm:text-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: EASE }}
        >
          Maison équestre marocaine fondée en 2026. Trois pièces signées d&apos;un
          cheval brodé — l&apos;histoire à portée.
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.9, ease: EASE }}
        >
          <CTA href="/boutique" variant="light">
            Découvrir la collection
          </CTA>
          <Link
            href="/histoire"
            className="group inline-flex items-center gap-2 label text-paper/90 transition-colors hover:text-or"
            data-cursor="hover"
          >
            Notre histoire
            <IconArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity: fade }}
        className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 1 }}
      >
        <span className="label-xs text-paper/70">Défiler</span>
        <motion.span
          className="block h-9 w-px bg-paper/40"
          animate={reduce ? {} : { scaleY: [0.3, 1, 0.3], originY: 0 }}
          transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
