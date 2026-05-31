"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import HorseMark from "@/components/HorseMark";
import { IconArrowRight, IconCheck } from "@/components/Icons";

const subjects = [
  "Une commande",
  "Les tailles",
  "La collection",
  "La Riding Team",
  "Autre",
] as const;

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<string>(subjects[0]);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Indiquez votre nom.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      return setError("Vérifiez votre adresse e-mail.");
    if (message.trim().length < 10)
      return setError("Votre message est un peu court.");
    setError(null);
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex min-h-[26rem] flex-col items-center justify-center rounded-[var(--radius-xs)] border border-ink/10 bg-paper-2/50 px-8 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-ink text-paper">
          <IconCheck className="size-6 text-or" />
        </span>
        <h2 className="mt-7 font-display text-3xl font-[380] text-ink">
          Message envoyé
        </h2>
        <p className="mt-3 max-w-sm text-ink/65">
          Merci {name.split(" ")[0]} — nous vous répondons sous 48 heures
          ouvrées. La maison vous écrit bientôt.
        </p>
        <HorseMark className="mt-8 w-10 text-ink/15" />
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-[var(--radius-xs)] border border-ink/10 bg-paper-2/40 p-7 sm:p-9"
    >
      <Reveal amount={0.2}>
        <h2 className="font-display text-2xl font-[380] text-ink">
          Écrivez-nous
        </h2>
        <p className="mt-2 text-sm text-ink/60">
          Tous les champs sont requis. Réponse sous 48 heures.
        </p>
      </Reveal>

      <div className="mt-7 space-y-6">
        <Field label="Votre nom" htmlFor="nc-name">
          <input
            id="nc-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Prénom et nom"
            className={inputCls}
          />
        </Field>

        <Field label="Votre e-mail" htmlFor="nc-email">
          <input
            id="nc-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="vous@exemple.com"
            className={inputCls}
          />
        </Field>

        <fieldset>
          <legend className="label-xs text-ink/55">Sujet</legend>
          <div className="mt-3.5 flex flex-wrap gap-2.5">
            {subjects.map((s) => {
              const active = s === subject;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubject(s)}
                  data-cursor="hover"
                  aria-pressed={active}
                  className={`rounded-full border px-4 py-2.5 text-[0.78rem] transition-colors ${
                    active
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/20 text-ink/70 hover:border-ink/50"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </fieldset>

        <Field label="Votre message" htmlFor="nc-message">
          <textarea
            id="nc-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="Dites-nous tout…"
            className={`${inputCls} resize-none`}
          />
        </Field>
      </div>

      {error && (
        <p className="mt-5 text-sm text-leather" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        data-cursor="hover"
        className="group mt-7 flex w-full items-center justify-center gap-3 rounded-[2px] bg-ink py-4 label text-paper transition-colors hover:bg-ink-deep sm:w-auto sm:px-10"
      >
        Envoyer le message
        <IconArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
      </button>
    </form>
  );
}

const inputCls =
  "w-full border-b border-ink/20 bg-transparent pb-2.5 text-ink placeholder:text-ink/35 transition-colors focus:border-ink focus:outline-none";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="label-xs block text-ink/55"
      >
        {label}
      </label>
      <div className="mt-3">{children}</div>
    </div>
  );
}
