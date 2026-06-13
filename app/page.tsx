import Hero from "@/components/home/Hero";
import Defile from "@/components/home/Defile";
import Manifesto from "@/components/home/Manifesto";
import Categories from "@/components/home/Categories";
import HistoireTeaser from "@/components/home/HistoireTeaser";
import PiecesScroll from "@/components/home/PiecesScroll";
import LookFeature from "@/components/home/LookFeature";
import Savoirfaire from "@/components/home/Savoirfaire";
import JournalTeaser from "@/components/home/JournalTeaser";
import Communaute from "@/components/home/Communaute";
import Newsletter from "@/components/home/Newsletter";
import { getCatalog } from "@/lib/catalog";

export const revalidate = 300;

export default async function Home() {
  const products = await getCatalog();
  return (
    <>
      <Hero />
      <Defile />
      <Manifesto />
      <Categories />
      <HistoireTeaser />
      <PiecesScroll products={products} />
      <LookFeature />
      <Savoirfaire />
      <JournalTeaser />
      <Communaute />
      <Newsletter />
    </>
  );
}
