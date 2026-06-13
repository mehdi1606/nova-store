import data from "@/content/images.json";

export type ImageAsset = {
  src: string;
  w: number;
  h: number;
  blur: string;
  alt: string;
  role: "hero" | "product" | "editorial" | "macro";
  source: string;
};

const images = data as Record<string, ImageAsset>;

export type ImageKey = keyof typeof data;

/** Typed accessor for an optimised image (src, intrinsic size, blurDataURL, alt). */
export function img(key: ImageKey): ImageAsset {
  const a = images[key as string];
  if (!a) throw new Error(`Unknown image key: ${String(key)}`);
  return a;
}

/** An image is either a bundled manifest key or a ready-made asset (e.g. uploaded). */
export type ImageRef = ImageKey | ImageAsset;

/** Resolve any image reference to a concrete asset. */
export function imgRef(ref: ImageRef): ImageAsset {
  return typeof ref === "string" ? img(ref) : ref;
}

export default images;
