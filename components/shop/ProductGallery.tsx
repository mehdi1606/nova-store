"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SmartImage from "@/components/ui/SmartImage";
import { IconClose, IconPlus } from "@/components/Icons";
import { lockScroll } from "@/lib/lenis";
import { EASE, cn } from "@/lib/utils";
import type { ImageRef } from "@/lib/images";

export default function ProductGallery({
  images,
  name,
}: {
  images: ImageRef[];
  name: string;
}) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (!zoom) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [zoom, images.length]);

  return (
    <div className="lg:grid lg:grid-cols-[80px_1fr] lg:gap-4">
      {/* thumbnails */}
      <div className="order-2 mt-3 flex gap-3 overflow-x-auto lg:order-1 lg:mt-0 lg:flex-col lg:overflow-visible no-scrollbar">
        {images.map((img, i) => (
          <button
            key={(typeof img === "string" ? img : img.src) + i}
            onClick={() => setIndex(i)}
            data-cursor="hover"
            aria-label={`Voir l'image ${i + 1}`}
            className={cn(
              "relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-[2px] bg-paper-2 ring-1 transition-all lg:w-full",
              index === i ? "ring-ink" : "ring-transparent opacity-70 hover:opacity-100",
            )}
          >
            <SmartImage image={img} fill sizes="80px" position="50% 30%" />
          </button>
        ))}
      </div>

      {/* main */}
      <div className="order-1 lg:order-2">
        <button
          onClick={() => setZoom(true)}
          data-cursor="hover"
          aria-label="Agrandir l'image"
          className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-paper-2"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <SmartImage
                image={images[index]}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                position="50% 28%"
                className="transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />
            </motion.div>
          </AnimatePresence>
          <span className="absolute bottom-4 right-4 flex size-9 items-center justify-center rounded-full bg-paper/85 text-ink backdrop-blur-sm">
            <IconPlus className="size-4" />
          </span>
        </button>
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            className="fixed inset-0 z-[119] flex flex-col bg-ink-deep/96"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="flex items-center justify-between px-6 py-5 text-paper">
              <span className="label-xs text-paper/80">
                {name} — {index + 1}/{images.length}
              </span>
              <button
                onClick={() => setZoom(false)}
                aria-label="Fermer"
                className="group p-1 text-paper/80 hover:text-paper"
                data-cursor="hover"
              >
                <IconClose className="size-6 transition-transform duration-500 group-hover:rotate-90" />
              </button>
            </div>
            <div
              className="relative flex-1 cursor-zoom-out"
              onClick={() => setZoom(false)}
              role="button"
              tabIndex={-1}
            >
              <SmartImage
                image={images[index]}
                fill
                sizes="100vw"
                position="50% 30%"
                className="!object-contain p-4"
              />
            </div>
            <div className="flex justify-center gap-2 px-6 py-5">
              {images.map((img, i) => (
                <button
                  key={(typeof img === "string" ? img : img.src) + i}
                  onClick={() => setIndex(i)}
                  aria-label={`Image ${i + 1}`}
                  data-cursor="hover"
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    index === i ? "w-7 bg-paper" : "w-1.5 bg-paper/40 hover:bg-paper/70",
                  )}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
