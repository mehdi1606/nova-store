import MediaFrame from "@/components/ui/MediaFrame";
import MaskedHeading from "@/components/ui/MaskedHeading";
import Reveal from "@/components/ui/Reveal";
import { look } from "@/content/products";
import { getProductsBySlugs } from "@/lib/catalog";
import LookSwitcher, { type LookItem } from "./LookSwitcher";

export default async function LookFeature() {
  const products = await getProductsBySlugs(look.items);
  const items: LookItem[] = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    priceMAD: p.priceMAD,
    priceByFit: p.priceByFit,
    card: p.card,
  }));

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

          <LookSwitcher items={items} savings={look.savings} />
        </div>
      </div>
    </section>
  );
}
