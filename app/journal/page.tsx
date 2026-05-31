import type { Metadata } from "next";
import Link from "next/link";
import DarkHero from "@/components/DarkHero";
import SmartImage from "@/components/ui/SmartImage";
import MediaFrame from "@/components/ui/MediaFrame";
import MaskedHeading from "@/components/ui/MaskedHeading";
import Reveal from "@/components/ui/Reveal";
import HorseMark from "@/components/HorseMark";
import { IconArrowUpRight } from "@/components/Icons";
import type { ImageKey } from "@/lib/images";

export const metadata: Metadata = {
  title: "Le Journal",
  description:
    "Le journal Nova Cavalia — éditoriaux, coulisses de l'écurie et regards sur la collection capsule 2026. Le cheval, le cavalier, et le geste qui les habille.",
};

type Story = {
  image: ImageKey;
  position: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
};

const featured: Story = {
  image: "ed-look",
  position: "50% 30%",
  category: "Éditorial",
  date: "Avril 2026",
  title: "Du paddock à la ville",
  excerpt:
    "La silhouette complète, portée du matin à l'écurie jusqu'aux pavés du soir. Une démonstration de la capsule 2026 : trois pièces, une intention, mille façons de les vivre.",
};

const stories: Story[] = [
  {
    image: "ed-bw-1",
    position: "50% 28%",
    category: "Portrait",
    date: "Mars 2026",
    title: "Celles qui montent à l'aube",
    excerpt:
      "Portrait d'une cavalière à la lumière froide du petit matin, quand la carrière n'appartient encore qu'à elle et sa monture.",
  },
  {
    image: "veste-macro-sleeve",
    position: "50% 50%",
    category: "Savoir-faire",
    date: "Mars 2026",
    title: "Le cheval, brodé fil à fil",
    excerpt:
      "Au plus près de la manche : comment notre signature équestre prend vie, point après point, sur chaque veste de concours.",
  },
  {
    image: "ed-arena",
    position: "50% 35%",
    category: "Coulisses",
    date: "Février 2026",
    title: "L'heure de l'échauffement",
    excerpt:
      "Avant l'épreuve, ce moment suspendu où cavaliers et chevaux tournent en silence. La concentration comme élégance.",
  },
  {
    image: "tapis-detail",
    position: "50% 50%",
    category: "Matière",
    date: "Février 2026",
    title: "Le passepoil corde, de près",
    excerpt:
      "Un détail qu'on ne voit qu'en se penchant : la finition cordée du tapis de selle, là où la rigueur se cache.",
  },
  {
    image: "ed-3",
    position: "50% 30%",
    category: "Éditorial",
    date: "Janvier 2026",
    title: "Complicité, au gris du matin",
    excerpt:
      "Un cheval gris, une cavalière, la brume. La relation avant la performance — c'est là que tout commence pour la maison.",
  },
  {
    image: "ed-stable",
    position: "50% 40%",
    category: "Lieu",
    date: "Janvier 2026",
    title: "Une maison enracinée au Maroc",
    excerpt:
      "L'écurie comme atelier, la terre comme origine. Nova Cavalia raconte d'où elle vient, sans jamais le crier.",
  },
];

export default function JournalPage() {
  return (
    <>
      {/* hero */}
      <section className="relative flex h-[68svh] min-h-[460px] items-end overflow-hidden bg-ink-deep text-paper">
        <DarkHero />
        <SmartImage
          image="ed-bw-2"
          priority
          fill
          sizes="100vw"
          position="50% 28%"
          grayscale
          className="scale-105 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-deep via-ink-deep/40 to-ink-deep/50" />
        <div className="vignette absolute inset-0" />
        <div className="edge-x relative z-10 pb-[10vh]">
          <span className="label inline-flex items-center gap-3 text-or-soft">
            <HorseMark className="w-6 text-or-soft" />
            Le Journal
          </span>
          <MaskedHeading
            as="h1"
            lines={["Carnet", "d'écurie."]}
            className="mt-5 font-display text-[clamp(2.8rem,9vw,7rem)] font-[380] leading-[0.92]"
            delay={0.2}
          />
          <Reveal delay={0.4}>
            <p className="mt-6 max-w-md text-paper/70">
              Éditoriaux, portraits et coulisses — les histoires qui se tissent
              autour de la maison et de ses chevaux.
            </p>
          </Reveal>
        </div>
      </section>

      {/* featured story */}
      <section className="section-y-sm bg-paper">
        <div className="edge-x">
          <Link
            href="/histoire"
            data-cursor="hover"
            className="group grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16"
          >
            <MediaFrame
              image={featured.image}
              ratio="auto"
              position={featured.position}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="aspect-[16/11]"
              overlay={
                <span className="label-xs absolute left-5 top-5 rounded-full bg-paper/90 px-4 py-1.5 text-ink backdrop-blur">
                  À la une
                </span>
              }
            />
            <Reveal amount={0.4}>
              <span className="label text-leather">
                {featured.category} · {featured.date}
              </span>
              <h2 className="mt-5 font-display text-[clamp(1.9rem,4vw,3.2rem)] font-[380] leading-[1.05] text-ink">
                {featured.title}
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink/70">
                {featured.excerpt}
              </p>
              <span className="label-xs mt-7 inline-flex items-center gap-2 text-ink u-link">
                Lire l&apos;histoire
                <IconArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Reveal>
          </Link>
        </div>
      </section>

      {/* story grid */}
      <section className="bg-paper pb-24 lg:pb-32">
        <div className="edge-x">
          <Reveal amount={0.6}>
            <span className="label text-leather">Toutes les histoires</span>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((s, i) => (
              <Link
                key={s.title}
                href="/histoire"
                data-cursor="hover"
                className="group block"
              >
                <MediaFrame
                  image={s.image}
                  ratio="portrait"
                  position={s.position}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  delay={(i % 3) * 0.06}
                />
                <Reveal delay={(i % 3) * 0.06 + 0.08} amount={0.4} className="mt-5">
                  <span className="block label-xs text-leather">
                    {s.category} · {s.date}
                  </span>
                  <h3 className="mt-2.5 font-display text-2xl font-[380] leading-tight text-ink u-link">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink/65">
                    {s.excerpt}
                  </p>
                </Reveal>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* quote band */}
      <section className="section-y relative overflow-hidden bg-ink-deep text-paper">
        <div className="edge-x flex flex-col items-center text-center">
          <HorseMark className="w-14 text-or" />
          <Reveal>
            <p className="mt-9 max-w-3xl text-balance font-display text-[clamp(1.8rem,4.5vw,3.4rem)] font-[380] italic leading-[1.2]">
              « Une pièce bien faite raconte une histoire — celle du cheval, du
              cavalier, et du soin qu&apos;on met à les habiller. »
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="label-xs mt-8 text-stone">
              La maison Nova Cavalia
            </span>
          </Reveal>
        </div>
      </section>

      {/* cta */}
      <section className="section-y-sm bg-paper text-center">
        <div className="edge-x flex flex-col items-center">
          <MaskedHeading
            lines={["La capsule vous attend."]}
            className="font-display text-[clamp(1.8rem,4.5vw,3.4rem)] font-[380] text-ink"
          />
          <Reveal delay={0.1}>
            <Link
              href="/boutique"
              data-cursor="hover"
              className="group mt-8 inline-flex items-center gap-3 rounded-[2px] bg-ink px-8 py-4 label text-paper transition-colors hover:bg-ink-deep"
            >
              Voir la collection
              <IconArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
