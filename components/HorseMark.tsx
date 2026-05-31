import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

/**
 * The Nova Cavalia leaping-horse mark — the authentic line art from the logo,
 * rendered as a CSS-masked element so it inherits `color` (fully recolorable)
 * and stays crisp on any background. Width is set by the consumer; height
 * follows the 718:409 aspect ratio.
 */
export default function HorseMark({
  className,
  title,
  style,
}: {
  className?: string;
  title?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn("nc-horse", className)}
      style={style}
    />
  );
}
