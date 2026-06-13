import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allSlugs } from "@/content/products";
import { getProductBySlug } from "@/lib/catalog";
import { imgRef } from "@/lib/images";
import ProductGallery from "@/components/shop/ProductGallery";
import BuyBox from "@/components/shop/BuyBox";
import CrossSell from "@/components/shop/CrossSell";
import MediaFrame from "@/components/ui/MediaFrame";
import Reveal from "@/components/ui/Reveal";
import HorseMark from "@/components/HorseMark";

export const revalidate = 300;

export function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  const hero = imgRef(p.hero);
  return {
    title: p.name,
    description: p.shortDesc,
    alternates: { canonical: `/produit/${p.slug}` },
    openGraph: {
      type: "website",
      title: `${p.name} · Nova Cavalia`,
      description: p.shortDesc,
      images: [{ url: hero.src, width: hero.w, height: hero.h, alt: hero.alt }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc,
    image: [imgRef(product.hero).src],
    brand: { "@type": "Brand", name: "Nova Cavalia" },
    offers: {
      "@type": "Offer",
      priceCurrency: "MAD",
      price: product.priceMAD,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <article className="bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* breadcrumb */}
      <div className="edge-x pb-8 pt-28 lg:pt-32">
        <nav className="flex items-center gap-2 label-xs text-stone">
          <Link href="/" className="u-link hover:text-ink" data-cursor="hover">
            Accueil
          </Link>
          <span>/</span>
          <Link href="/boutique" className="u-link hover:text-ink" data-cursor="hover">
            Boutique
          </Link>
          <span>/</span>
          <span className="text-ink/70">{product.name}</span>
        </nav>
      </div>

      {/* gallery + buy */}
      <section className="edge-x grid grid-cols-1 gap-10 pb-20 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ProductGallery images={product.gallery} name={product.name} />
        </div>
        <BuyBox product={product} />
      </section>

      {/* story band */}
      <section className="section-y relative overflow-hidden bg-ink-deep text-paper">
        <div className="edge-x grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="grid grid-cols-2 gap-4">
            {product.macro.slice(0, 2).map((m, i) => (
              <MediaFrame
                key={typeof m === "string" ? m : m.src}
                image={m}
                ratio="tall"
                position="50% 45%"
                sizes="(min-width: 1024px) 22vw, 45vw"
                delay={i * 0.1}
                className={i === 1 ? "mt-10" : ""}
              />
            ))}
          </div>

          <div>
            <HorseMark className="w-12 text-or" />
            <Reveal delay={0.1}>
              <p className="mt-7 font-display text-[clamp(1.6rem,2.8vw,2.6rem)] font-[380] italic leading-[1.28] text-paper">
                {product.story}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-7 max-w-md text-paper/70">{product.shortDesc}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <CrossSell slugs={product.crossSell} />
    </article>
  );
}
