"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import SmartImage from "@/components/ui/SmartImage";
import MaskedHeading from "@/components/ui/MaskedHeading";
import HorseMark from "@/components/HorseMark";
import { IconArrowRight } from "@/components/Icons";
import type { ImageKey } from "@/lib/images";

type Slide = {
  image: ImageKey;
  position: string;
  label: string;
  title: string;
};

const slides: Slide[] = [
  { image: "ed-1", position: "50% 32%", label: "Concours", title: "L'instant" },
  { image: "ed-look", position: "50% 22%", label: "Allure", title: "La silhouette" },
  { image: "ed-stable", position: "50% 38%", label: "Écurie", title: "Au repos" },
  { image: "ed-arena", position: "50% 30%", label: "Carrière", title: "L'échauffement" },
  { image: "ed-5", position: "50% 30%", label: "Lien", title: "La complicité" },
  { image: "ed-bw-1", position: "50% 24%", label: "Studio", title: "Le portrait" },
  { image: "ed-3", position: "50% 28%", label: "Aube", title: "La lumière" },
  { image: "hero-grey-walk", position: "50% 30%", label: "Dehors", title: "La sortie" },
  { image: "ed-look-2", position: "50% 26%", label: "Capsule", title: "En mouvement" },
];

const BASE_VELOCITY = -32;

/** Keep a value inside [min, max), wrapping around — used to loop the marquee. */
function wrap(min: number, max: number, v: number) {
  const range = max - min;
  const mod = (((v - min) % range) + range) % range;
  return mod + min;
}

function Card({ slide, index }: { slide: Slide; index: number }) {
  return (
    <article className="group/card relative mr-4 aspect-[4/5] w-[74vw] shrink-0 overflow-hidden rounded-[var(--radius-xs)] bg-ink-soft sm:mr-5 sm:w-[46vw] lg:w-[29vw] xl:w-[23vw]">
      {/* image — pointer-events-none so the drag gesture passes through */}
      <div className="pointer-events-none absolute inset-0">
        <SmartImage
          image={slide.image}
          fill
          sizes="(min-width:1280px) 23vw, (min-width:1024px) 29vw, (min-width:640px) 46vw, 74vw"
          position={slide.position}
          className="scale-[1.02] transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/15 to-transparent" />
      </div>

      {/* index */}
      <span className="pointer-events-none absolute left-4 top-4 font-display text-sm tabular-nums text-paper/85">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* caption — frosted only on hover for performance */}
      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 rounded-[var(--radius-xs)] border border-paper/15 bg-ink-deep/35 px-4 py-3 transition-colors duration-500 group-hover/card:border-or/40 group-hover/card:backdrop-blur-md">
        <div className="min-w-0">
          <span className="label-xs block text-or-soft">{slide.label}</span>
          <span className="mt-1 block truncate font-display text-lg leading-none text-paper">
            {slide.title}
          </span>
        </div>
        <span className="mb-0.5 size-1.5 shrink-0 rounded-full bg-or/70 transition-transform duration-500 group-hover/card:scale-150" />
      </div>
    </article>
  );
}

export default function Defile() {
  const reduce = useReducedMotion();

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 60, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 4], { clamp: false });

  const setRef = useRef<HTMLDivElement>(null);
  const [setWidth, setSetWidth] = useState(0);

  // Measure the width of a single slide-set so we can wrap seamlessly.
  useEffect(() => {
    const el = setRef.current;
    if (!el) return;
    const measure = () => setSetWidth(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const x = useTransform(baseX, (v) =>
    setWidth ? `${wrap(-setWidth, 0, v)}px` : "0px",
  );

  const directionFactor = useRef(1);
  const dragging = useRef(false);

  useAnimationFrame((_, delta) => {
    if (reduce || dragging.current || !setWidth) return;
    let moveBy = directionFactor.current * BASE_VELOCITY * (delta / 1000);

    const vf = velocityFactor.get();
    if (vf < 0) directionFactor.current = -1;
    else if (vf > 0) directionFactor.current = 1;

    moveBy += directionFactor.current * moveBy * vf;
    baseX.set(baseX.get() + moveBy);
  });

  // Pointer drag — works for mouse and touch (touch-pan-y lets the page scroll vertically).
  const lastX = useRef(0);
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    dragging.current = true;
    lastX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    baseX.set(baseX.get() + dx);
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }
  };

  return (
    <section className="section-y relative overflow-hidden bg-ink-deep text-paper">
      <div className="edge-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="label inline-flex items-center gap-3 text-or-soft">
              <HorseMark className="w-5 text-or" />
              En mouvement
            </span>
            <MaskedHeading
              lines={["La maison,", "image par image."]}
              className="mt-7 max-w-[16ch] font-display text-[clamp(2rem,5vw,4rem)] font-[380] leading-[1.04] text-paper"
              stagger={0.1}
            />
          </div>
          <p className="max-w-md text-pretty text-base leading-relaxed text-paper/65 sm:text-lg">
            Du concours à la lumière du matin — faites glisser pour parcourir
            l&apos;univers Nova Cavalia, cliché après cliché.
          </p>
        </div>
      </div>

      {/* marquee viewport — full-bleed, edges feathered into the navy */}
      <div className="relative mt-12 sm:mt-16">
        <div
          className="cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
          onDragStart={(e) => e.preventDefault()}
        >
          {reduce ? (
            // Reduced-motion: a plain, accessible horizontal scroller.
            <div className="no-scrollbar flex overflow-x-auto pl-4 sm:pl-6">
              {slides.map((slide, i) => (
                <Card key={slide.image} slide={slide} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              style={{ x }}
              className="flex w-max flex-nowrap pl-4 will-change-transform sm:pl-6"
            >
              <div ref={setRef} className="flex flex-nowrap">
                {slides.map((slide, i) => (
                  <Card key={`a-${slide.image}`} slide={slide} index={i} />
                ))}
              </div>
              <div className="flex flex-nowrap" aria-hidden>
                {slides.map((slide, i) => (
                  <Card key={`b-${slide.image}`} slide={slide} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-ink-deep to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-ink-deep to-transparent sm:w-24" />
      </div>

      {/* footer hint + link */}
      <div className="edge-x mt-12 flex items-center justify-between">
        <span className="label-xs inline-flex items-center gap-2 text-paper/50">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M8 7l-4 5 4 5M16 7l4 5-4 5M4 12h16" />
          </svg>
          Glissez pour explorer
        </span>
        <Link
          href="/journal"
          data-cursor="hover"
          className="group inline-flex items-center gap-2 text-sm text-paper/80 transition-colors hover:text-paper"
        >
          <span className="relative">
            Voir le journal
            <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-or transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
          </span>
          <IconArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
