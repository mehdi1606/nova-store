"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useUI } from "@/lib/ui";
import { lockScroll } from "@/lib/lenis";
import { EASE } from "@/lib/utils";
import SmartImage from "./ui/SmartImage";
import HorseMark from "./HorseMark";
import { IconClose, IconArrowUpRight, IconInstagram } from "@/components/Icons";
import type { ImageKey } from "@/lib/images";

type NavLink = {
  label: string;
  href: string;
  index: string;
  image: ImageKey;
  note: string;
};

const links: NavLink[] = [
  { label: "Accueil", href: "/", index: "01", image: "hero-rider-horse", note: "Le seuil de la maison" },
  { label: "La Boutique", href: "/boutique", index: "02", image: "veste-studio", note: "Trois pièces, une signature" },
  { label: "Notre Histoire", href: "/histoire", index: "03", image: "stable-atmosphere", note: "Depuis 2026, au Maroc" },
  { label: "Le Journal", href: "/journal", index: "04", image: "ed-look", note: "Regards & coulisses" },
  { label: "Contact", href: "/contact", index: "05", image: "ed-stable", note: "Écrivez-nous" },
];

export default function MenuOverlay() {
  const reduce = useReducedMotion();
  const menuOpen = useUI((s) => s.menuOpen);
  const setMenuOpen = useUI((s) => s.setMenuOpen);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!menuOpen) return;
    lockScroll(true);
    setActive(0);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, setMenuOpen]);

  const close = () => setMenuOpen(false);

  const overlayV = {
    hidden: reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" },
    show: reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" },
    exit: reduce ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)" },
  };

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          key="menu"
          className="vignette fixed inset-0 z-[100] flex flex-col bg-ink-deep text-paper"
          variants={overlayV}
          initial="hidden"
          animate="show"
          exit="exit"
          transition={{ duration: reduce ? 0.3 : 0.8, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
        >
          {/* top bar — mirrors the header */}
          <div className="relative flex h-[4.5rem] shrink-0 items-center justify-between px-5 sm:px-8">
            <button
              onClick={close}
              className="group flex items-center gap-2.5 text-paper"
              aria-label="Fermer le menu"
              data-cursor="hover"
            >
              <IconClose className="size-5 transition-transform duration-500 group-hover:rotate-90" />
              <span className="label-xs">Fermer</span>
            </button>

            <Link
              href="/"
              onClick={close}
              aria-label="Nova Cavalia — accueil"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              data-cursor="hover"
            >
              <Image
                src="/wordmark-light.png"
                alt="Nova Cavalia"
                width={488}
                height={134}
                priority
                className="h-auto w-[120px]"
              />
            </Link>
          </div>

          {/* body */}
          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_minmax(360px,40%)]">
            {/* nav column */}
            <nav className="flex min-h-0 flex-col justify-center px-5 sm:px-8 lg:px-14">
              <motion.span
                className="label-xs mb-7 block text-or-soft"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduce ? 0.05 : 0.35, duration: 0.6 }}
              >
                Naviguer
              </motion.span>

              <ul className="flex flex-col">
                {links.map((l, i) => (
                  <li key={l.href} className="overflow-hidden">
                    <motion.div
                      initial={reduce ? { opacity: 0 } : { y: "115%" }}
                      animate={reduce ? { opacity: 1 } : { y: "0%" }}
                      transition={{
                        delay: (reduce ? 0.06 : 0.32) + i * 0.06,
                        duration: 0.7,
                        ease: EASE,
                      }}
                    >
                      <Link
                        href={l.href}
                        onClick={close}
                        onMouseEnter={() => setActive(i)}
                        onFocus={() => setActive(i)}
                        data-cursor="hover"
                        className="group flex items-baseline gap-4 py-1.5 sm:gap-6"
                      >
                        <span className="label-xs w-7 shrink-0 text-stone/70 transition-colors group-hover:text-or">
                          {l.index}
                        </span>
                        <span
                          className={
                            "font-display text-[2.4rem] font-[380] leading-[1.04] tracking-tight transition-colors duration-300 group-hover:text-or-soft sm:text-[3.4rem] lg:text-[4rem]"
                          }
                        >
                          {l.label}
                        </span>
                        <IconArrowUpRight className="size-5 translate-y-1 self-center text-or opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" />
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>

              {/* footer row */}
              <motion.div
                className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-paper/12 pt-7"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0.1 : 0.7, duration: 0.7, ease: EASE }}
              >
                <a
                  href="https://instagram.com/novacavalia"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2.5 text-paper/80 transition-colors hover:text-paper"
                  data-cursor="hover"
                >
                  <IconInstagram className="size-4" />
                  <span className="label-xs">Instagram</span>
                </a>
                <a
                  href="mailto:contact@novacavalia.com"
                  className="label-xs text-paper/80 u-link transition-colors hover:text-paper"
                  data-cursor="hover"
                >
                  contact@novacavalia.com
                </a>
                <span className="label-xs ml-auto hidden text-stone/70 sm:inline">
                  Riding Team — Est. 2026
                </span>
              </motion.div>
            </nav>

            {/* featured image column (desktop) */}
            <div className="relative hidden overflow-hidden lg:block">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: active === i ? 1 : 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  <SmartImage
                    image={l.image}
                    fill
                    sizes="40vw"
                    position="50% 35%"
                    className="scale-105"
                  />
                </motion.div>
              ))}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-deep/70 via-transparent to-ink-deep/20" />

              <HorseMark className="pointer-events-none absolute bottom-8 right-8 w-24 text-paper/85" />

              <div className="pointer-events-none absolute bottom-8 left-8 max-w-[60%]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={active}
                    className="label-xs text-paper/90"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    {links[active].note}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
