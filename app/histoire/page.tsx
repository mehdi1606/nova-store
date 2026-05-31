import type { Metadata } from "next";
import DarkHero from "@/components/DarkHero";
import SmartImage from "@/components/ui/SmartImage";
import MediaFrame from "@/components/ui/MediaFrame";
import MaskedHeading from "@/components/ui/MaskedHeading";
import Reveal from "@/components/ui/Reveal";
import CTA from "@/components/ui/CTA";
import HorseMark from "@/components/HorseMark";
import type { ImageKey } from "@/lib/images";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Notre Histoire",
  description:
    "Nova Cavalia, maison équestre née au Maroc en 2026. L'histoire d'un cheval brodé, d'un lien entre le cavalier et sa monture, et d'une élégance qui se reconnaît sans se montrer.",
};

const chapters: {
  index: string;
  align: "left" | "right";
  image: ImageKey;
  position: string;
  kicker: string;
  title: string;
  body: string;
}[] = [
  {
    index: "01",
    align: "left",
    image: "stable-atmosphere",
    position: "50% 45%",
    kicker: "2026 — L'origine",
    title: "Tout commence à l'écurie",
    body: "Nova Cavalia naît d'une conviction simple, formée dans l'odeur du cuir et du foin : le cavalier et sa monture méritent des pièces aussi soignées que le lien qui les unit. Pas une marque de plus — une maison, avec ses gestes et sa rigueur.",
  },
  {
    index: "02",
    align: "right",
    image: "ed-bw-1",
    position: "50% 35%",
    kicker: "La signature",
    title: "Un cheval, brodé fil à fil",
    body: "Plutôt qu'un logo, une silhouette. Le cheval bondissant, brodé à la main sur chaque création, devient la signature discrète de la maison — reconnaissable entre toutes, jamais ostentatoire.",
  },
  {
    index: "03",
    align: "left",
    image: "cat-cavalier",
    position: "50% 25%",
    kicker: "2026 — La capsule",
    title: "Trois pièces, une intention",
    body: "Une veste de concours, un tapis de selle, un sweat d'écurie. La collection capsule réunit l'essentiel du vestiaire équestre, taillé pour durer et pensé pour s'accorder, du paddock à la ville.",
  },
];

const timeline = [
  { year: "2026", label: "Naissance de la maison" },
  { year: "2019", label: "Le cheval brodé" },
  { year: "2022", label: "La Riding Team" },
  { year: "2026", label: "Collection capsule" },
];

const values = [
  {
    title: "Le lien",
    body: "Tout part de la relation entre le cavalier et sa monture — un dialogue silencieux que chaque pièce doit servir, jamais trahir.",
  },
  {
    title: "La justesse",
    body: "Peu de pièces, mais justes. Des matières honnêtes, des finitions tenues, et le refus de l'ornement qui ne sert à rien.",
  },
  {
    title: "Le Maroc",
    body: "Une maison enracinée, fière de son atelier et de sa terre — l'élégance équestre lue à travers une lumière du Sud.",
  },
];

