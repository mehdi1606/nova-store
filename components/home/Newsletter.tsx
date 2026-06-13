"use client";

import { useState } from "react";
import SmartImage from "@/components/ui/SmartImage";
import MaskedHeading from "@/components/ui/MaskedHeading";
import Reveal from "@/components/ui/Reveal";
import HorseMark from "@/components/HorseMark";
import { IconArrowRight, IconCheck } from "@/components/Icons";
import { subscribeEmail } from "@/lib/actions/leads";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;
    await subscribeEmail(email);
    setDone(true);
  };

  return (
    <section className="section-y relative overflow-hidden bg-ink text-paper">
      <div className="absolute inset-0 opacity-20">
        <SmartImage
          image="ed-bw-2"
          fill
          sizes="100vw"
          position="50% 30%"
          grayscale
        />
      </div>
      <div className="absolute inset-0 bg-ink/70" />

      <div className="edge-x relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
        <HorseMark className="w-12 text-or" />
        <Reveal amount={0.6}>
          <span className="label mt-7 text-or-soft">La lettre de l&apos;écurie</span>
        </Reveal>
        <MaskedHeading
          lines={["Rejoignez", "l'équipe."]}
          className="mt-5 font-display text-[clamp(2.4rem,6vw,4.8rem)] font-[380] leading-[0.98]"
        />
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-md text-base text-paper/75 sm:text-lg">
            Les nouvelles couleurs, les coulisses et les premières sorties de
            collection — directement dans votre boîte, sans bruit.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-9 w-full max-w-md">
          {done ? (
            <p className="flex items-center justify-center gap-2 text-paper/90">
              <IconCheck className="size-5 text-or" />
              Merci — bienvenue dans la Riding Team.
            </p>
          ) : (
            <form
              onSubmit={submit}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:border sm:border-paper/20 sm:bg-paper/5 sm:p-1.5 sm:pl-6 sm:focus-within:border-or"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse e-mail"
                aria-label="Votre adresse e-mail"
                className="w-full border-b border-paper/25 bg-transparent pb-2 text-center text-base text-paper placeholder:text-stone/70 focus:outline-none sm:border-0 sm:pb-0 sm:text-left"
              />
              <button
                type="submit"
                className="group inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full bg-paper px-7 py-3.5 label text-ink transition-colors hover:bg-or"
                data-cursor="hover"
              >
                S&apos;inscrire
                <IconArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
              </button>
            </form>
          )}
          <p className="label-xs mt-4 text-stone/70">
            Pas de spam — uniquement l&apos;essentiel de la maison.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
