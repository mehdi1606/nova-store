"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmartImage from "@/components/ui/SmartImage";
import HorseMark from "@/components/HorseMark";
import { IconArrowRight } from "@/components/Icons";
import { formatMAD } from "@/lib/utils";
import type { ImageKey } from "@/lib/images";
import type { Product } from "@/content/products";

const order = ["veste-de-concours", "tapis-de-selle", "sweat-nova"];
const heroBySlug: Record<string, { image: ImageKey; position: string }> = {
  "veste-de-concours": { image: "veste-studio", position: "50% 25%" },
  "tapis-de-selle": { image: "tapis-on-horse", position: "50% 45%" },
  "sweat-nova": { image: "sweat-back-2", position: "50% 30%" },
};

export default function PiecesScroll({ products }: { products: Product[] }) {
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const chapters = order
    .map((slug, i) => {
      const p = bySlug.get(slug);
      return p
        ? { ...p, n: String(i + 1).padStart(2, "0"), ...heroBySlug[slug] }
        : null;
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const track = trackRef.current;
        const section = sectionRef.current;
        if (!track || !section) return;
        const distance = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + distance(),
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        });
      },
    );
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-ink text-paper lg:h-[100svh] lg:overflow-hidden"
      aria-label="Les pièces de la collection"
    >
      <div
        ref={trackRef}
        className="no-scrollbar flex gap-4 px-4 py-16 max-lg:snap-x max-lg:snap-mandatory max-lg:overflow-x-auto sm:gap-6 sm:px-6 lg:h-full lg:items-stretch lg:gap-0 lg:p-0"
      >
        {/* intro panel */}
        <div className="relative flex w-[86vw] shrink-0 snap-center flex-col justify-center rounded-[2px] border border-paper/12 px-8 py-12 sm:w-[58vw] lg:h-full lg:w-screen lg:rounded-none lg:border-0 lg:px-[8vw]">
          <HorseMark className="mb-8 w-14 text-or" />
          <span className="label text-or-soft">La collection</span>
          <h2 className="mt-5 max-w-[12ch] font-display text-[clamp(2.4rem,5vw,5rem)] font-[380] leading-[0.98]">
            Les Pièces
          </h2>
          <p className="mt-6 max-w-sm text-base text-paper/75 sm:text-lg">
            Trois objets, une signature. Faites défiler pour les parcourir, un à
            un, comme on inspecte une sellerie.
          </p>
          <div className="mt-8 hidden items-center gap-2 text-paper/60 lg:flex">
            <span className="label-xs">Défiler</span>
            <IconArrowRight className="size-4" />
          </div>
        </div>

        {/* product panels */}
        {chapters.map((c, i) => (
          <article
            key={c.slug}
            className="piece-panel relative flex w-[86vw] shrink-0 snap-center flex-col overflow-hidden rounded-[2px] bg-ink-soft sm:w-[64vw] lg:h-full lg:w-screen lg:grid lg:grid-cols-2 lg:rounded-none"
          >
            {/* image */}
            <div
              className={`relative h-[46%] w-full overflow-hidden lg:h-full ${
                i % 2 === 1 ? "lg:order-2" : ""
              }`}
            >
              <SmartImage
                image={c.image}
                fill
                sizes="(min-width: 1024px) 50vw, 86vw"
                position={c.position}
              />
              <span className="absolute left-6 top-5 font-display text-[clamp(3rem,5vw,4.5rem)] font-[380] leading-none text-paper/90">
                {c.n}
              </span>
            </div>

            {/* text */}
            <div className="flex flex-1 flex-col justify-center gap-5 p-8 sm:p-12 lg:px-[8vw]">
              <span className="label text-or-soft">
                {c.category === "cheval" ? "Pour le cheval" : "Pour le cavalier"}
              </span>
              <h3 className="font-display text-[clamp(2.2rem,3.6vw,3.8rem)] font-[380] leading-[1.02]">
                {c.name}
              </h3>
              <p className="display-italic font-display text-lg text-or-soft sm:text-xl">
                {c.tagline}
              </p>
              <p className="max-w-md text-sm text-paper/75 sm:text-base">
                {c.shortDesc}
              </p>
              <div className="mt-3 flex items-center gap-6">
                <span className="font-display text-2xl font-[380] tabular-nums">
                  {formatMAD(c.priceMAD)}
                </span>
                <Link
                  href={`/produit/${c.slug}`}
                  data-cursor="hover"
                  className="group inline-flex items-center gap-2.5 rounded-[2px] bg-paper px-6 py-3 label text-ink transition-colors hover:bg-or"
                >
                  Découvrir
                  <IconArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* scroll progress (desktop pinned act) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden h-px bg-paper/15 lg:block">
        <span
          ref={progressRef}
          className="block h-full origin-left bg-or"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </section>
  );
}
