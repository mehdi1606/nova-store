import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format a price in Moroccan dirham, FR convention: "1 890 Dhs". */
export function formatMAD(amount: number): string {
  return `${new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 0 })
    .format(amount)
    .replace(/ /g, " ")} Dhs`;
}

export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";
