import Image from "next/image";
import { img, type ImageKey, type ImageAsset } from "@/lib/images";
import { cn } from "@/lib/utils";

type Props = {
  image: ImageKey | ImageAsset;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  position?: string;
  grayscale?: boolean;
  quality?: number;
};

/** next/image wrapper bound to the optimised manifest (blur, intrinsic size, alt). */
export default function SmartImage({
  image,
  alt,
  className,
  sizes = "100vw",
  priority = false,
  fill = true,
  position = "50% 50%",
  grayscale = false,
  quality = 82,
}: Props) {
  const a = typeof image === "string" ? img(image) : image;
  const resolvedAlt = alt ?? a.alt;
  const shared = {
    src: a.src,
    sizes,
    priority,
    quality,
    className: cn("object-cover", grayscale && "grayscale", className),
    style: { objectPosition: position },
    // Uploaded images may not ship a blur placeholder — fall back gracefully.
    ...(a.blur ? { placeholder: "blur" as const, blurDataURL: a.blur } : {}),
  };
  return fill ? (
    <Image fill alt={resolvedAlt} {...shared} />
  ) : (
    <Image width={a.w} height={a.h} alt={resolvedAlt} {...shared} />
  );
}
