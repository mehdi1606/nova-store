"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUI } from "@/lib/ui";
import { useCart, cartCount } from "@/lib/cart";
import { IconBag, IconMenu } from "@/components/Icons";
import { cn } from "@/lib/utils";
import MenuOverlay from "./MenuOverlay";

const announcements = [
  "Livraison offerte au Maroc dès 800 Dhs",
  "Collection Capsule 2026 — Couleur signature",
  "Retours gratuits sous 14 jours",
];

export default function Header() {
  const { menuOpen, setMenuOpen, darkHero } = useUI();
  const items = useCart((s) => s.items);
  const setCartOpen = useCart((s) => s.setOpen);
  const [scrolled, setScrolled] = useState(false);
  const [count, setCount] = useState(0);
  const [annIdx, setAnnIdx] = useState(0);

  useEffect(() => setCount(cartCount(items)), [items]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setAnnIdx((i) => (i + 1) % announcements.length), 4200);
    return () => clearInterval(t);
  }, []);

  // light text when transparent over a dark hero and not scrolled & menu closed
  const transparent = darkHero && !scrolled && !menuOpen;
  const light = transparent || menuOpen;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* announcement bar */}
        <div
          className={cn(
            "flex h-9 items-center justify-center overflow-hidden bg-ink text-paper transition-transform duration-500",
            scrolled && "-translate-y-full",
          )}
        >
          <div className="relative h-4 w-[80vw] max-w-md text-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={annIdx}
                className="label-xs absolute inset-0 text-paper/90"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
              >
                {announcements[annIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* main nav */}
        <nav
          className={cn(
            "relative flex items-center justify-between px-5 transition-[background-color,box-shadow,height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-8",
            scrolled ? "h-16" : "h-[4.5rem]",
            transparent
              ? "bg-transparent"
              : "bg-paper/90 shadow-[0_1px_0_rgba(14,28,48,0.08)] backdrop-blur-md",
          )}
        >
          {/* menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={cn(
              "group flex items-center gap-2.5 transition-colors",
              light ? "text-paper" : "text-ink",
            )}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            data-cursor="hover"
          >
            <IconMenu className="size-5" />
            <span className="label-xs hidden sm:inline">Menu</span>
          </button>

          {/* wordmark */}
          <Link
            href="/"
            aria-label="Nova Cavalia — accueil"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            data-cursor="hover"
          >
            <Image
              src={light ? "/wordmark-light.png" : "/wordmark-ink.png"}
              alt="Nova Cavalia"
              width={488}
              height={134}
              priority
              className={cn(
                "h-auto transition-all duration-500",
                scrolled ? "w-[112px]" : "w-[132px]",
              )}
            />
          </Link>

          {/* right */}
          <div className={cn("flex items-center gap-5", light ? "text-paper" : "text-ink")}>
            <Link
              href="/boutique"
              className="label-xs hidden u-link md:inline"
              data-cursor="hover"
            >
              Boutique
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2"
              aria-label="Ouvrir le panier"
              data-cursor="hover"
            >
              <IconBag className="size-5" />
              <span
                className={cn(
                  "label-xs tabular-nums",
                  count === 0 && "opacity-60",
                )}
              >
                {count}
              </span>
            </button>
          </div>
        </nav>
      </header>

      <MenuOverlay />
    </>
  );
}
