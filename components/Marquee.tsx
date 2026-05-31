import { cn } from "@/lib/utils";
import HorseMark from "./HorseMark";
import type { CSSProperties } from "react";

/** Seamless infinite marquee (duplicated track). */
export default function Marquee({
  items,
  duration = 42,
  className,
  itemClassName,
}: {
  items: string[];
  duration?: number;
  className?: string;
  itemClassName?: string;
}) {
  const Track = () => (
    <div className="flex shrink-0 items-center" aria-hidden>
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className={cn("px-8", itemClassName)}>{t}</span>
          <HorseMark className="w-8 shrink-0 opacity-50" />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn("relative flex w-full overflow-hidden", className)}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
    >
      <div className="flex animate-marquee whitespace-nowrap will-change-transform">
        <Track />
        <Track />
      </div>
    </div>
  );
}
