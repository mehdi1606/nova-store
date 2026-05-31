import MediaFrame from "@/components/ui/MediaFrame";
import MaskedHeading from "@/components/ui/MaskedHeading";
import Reveal from "@/components/ui/Reveal";
import CTA from "@/components/ui/CTA";
import { cn } from "@/lib/utils";

const stats = [
  { value: "2026", label: "Fondée au Maroc" },
  { value: "03", label: "Pièces signées" },
  { value: "∞", label: "Le cheval, toujours" },
];

export default function HistoireTeaser() {
  return (
    <section className="section-y bg-paper">
      <div className="edge-x grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
        {/* image */}
        <MediaFrame
          image="stable-atmosphere"
          ratio="tall"
          position="50% 45%"
          sizes="(min-width: 1024px) 50vw, 100vw"
          overlay={
            <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/30 to-transparent" />
          }
        />

        {/* text */}
        <div>
          <Reveal amount={0.6}>
            <span className="label text-leather">Notre histoire</span>
          </Reveal>
          <MaskedHeading
            lines={["Née dans l'odeur", "du cuir et du foin."]}
            className="mt-6 font-display text-[clamp(1.9rem,4.6vw,3.6rem)] font-[380] leading-[1.04] text-ink"
          />
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink/75">
              Nova Cavalia est née en 2026 d&apos;une conviction simple : le
              cavalier et sa monture méritent des pièces aussi soignées que le
              lien qui les unit. Depuis, chaque création porte le même cheval
              brodé — discret, reconnaissable, fidèle.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="mt-10 grid max-w-md grid-cols-3 border-t border-ink/15 pt-7">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={cn("px-5 first:pl-0", i > 0 && "border-l border-ink/12")}
                >
                  <dt className="font-display text-[clamp(2rem,4vw,3rem)] font-[380] leading-none text-ink">
                    {s.value}
                  </dt>
                  <dd className="label-xs mt-3 text-stone">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10">
              <CTA href="/histoire" variant="outline">
                Lire notre histoire
              </CTA>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
