import { getProductsBySlugs } from "@/lib/catalog";
import ProductCard from "./ProductCard";
import Reveal from "@/components/ui/Reveal";

export default async function CrossSell({
  slugs,
  title = "Complétez la silhouette",
}: {
  slugs: string[];
  title?: string;
}) {
  const items = await getProductsBySlugs(slugs);
  if (!items.length) return null;

  return (
    <section className="section-y-sm bg-paper-2/40">
      <div className="edge-x">
        <Reveal amount={0.6}>
          <span className="label text-leather">{title}</span>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <ProductCard key={p.slug} product={p} delay={(i % 3) * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
