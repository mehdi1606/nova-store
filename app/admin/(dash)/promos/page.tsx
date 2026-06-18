import { createClient } from "@/lib/supabase/server";
import { formatMAD } from "@/lib/utils";
import { SetupNote, Empty } from "../../_components/Notes";
import { createPromo, deletePromo } from "../../actions";

type PromoRow = {
  id: string;
  code: string;
  kind: string;
  value: number;
  active: boolean;
  expires_at: string | null;
  created_at: string;
};

const inputCls =
  "mt-2 w-full rounded-[2px] border border-ink/20 bg-paper px-3 py-2.5 text-ink focus:border-ink focus:outline-none";

export default async function AdminPromos() {
  let rows: PromoRow[] = [];
  let missing = false;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) missing = true;
    else rows = (data ?? []) as PromoRow[];
  } catch {
    missing = true;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-[380]">Codes promo</h1>
      <p className="mt-2 text-ink/60">
        Créez des réductions. Les clients saisissent le code au moment de la
        commande — le prix se met à jour avec une animation.
      </p>

      <form
        action={createPromo}
        className="mt-8 max-w-2xl rounded-[2px] border border-ink/10 bg-paper-2/40 p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label-xs text-ink/55">Code</span>
            <input
              name="code"
              required
              placeholder="NOVA20"
              className={`${inputCls} uppercase placeholder:normal-case`}
            />
          </label>
          <label className="block">
            <span className="label-xs text-ink/55">Type</span>
            <select name="kind" defaultValue="percent" className={inputCls}>
              <option value="percent">Pourcentage (%)</option>
              <option value="fixed">Montant fixe (Dhs)</option>
            </select>
          </label>
          <label className="block">
            <span className="label-xs text-ink/55">Valeur</span>
            <input
              name="value"
              type="number"
              min="1"
              required
              placeholder="20"
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="label-xs text-ink/55">Expire le (facultatif)</span>
            <input name="expires_at" type="date" className={inputCls} />
          </label>
        </div>
        <button
          type="submit"
          className="mt-5 rounded-[2px] bg-ink px-6 py-3 label text-paper transition-colors hover:bg-ink-deep"
        >
          Créer le code
        </button>
      </form>

      {missing ? (
        <SetupNote />
      ) : rows.length === 0 ? (
        <Empty label="Aucun code pour l'instant." />
      ) : (
        <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
          {rows.map((p) => {
            const expired = p.expires_at && new Date(p.expires_at) < new Date();
            return (
              <div
                key={p.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-display text-lg font-[380]">
                    {p.code}
                  </span>
                  <span className="rounded-full bg-ink/[0.08] px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wider text-ink/60">
                    {p.kind === "fixed"
                      ? `−${formatMAD(p.value)}`
                      : `−${p.value}%`}
                  </span>
                  {expired ? (
                    <span className="text-xs text-leather">expiré</span>
                  ) : (
                    p.expires_at && (
                      <span className="text-xs text-ink/45">
                        jusqu&apos;au{" "}
                        {new Date(p.expires_at).toLocaleDateString("fr-FR")}
                      </span>
                    )
                  )}
                </div>
                <form action={deletePromo}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="text-sm text-leather transition-opacity hover:opacity-70">
                    Supprimer
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
