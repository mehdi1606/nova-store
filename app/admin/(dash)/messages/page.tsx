import { createClient } from "@/lib/supabase/server";
import { SetupNote, Empty } from "../../_components/Notes";

type MessageRow = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
};

export default async function AdminMessages() {
  let rows: MessageRow[] = [];
  let missing = false;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) missing = true;
    else rows = (data ?? []) as MessageRow[];
  } catch {
    missing = true;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-[380]">Messages</h1>
      <p className="mt-2 text-ink/60">
        Demandes reçues via le formulaire de contact.
      </p>

      {missing ? (
        <SetupNote />
      ) : rows.length === 0 ? (
        <Empty label="Aucun message pour l'instant." />
      ) : (
        <ul className="mt-8 space-y-4">
          {rows.map((m) => (
            <li
              key={m.id}
              className="rounded-[2px] border border-ink/10 bg-paper-2/40 p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-display text-lg font-[380]">{m.name}</span>
                <span className="text-sm text-ink/45">
                  {new Date(m.created_at).toLocaleString("fr-FR")}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-ink/60">
                <a href={`mailto:${m.email}`} className="u-link hover:text-ink">
                  {m.email}
                </a>
                {m.subject && (
                  <span className="rounded-full bg-ink/[0.08] px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wider">
                    {m.subject}
                  </span>
                )}
              </div>
              <p className="mt-3 whitespace-pre-wrap text-ink/80">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
