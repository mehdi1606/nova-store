import Link from "next/link";
import MediaFrame from "@/components/ui/MediaFrame";
import MaskedHeading from "@/components/ui/MaskedHeading";
import Reveal from "@/components/ui/Reveal";
import { IconArrowRight, IconArrowUpRight } from "@/components/Icons";
import type { ImageKey } from "@/lib/images";

const posts: {
  kicker: string;
  title: string;
  image: ImageKey;
  position: string;
  href: string;
}[] = [
  {
    kicker: "Lookbook — 2026",
    title: "La capsule en mouvement",
    image: "ed-look",
    position: "50% 30%",
    href: "/journal",
  },
  {
    kicker: "Coulisses",
    title: "Une matinée à l'écurie",
    image: "ed-bw-1",
    position: "50% 35%",
    href: "/journal",
  },
  {
    kicker: "Le geste",
    title: "Le cheval, fil après fil",
    image: "ed-arena",
    position: "50% 40%",
    href: "/journal",
  },
];

export default function JournalTeaser() {
  return (
    <section className="section-y bg-paper-2/50">
      <div className="edge-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal amount={0.6}>
              <span className="label text-leather">Le journal</span>
            </Reveal>
            <MaskedHeading
              lines={["Regards & coulisses."]}
              className="mt-5 font-display text-[clamp(1.9rem,4.6vw,3.6rem)] font-[380] leading-[1.04] text-ink"
            />
          </div>
          <Reveal amount={0.6}>
            <Link
              href="/journal"
              data-cursor="hover"
              className="group inline-flex items-center gap-2.5 label text-ink u-link"
            >
              Tout le journal
              <IconArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1} amount={0.25}>
              <Link href={p.href} data-cursor="hover" className="group block">
                <MediaFrame
                  image={p.image}
                  ratio="portrait"
                  position={p.position}
                  sizes="(min-width: 768px) 30vw, 100vw"
                  overlay={
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  }
                />
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <span className="label-xs text-stone">{p.kicker}</span>
                    <h3 className="mt-2 font-display text-2xl font-[380] text-ink">
                      {p.title}
                    </h3>
                  </div>
                  <IconArrowUpRight className="mt-1 size-5 shrink-0 translate-y-1 text-or opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
