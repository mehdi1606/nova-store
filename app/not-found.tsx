import Link from "next/link";
import type { Metadata } from "next";
import DarkHero from "@/components/DarkHero";
import HorseMark from "@/components/HorseMark";
import { IconArrowRight } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-ink-deep px-6 text-center text-paper">
      <DarkHero />
      <div className="vignette absolute inset-0" />
      <div className="relative z-10 flex flex-col items-center">
        <HorseMark className="w-16 text-or" />
        <p className="mt-10 font-display text-[clamp(4rem,16vw,9rem)] font-[380] leading-none text-paper/90">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-[380] text-paper sm:text-3xl">
          Cette piste n&apos;existe pas
        </h1>
        <p className="mt-4 max-w-sm text-paper/65">
          La page que vous cherchez a quitté l&apos;écurie. Revenons sur le bon
          chemin.
        </p>
        <Link
          href="/"
          data-cursor="hover"
          className="group mt-9 inline-flex items-center gap-3 rounded-[2px] bg-paper px-8 py-4 label text-ink transition-colors hover:bg-or"
        >
          Retour à l&apos;accueil
          <IconArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
        <Link
          href="/boutique"
          data-cursor="hover"
          className="mt-5 label text-[0.6rem] text-paper/60 u-link transition-colors hover:text-paper"
        >
          Ou découvrir la collection
        </Link>
      </div>
    </section>
  );
}