export default function HistoirePage() {
  return (
    <>
      {/* hero — dark, full-bleed; SmartImage (not MediaFrame) to protect LCP */}
      <section className="relative flex h-[88svh] min-h-[540px] items-end overflow-hidden bg-ink-deep text-paper">
        <DarkHero />
        <SmartImage
          image="hero-arena"
          priority
          fill
          sizes="100vw"
          position="50% 35%"
          className="scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/90 via-ink-deep/30 to-ink-deep/40" />
        <div className="vignette absolute inset-0" />
        <div className="edge-x relative z-10 pb-[14vh]">
          <span className="label inline-flex items-center gap-3 text-or-soft">
            <HorseMark className="w-6 text-or-soft" />
            Maison fondée en 2026
          </span>
          <MaskedHeading
            as="h1"
            lines={["Notre", "histoire."]}
            className="mt-5 font-display text-[clamp(2.8rem,9vw,7rem)] font-[380] leading-[0.92]"
            delay={0.2}
          />
        </div>
      </section>

      {/* manifesto — asymmetric, left label / right oversized statement */}
      <section className="section-y bg-paper">
        <div className="edge-x grid grid-cols-1 gap-y-8 lg:grid-cols-[0.5fr_1fr] lg:gap-x-20">
          <Reveal>
            <span className="label inline-flex items-center gap-3 text-leather">
              <span className="h-px w-8 bg-leather/40" />
              Manifeste
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-pretty font-display text-[clamp(1.6rem,3.4vw,2.7rem)] font-[380] leading-[1.22] text-ink">
              Nova Cavalia est une maison équestre marocaine. Nous croyons
              qu&apos;une pièce bien faite raconte une histoire — celle du
              cheval, du cavalier, et du soin qu&apos;on met à les habiller.
            </p>
          </Reveal>
        </div>
      </section>

      {/* chapters — alternating, MediaFrame clip-reveal + hover-zoom, folio numerals */}
      {chapters.map((c) => (
        <section key={c.title} className="section-y-sm bg-paper">
          <div className="edge-x grid grid-cols-1 items-center gap-x-16 gap-y-10 lg:grid-cols-2 lg:gap-x-24">
            <div className={cn(c.align === "right" && "lg:order-2")}>
              <MediaFrame
                image={c.image}
                ratio="tall"
                position={c.position}
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            <div className={cn(c.align === "right" && "lg:order-1")}>
              <div className="flex items-baseline gap-5">
                <span
                  aria-hidden
                  className="select-none font-display text-[clamp(2.4rem,4vw,3.4rem)] font-[380] leading-none text-ink/15"
                >
                  {c.index}
                </span>
                <Reveal amount={0.6}>
                  <span className="label text-leather">{c.kicker}</span>
                </Reveal>
              </div>
              <MaskedHeading
                lines={[c.title]}
                className="mt-5 font-display text-[clamp(1.9rem,4vw,3.2rem)] font-[380] leading-[1.04] text-ink"
              />
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-ink/75">
                  {c.body}
                </p>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      {/* pull quote — dark band, generous rhythm */}
      <section className="relative overflow-hidden bg-ink-deep text-paper">
        <div className="edge-x flex flex-col items-center py-[clamp(6rem,16vw,12rem)] text-center">
          <HorseMark className="w-14 text-or" />
          <Reveal>
            <p className="mt-10 max-w-3xl text-balance font-display text-[clamp(1.9rem,4.6vw,3.5rem)] font-[380] italic leading-[1.18]">
              « L&apos;élégance, c&apos;est ce qui se reconnaît sans se
              montrer. »
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="label-xs mt-9 text-stone">
              La maison Nova Cavalia
            </span>
          </Reveal>
        </div>
      </section>

      {/* timeline — large numerals, hairline ruled cells, header row */}
      <section className="section-y-sm bg-paper">
        <div className="edge-x">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <MaskedHeading
              lines={["Quatre dates,", "une trajectoire."]}
              className="font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-[380] leading-[1.04] text-ink"
            />
            <span className="label-xs text-ink/45">2026 — 2026</span>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-8 lg:grid-cols-4 lg:gap-x-12">
            {timeline.map((t, i) => (
              <Reveal
                key={t.year}
                delay={i * 0.08}
                amount={0.4}
                className="border-t border-ink/15 py-8"
              >
                <p className="font-display text-[clamp(2.6rem,5vw,4.2rem)] font-[380] leading-none text-ink">
                  {t.year}
                </p>
                <p className="mt-4 max-w-[18ch] text-sm leading-snug text-ink/60">
                  {t.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* values — editorial numbered rows, gold numerals, hairline dividers */}
      <section className="section-y bg-paper-2/40">
        <div className="edge-x">
          <Reveal>
            <span className="label text-leather">Ce qui nous tient</span>
          </Reveal>
          <div className="mt-12 border-t border-ink/12">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06} amount={0.4}>
                <div className="grid grid-cols-1 gap-x-10 gap-y-3 border-b border-ink/12 py-9 md:grid-cols-[4rem_1fr_1.6fr] md:items-baseline md:py-12">
                  <span className="font-display text-2xl font-[380] text-or">
                    0{i + 1}
                  </span>
                  <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-[380] leading-tight text-ink">
                    {v.title}
                  </h3>
                  <p className="text-lg leading-relaxed text-ink/70">
                    {v.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="section-y-sm bg-paper text-center">
        <div className="edge-x flex flex-col items-center">
          <HorseMark className="w-12 text-or" />
          <MaskedHeading
            lines={["Découvrez la capsule."]}
            className="mt-7 font-display text-[clamp(1.8rem,4.5vw,3.4rem)] font-[380] text-ink"
          />
          <Reveal delay={0.1}>
            <div className="mt-8">
              <CTA href="/boutique" variant="solid">
                Voir la collection
              </CTA>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
