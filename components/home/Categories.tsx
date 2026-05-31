import Link from "next/link";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/ui/Reveal";
import { IconArrowUpRight } from "@/components/Icons";
import type { ImageKey } from "@/lib/images";

const panels: {
  label: string;
  title: string;
  desc: string;
  href: string;
  image: ImageKey;
  position: string;
}[] = [
  {
    label: "Pour le cheval",
    title: "Le Cheval",
    desc: "Tapis de selle matelassé, passepoil corde, confort pensé pour l'effort.",
    href: "/boutique?categorie=cheval",
    image: "cat-cheval",
    position: "50% 40%",
  },
  {
    label: "Pour le cavalier",
    title: "Le Cavalier",
    desc: "Veste de concours et sweat d'écurie, du paddock à la ville.",
    href: "/boutique?categorie=cavalier",
    image: "cat-cavalier",
    position: "50% 30%",
  },
];

export default function Categories() {
  return (
    <section className="bg-ink-deep">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {panels.map((p, i) => (
          <Reveal key={p.href} delay={i * 0.1} amount={0.3}>
            <Link
              href={p.href}
              data-cursor="hover"
              className="group relative flex h-[70vh] min-h-[460px] items-end overflow-hidden md:h-[86vh]"
            >
              <SmartImage
                image={p.image}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                position={p.position}
                className="transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/80 via-ink-deep/15 to-transparent transition-opacity duration-700 group-hover:from-ink-deep/90" />

              <div className="relative z-10 w-full p-7 text-paper sm:p-10 lg:p-12">
                <div className="flex items-center gap-4">
                  <span className="label-xs text-or-soft">0{i + 1}</span>
                  <span className="h-px w-10 bg-or-soft/30" />
                  <span className="label-xs text-paper/70">{p.label}</span>
                </div>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <h3 className="font-display text-[clamp(2.4rem,5vw,3.6rem)] font-[380] leading-[0.95]">
                    {p.title}
                  </h3>
                  <IconArrowUpRight className="size-7 shrink-0 translate-y-1 text-or opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" />
                </div>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/75 sm:text-base">
                  {p.desc}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
