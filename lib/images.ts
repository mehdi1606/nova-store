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

export default images;
