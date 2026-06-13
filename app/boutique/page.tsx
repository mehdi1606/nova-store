import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import ProductCard from "@/components/shop/ProductCard";
import LookFeature from "@/components/home/LookFeature";
import Reveal from "@/components/ui/Reveal";
import MaskedHeading from "@/components/ui/MaskedHeading";
import { cn } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "La Boutique",
  description:
    "La collection capsule 2026 Nova Cavalia : veste de concours, tapis de selle et sweat, signés d'un cheval brodé. Pour le cavalier et sa monture.",
};

const tabs = [
  { label: "Tout", value: undefined, href: "/boutique" },
  { label: "Le Cheval", value: "cheval", href: "/boutique?categorie=cheval" },
  { label: "Le Cavalier", value: "cavalier", href: "/boutique?categorie=cavalier" },
];

export default async function BoutiquePage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;
  const active = categorie === "cheval" || categorie === "cavalier" ? categorie : undefined;
  const all = await getCatalog();
  const list = active ? all.filter((p) => p.category === active) : all;

  return (
    <>
      {/* header */}
      <section className="bg-paper pb-16 pt-32 lg:pt-40">
        <div className="edge-x">
          <Reveal amount={0.6}>
            <span className="label text-leather">La boutique</span>
          </Reveal>
          <MaskedHeading
            lines={["La collection", "capsule 2026."]}
            className="mt-5 max-w-[16ch] font-display text-[clamp(2.4rem,6vw,5rem)] font-[380] leading-[0.98] text-ink"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg text-ink/70">
              Trois pièces, une signature. Choisies pour durer, marquées du même
              cheval brodé — du box à la ville.
            </p>
          </Reveal>

          {/* filter */}
          <div className="mt-10 flex flex-wrap items-center gap-2">
            {tabs.map((t) => {
              const isActive = t.value === active;
              return (
                <Link
                  key={t.label}
                  href={t.href}
                  scroll={false}
                  data-cursor="hover"
                  className={cn(
                    "rounded-full border px-5 py-2.5 label-xs transition-colors duration-300",
                    isActive
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/20 text-ink/70 hover:border-ink hover:text-ink",
                  )}
                >
                  {t.label}
                </Link>
              );
            })}
            <span className="label-xs ml-auto text-stone">
              {list.length} {list.length > 1 ? "pièces" : "pièce"}
            </span>
          </div>
        </div>
      </section>

      {/* grid */}
      <section className="bg-paper pb-24 lg:pb-32">
        <div className="edge-x grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <ProductCard
              key={p.slug}
              product={p}
              priority={i < 3}
              delay={(i % 3) * 0.08}
            />
          ))}
        </div>
      </section>

      {/* le look */}
      <div id="look" className="scroll-mt-24">
        <LookFeature />
      </div>
    </>
  );
}
