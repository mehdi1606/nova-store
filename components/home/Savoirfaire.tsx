import MediaFrame from "@/components/ui/MediaFrame";
import MaskedHeading from "@/components/ui/MaskedHeading";
import Reveal from "@/components/ui/Reveal";
import type { ImageKey } from "@/lib/images";
import { cn } from "@/lib/utils";

const crafts: {
  title: string;
  body: string;
  image: ImageKey;
  position: string;
}[] = [
  {
    title: "La broderie",
    body: "Le cheval brodé fil à fil, posé à la main sur chaque pièce. Une signature, jamais un logo — reconnaissable de loin, lisible de près.",
    image: "veste-macro-buttons",
    position: "50% 50%",
  },
  {
    title: "La matière",
    body: "Tissus techniques et cotons grattés, choisis pour tenir la posture et la saison, sans jamais peser. La main d'abord, l'allure ensuite.",
    image: "tapis-detail",
    position: "50% 50%",
  },
  {
    title: "Le geste",
    body: "Coutures renforcées, finitions corde, contrôle pièce par pièce. Le soin qu'on doit au cheval comme au cavalier, jusqu'au dernier fil.",
    image: "sweat-macro-back",
    position: "50% 40%",
  },
];

export default function Savoirfaire() {
  return (
    <section className="section-y bg-paper">
      <div className="edge-x">
        <div className="max-w-3xl">
          <Reveal amount={0.6}>
            <span className="label text-leather">Le savoir-faire</span>
          </Reveal>
          <MaskedHeading
            lines={["Le détail, partout", "où l'on ne regarde pas."]}
            className="mt-6 font-display text-[clamp(1.9rem,4.6vw,3.6rem)] font-[380] leading-[1.04] text-ink"
          />
        </div>

        <div className="mt-16 lg:mt-24">
          {crafts.map((c, i) => (
            <div
              key={c.title}
              className="grid grid-cols-1 items-center gap-x-12 gap-y-7 border-t border-ink/12 py-10 md:grid-cols-2 md:gap-x-20 lg:py-16"
            >
              <div className={cn(i % 2 === 1 && "md:order-2")}>
                <MediaFrame
                  image={c.image}
                  ratio="landscape"
                  position={c.position}
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className={cn(i % 2 === 1 && "md:order-1")}>
                <div className="flex items-baseline gap-5">
                  <span
                    aria-hidden
                    className="select-none font-display text-[clamp(2rem,3.4vw,3rem)] font-[380] leading-none text-ink/15"
                  >
                    0{i + 1}
                  </span>
                  <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-[380] leading-tight text-ink">
                    {c.title}
                  </h3>
                </div>
                <Reveal delay={0.1}>
                  <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/70">
                    {c.body}
                  </p>
                </Reveal>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
