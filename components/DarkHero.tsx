"use client";

import { useEffect } from "react";
import { useUI } from "@/lib/ui";

/** Mount at the top of a page whose hero is dark/full-bleed so the header
 *  renders transparent with light text until the user scrolls past it. */
export default function DarkHero() {
  const setDarkHero = useUI((s) => s.setDarkHero);
  useEffect(() => {
    setDarkHero(true);
    return () => setDarkHero(false);
  }, [setDarkHero]);
  return null;
}
