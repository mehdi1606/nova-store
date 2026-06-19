"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue } from "framer-motion";
import { formatMAD, cn } from "@/lib/utils";
import { IconCheck } from "@/components/Icons";
import Reveal from "@/components/ui/Reveal";
import CTA from "@/components/ui/CTA";

type Fit = "Femme" | "Homme";

export type LookItem = {
  name: string;
  priceMAD: number;
  priceByFit?: Partial<Record<Fit, number>>;
};

/** A Dhs amount that smoothly counts to its latest value. */
function AnimatedDhs({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, mv]);
  return <>{formatMAD(display)}</>;
}

export default function LookSwitcher({
  items,
  savings,
}: {
  items: LookItem[];
  savings: number;
}) {
  const hasFits = items.some((i) => i.priceByFit);
  const [fit, setFit] = useState<Fit>("Femme");

  const priceOf = (i: LookItem) => i.priceByFit?.[fit] ?? i.priceMAD;
  const full = items.reduce((sum, i) => sum + priceOf(i), 0);
  const bundled = full - savings;

  return (
    <>
      {hasFits && (
        <Reveal delay={0.12}>
          <div className="mt-8 inline-flex rounded-full border border-paper/20 p-1">
            {(["Femme", "Homme"] as Fit[]).map((f) => (
              <button
                key={f}
                onClick={() => setFit(f)}
                data-cursor="hover"
                aria-pressed={fit === f}
                className={cn(
                  "rounded-full px-7 py-2 label-xs transition-colors",
                  fit === f
                    ? "bg-paper text-ink"
                    : "text-paper/60 hover:text-paper",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>
      )}

      <Reveal delay={0.15}>
        <ul className="mt-9 space-y-3 border-t border-paper/12 pt-7">
          {items.map((p) => (
            <li key={p.name} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-3 text-paper/85">
                <IconCheck className="size-4 text-or" />
                {p.name}
              </span>
              <span className="label-xs tabular-nums text-stone">
                {formatMAD(priceOf(p))}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-8 flex flex-wrap items-end gap-x-5 gap-y-2">
          <span className="font-display text-4xl font-[380] tabular-nums">
            <AnimatedDhs value={bundled} />
          </span>
          <span className="text-lg text-stone line-through tabular-nums">
            {formatMAD(full)}
          </span>
          <span className="label-xs rounded-full border border-or/35 px-3.5 py-1.5 text-or-soft">
            Économisez {formatMAD(savings)}
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.25}>
        <div className="mt-9">
          <CTA href="/boutique#look" variant="light">
            Composer le look
          </CTA>
        </div>
      </Reveal>
    </>
  );
}
