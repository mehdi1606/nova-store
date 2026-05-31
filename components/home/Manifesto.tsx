import MaskedHeading from "@/components/ui/MaskedHeading";
import Reveal from "@/components/ui/Reveal";
import Marquee from "@/components/Marquee";
import HorseMark from "@/components/HorseMark";

const values = [
  "Fait au Maroc",
  "Cheval brodé",
  "Édition signée",
  "Depuis 2026",
  "Cavalier & monture",
];

export default function Manifesto() {
  return (
    <section className="relative overflow-hidden bg-paper pt-[clamp(4.5rem,10vw,11rem)] pb-[clamp(2rem,4vw,3.5rem)]">
      <div className="edge-x">
        <Reveal amount={0.6}>
          <span className="label inline-flex items-center gap-3 text-leather">
            <HorseMark className="w-5 text-or" />
            Le manifeste
          </span>
        </Reveal>

        <MaskedHeading
          lines={[
            "Nous ne faisons pas",
            "beaucoup de pièces.",
            "Nous en faisons de justes.",
          ]}
          className="mt-8 max-w-[20ch] font-display text-[clamp(2rem,5.4vw,4.4rem)] font-[380] leading-[1.02] text-ink"
          stagger={0.1}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_minmax(0,30ch)] lg:items-end">
          <Reveal delay={0.1} className="max-w-2xl">
            <p className="text-pretty text-lg leading-relaxed text-ink/75 sm:text-xl">
              Une veste, un tapis, un sweat. Trois objets pensés pour durer,
              taillés dans des matières honnêtes et marqués d&apos;un même cheval
              brodé. La collection capsule Nova Cavalia n&apos;encombre pas le
              vestiaire — elle le définit.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="display-italic font-display text-xl text-leather sm:text-2xl">
              « L&apos;élégance, c&apos;est ce qui se reconnaît sans se montrer. »
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-20 border-y border-ink/10 py-5">
        <Marquee
          items={values}
          duration={36}
          itemClassName="label text-ink/70 text-[0.8rem]"
        />
      </div>
    </section>
  );
}
