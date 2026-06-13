import MediaFrame from "@/components/ui/MediaFrame";
import MaskedHeading from "@/components/ui/MaskedHeading";
import Reveal from "@/components/ui/Reveal";
import CTA from "@/components/ui/CTA";
import { IconCheck } from "@/components/Icons";
import { look } from "@/content/products";
import { getLookTotals, getProductsBySlugs } from "@/lib/catalog";
import { formatMAD } from "@/lib/utils";

export default async function LookFeature() {
  const { full, bundled } = await getLookTotals();
  const saved = full - bundled;
  const items = await getProductsBySlugs(look.items);

  return (
    <section className="section-y relative overflow-hidden bg-ink-deep text-paper">
      <div className="edge-x grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
        {/* images — asymmetric stack */}
        <div className="relative">
          <MediaFrame
            image={look.hero}
            ratio="tall"
            position="50% 35%"
            sizes="(min-width: 1024px) 40vw, 82vw"
            className="w-[82%]"
          />
          <MediaFrame
            image={look.secondary}
            ratio="tall"
            position="50% 30%"
            sizes="(min-width: 1024px) 18vw, 36vw"
            delay={0.15}
            className="absolute -bottom-8 right-0 w-[42%] border-4 border-ink-deep shadow-soft"
          />
        </div>

        {/* copy */}
        <div>
          <Reveal amount={0.6}>
            <span className="label text-or-soft">{look.eyebrow}</span>
          </Reveal>
          <MaskedHeading
            lines={["La silhouette", "complète."]}
            className="mt-6 font-display text-[clamp(2.2rem,5vw,4.2rem)] font-[380] leading-[1.01]"
          />
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-paper/75">
              {look.description}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <ul className="mt-9 space-y-3 border-t border-paper/12 pt-7">
              {items.map((p) => (
                <li
                  key={p.slug}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="flex items-center gap-3 text-paper/85">
                    <IconCheck className="size-4 text-or" />
                    {p.name}
                  </span>
                  <span className="label-xs tabular-nums text-stone">
                    {formatMAD(p.priceMAD)}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap items-end gap-x-5 gap-y-2">
              <span className="font-display text-4xl font-[380] tabular-nums">
                {formatMAD(bundled)}
              </span>
              <span className="text-lg text-stone line-through tabular-nums">
                {formatMAD(full)}
              </span>
              <span className="label-xs rounded-full border border-or/35 px-3.5 py-1.5 text-or-soft">
                Économisez {formatMAD(saved)}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-9">
              <CTA href="/boutique#look" variant="light">
                Composer le look
              </CTA>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
