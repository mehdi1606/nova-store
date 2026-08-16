"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-4xl font-[380] text-ink">
        Une erreur est survenue
      </p>
      <p className="mt-4 max-w-sm text-ink/60">
        Quelque chose n&apos;a pas fonctionné. Réessayez ou revenez plus tard.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-[2px] bg-ink px-8 py-3.5 label text-paper transition-colors hover:bg-ink-deep"
      >
        Réessayer
      </button>
    </section>
  );
}
