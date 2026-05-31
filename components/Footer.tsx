"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { products, look } from "@/content/products";
import HorseMark from "./HorseMark";
import { IconArrowRight, IconInstagram, IconCheck } from "@/components/Icons";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Explorer",
    links: [
      { label: "Accueil", href: "/" },
      { label: "La Boutique", href: "/boutique" },
      { label: "Le Journal", href: "/journal" },
    ],
  },
  {
    title: "La Maison",
    links: [
      { label: "Notre Histoire", href: "/histoire" },
      { label: "Contact", href: "/contact" },
      { label: "Mon Panier", href: "/panier" },
    ],
  },
  {
    title: "La Collection",
    links: [
      ...products.map((p) => ({ label: p.name, href: `/produit/${p.slug}` })),
      { label: look.title, href: "/boutique#look" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;
    setDone(true);
  };

  return (
    <footer className="relative overflow-hidden bg-ink-deep text-paper">
      <div className="edge-x py-20 lg:py-32">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.1fr_1fr]">
          {/* brand + newsletter */}
          <div className="max-w-md">
            <HorseMark className="w-16 text-or-soft" title="Nova Cavalia" />
            <Image
              src="/wordmark-light.png"
              alt="Nova Cavalia"
              width={488}
              height={134}
              className="mt-6 h-auto w-[180px] opacity-95"
            />
            <p className="mt-6 text-[0.95rem] leading-relaxed text-paper/70">
              Maison équestre fondée au Maroc en 2026. Des pièces signées,
              pensées pour le cavalier et sa monture — l&apos;histoire à portée.
            </p>

            <div className="mt-9">
              <span className="label-xs text-or-soft">
                La lettre de l&apos;écurie
              </span>
              {done ? (
                <p className="mt-3 flex items-center gap-2 text-sm text-paper/85">
                  <IconCheck className="size-4 text-or" />
                  Merci — vous faites désormais partie de l&apos;équipe.
                </p>
              ) : (
                <form
                  onSubmit={submit}
                  className="mt-3 flex items-center gap-3 border-b border-paper/25 pb-2 focus-within:border-or"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse e-mail"
                    aria-label="Votre adresse e-mail"
                    className="w-full bg-transparent text-sm text-paper placeholder:text-stone/60 focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="S'inscrire à la lettre"
                    className="shrink-0 text-paper/80 transition-colors hover:text-or"
                    data-cursor="hover"
                  >
                    <IconArrowRight className="size-5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="label-xs text-stone/80">{col.title}</h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label + l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-paper/75 u-link transition-colors hover:text-paper"
                        data-cursor="hover"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-16 flex flex-col gap-5 border-t border-paper/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com/novacavalia"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2.5 text-paper/75 transition-colors hover:text-paper"
              data-cursor="hover"
            >
              <IconInstagram className="size-4" />
              <span className="label-xs">@novacavalia</span>
            </a>
            <span className="label-xs text-stone/70">
              Livraison au Maroc
            </span>
          </div>

          <p className="label-xs text-stone/60">
            © {new Date().getFullYear()} Nova Cavalia — Fait au Maroc avec soin
          </p>
        </div>
      </div>
    </footer>
  );
}
