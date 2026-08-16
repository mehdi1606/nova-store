export default function ProductLoading() {
  return (
    <article className="bg-paper">
      <div className="edge-x pb-8 pt-28 lg:pt-32">
        <div className="flex gap-2">
          <div className="h-3 w-12 animate-pulse rounded bg-ink/10" />
          <div className="h-3 w-16 animate-pulse rounded bg-ink/10" />
        </div>
      </div>
      <section className="edge-x grid grid-cols-1 gap-10 pb-20 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-[3/4] animate-pulse rounded bg-ink/10" />
        <div className="space-y-6 pt-4">
          <div className="h-4 w-28 animate-pulse rounded bg-ink/10" />
          <div className="h-8 w-64 animate-pulse rounded bg-ink/10" />
          <div className="h-6 w-24 animate-pulse rounded bg-ink/10" />
          <div className="h-20 w-full max-w-md animate-pulse rounded bg-ink/10" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-14 animate-pulse rounded bg-ink/10" />
            ))}
          </div>
          <div className="h-14 w-full animate-pulse rounded bg-ink/10" />
        </div>
      </section>
    </article>
  );
}
