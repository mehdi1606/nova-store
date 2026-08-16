export default function BoutiqueLoading() {
  return (
    <>
      <section className="bg-paper pb-16 pt-32 lg:pt-40">
        <div className="edge-x">
          <div className="h-4 w-24 animate-pulse rounded bg-ink/10" />
          <div className="mt-7 h-12 w-72 animate-pulse rounded bg-ink/10" />
          <div className="mt-6 h-5 w-96 max-w-full animate-pulse rounded bg-ink/10" />
          <div className="mt-10 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-24 animate-pulse rounded-full bg-ink/10" />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-paper pb-24 lg:pb-32">
        <div className="edge-x grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[3/4] animate-pulse rounded bg-ink/10" />
              <div className="h-5 w-40 animate-pulse rounded bg-ink/10" />
              <div className="h-4 w-20 animate-pulse rounded bg-ink/10" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
