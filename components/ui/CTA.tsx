"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import MagneticButton from "./MagneticButton";
import { IconArrowRight } from "@/components/Icons";

type Variant = "solid" | "outline" | "light" | "ghost";

const styles: Record<Variant, string> = {
  solid: "bg-ink text-paper hover:bg-ink-deep",
  outline:
    "border border-ink/25 text-ink hover:bg-ink hover:text-paper hover:border-ink",
  light: "bg-paper text-ink hover:bg-or hover:text-ink",
  ghost: "text-ink hover:text-or",
};

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
  magnetic?: boolean;
  type?: "button" | "submit";
  ariaLabel?: string;
};

export default function CTA({
  children,
  href,
  onClick,
  variant = "solid",
  className,
  arrow = true,
  magnetic = true,
  type = "button",
  ariaLabel,
}: Props) {
  const cls = cn(
    "group inline-flex items-center justify-center gap-3 rounded-[2px] px-8 py-4 label transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
    styles[variant],
    className,
  );

  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <IconArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
      )}
    </>
  );

  const node = href ? (
    <Link href={href} className={cls} aria-label={ariaLabel} data-cursor="hover">
      {inner}
    </Link>
  ) : (
    <button
      type={type}
      onClick={onClick}
      className={cls}
      aria-label={ariaLabel}
      data-cursor="hover"
    >
      {inner}
    </button>
  );

  return magnetic ? <MagneticButton>{node}</MagneticButton> : node;
}
