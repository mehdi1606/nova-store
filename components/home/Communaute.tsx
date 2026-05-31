import SmartImage from "@/components/ui/SmartImage";
import MaskedHeading from "@/components/ui/MaskedHeading";
import Reveal from "@/components/ui/Reveal";
import { IconInstagram } from "@/components/Icons";
import type { ImageKey } from "@/lib/images";

const feed: { image: ImageKey; position: string }[] = [
  { image: "ed-2", position: "50% 30%" },
  { image: "sweat-lifestyle", position: "50% 30%" },
  { image: "ed-5", position: "50% 35%" },
  { image: "veste-lifestyle", position: "50% 25%" },
  { image: "ed-stable", position: "50% 40%" },
  { image: "ed-3", position: "50% 30%" },
];

export default function Communaute() {
  return (
    <section className="section-y bg-paper">
      <div className="edge-x">
        <div className="flex flex-col items-center text-center">
          <Reveal amount={0.6}>
            <span className="label text-leather">La communauté</span>
          </Reveal>
          <MaskedHeading
            lines={["Riding Team"]}
            className="mt-5 font-display text-[clamp(2.2rem,6vw,5rem)] font-[380] leading-[1] text-ink"
          />
          <Reveal delay={0.1}>
            <a
              href="https://instagram.com/novacavalia"
              target="_blank"
              rel="noreferrer"
              data-cursor="hover"
              className="group mt-5 inline-flex items-center gap-2.5 text-ink/70 transition-colors hover:text-ink"
            >
              <IconInstagram className="size-5" />
              <span className="label">@novacavalia</span>
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {feed.map((f, i) => (
            <Reveal key={f.image} delay={(i % 6) * 0.05} amount={0.2}>
              <a
                href="https://instagram.com/novacavalia"
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="group relative block aspect-square overflow-hidden rounded-[2px] bg-paper-2"
              >
                <SmartImage
                  image={f.image}
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                  position={f.position}
                  className="transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-ink-deep/0 transition-colors duration-500 group-hover:bg-ink-deep/45">
                  <IconInstagram className="size-6 text-paper opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
