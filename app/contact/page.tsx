import type { Metadata } from "next";
import MediaFrame from "@/components/ui/MediaFrame";
import MaskedHeading from "@/components/ui/MaskedHeading";
import Reveal from "@/components/ui/Reveal";
import HorseMark from "@/components/HorseMark";
import ContactForm from "@/components/contact/ContactForm";
import {
  IconMail,
  IconInstagram,
  IconMapPin,
  IconClock,
  IconTruck,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Une question sur une pièce, une taille ou une commande ? Écrivez à la maison Nova Cavalia. Réponse sous 48 heures — livraison partout au Maroc.",
};

const channels = [
  {
    icon: IconMail,
    label: "Par e-mail",
    value: "contact@novacavalia.com",
    href: "mailto:contact@novacavalia.com",
  },
  {
    icon: IconInstagram,
    label: "Sur Instagram",
    value: "@novacavalia",
    href: "https://instagram.com/novacavalia",
  },
];

const details = [
  { icon: IconMapPin, label: "La maison", value: "Maison équestre — Maroc" },
  { icon: IconClock, label: "Réponse", value: "Sous 48 heures ouvrées" },
  {
    icon: IconTruck,
    label: "Livraison",
    value: "Partout au Maroc · offerte dès 800 Dhs",
  },
];

export default function ContactPage() {
  return (
    <section className="bg-paper pb-24 pt-28 lg:pb-32 lg:pt-36">
      <div className="edge-x">
        {/* header */}
        <div className="max-w-2xl">
          <Reveal amount={0.6}>
            <span className="label inline-flex items-center gap-3 text-leather">
              <HorseMark className="w-6 text-leather" />
              Nous écrire
            </span>
          </Reveal>
          <MaskedHeading
            as="h1"
            lines={["Parlons", "chevaux."]}
            className="mt-5 font-display text-[clamp(2.6rem,7vw,5.5rem)] font-[380] leading-[0.95] text-ink"
            delay={0.1}
          />
          <Reveal delay={0.2}>
            <p className="mt-6 text-lg leading-relaxed text-ink/70">
              Une question sur une pièce, une taille, ou une commande ?
              L&apos;équipe Nova Cavalia vous répond avec le même soin que celui
              porté à chaque création.
            </p>
          </Reveal>
        </div>

        {/* grid */}
        <div className="mt-14 grid grid-cols-1 gap-12 lg:mt-20 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          {/* left: info + image */}
          <div className="lg:order-1">
            <div className="flex flex-col gap-3">
              {channels.map((c, i) => (
                <Reveal key={c.label} delay={i * 0.08} amount={0.3}>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      c.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    data-cursor="hover"
                    className="group flex items-center gap-5 rounded-[2px] border border-ink/12 bg-paper-2/40 px-6 py-5 transition-colors hover:border-ink/30"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-colors group-hover:bg-leather">
                      <c.icon className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="label-xs block text-ink/50">
                        {c.label}
                      </span>
                      <span className="mt-1 block font-display text-xl font-[380] text-ink">
                        {c.value}
                      </span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>

            <dl className="mt-8 space-y-5 border-t border-ink/12 pt-8">
              {details.map((d) => (
                <Reveal key={d.label} amount={0.5}>
                  <div className="flex items-start gap-4">
                    <d.icon className="mt-0.5 size-5 shrink-0 text-leather" />
                    <div>
                      <dt className="label-xs text-ink/50">
                        {d.label}
                      </dt>
                      <dd className="mt-1 text-ink/80">{d.value}</dd>
                    </div>
                  </div>
                </Reveal>
              ))}
            </dl>

            <MediaFrame
              image="stable-atmosphere"
              ratio="auto"
              position="50% 45%"
              sizes="45vw"
              className="mt-10 hidden aspect-[16/10] w-full lg:block"
              overlay={
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/50 to-transparent" />
                  <HorseMark className="absolute bottom-5 left-5 w-10 text-paper/80" />
                </>
              }
            />
          </div>

          {/* right: form */}
          <div className="lg:order-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
