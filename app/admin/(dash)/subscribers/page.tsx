import { createClient } from "@/lib/supabase/server";
import { SetupNote, Empty } from "../../_components/Notes";

type SubscriberRow = {
  id: string;
  email: string;
  created_at: string;
};

export default async function AdminSubscribers() {
  let rows: SubscriberRow[] = [];
  let missing = false;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) missing = true;
    else rows = (data ?? []) as SubscriberRow[];
  } catch {
    missing = true;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-[380]">Abonnés</h1>
      <p className="mt-2 text-ink/60">Inscriptions à la lettre de l&apos;écurie.</p>

      {missing ? (
        <SetupNote />
      ) : rows.length === 0 ? (
        <Empty label="Aucun abonné pour l'instant." />
      ) : (
        <>
          <p className="mt-8 text-sm text-ink/50">
            {rows.length} abonné{rows.length > 1 ? "s" : ""}
          </p>
          <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
            {rows.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <a
                  href={`mailto:${s.email}`}
                  className="u-link text-ink/80 hover:text-ink"
                >
                  {s.email}
                </a>
                <span className="text-sm text-ink/45">
                  {new Date(s.created_at).toLocaleDateString("fr-FR")}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
