import { createClient } from "@/lib/supabase/server";
import { formatMAD } from "@/lib/utils";
import { SetupNote, Empty } from "../../_components/Notes";
import { updateOrderStatus } from "../../actions";
import type { OrderItem } from "@/lib/orders";

type OrderRow = {
  id: string;
  reference: string;
  customer_name: string;
  phone: string;
  city: string | null;
  address: string;
  note: string | null;
  items: OrderItem[];
  subtotal: number;
  status: string;
  created_at: string;
};

const STATUSES = ["nouvelle", "confirmée", "livrée", "annulée"] as const;

const statusStyle: Record<string, string> = {
  nouvelle: "bg-or/20 text-leather",
  confirmée: "bg-ink/10 text-ink",
  livrée: "bg-green-600/15 text-green-700",
  annulée: "bg-leather/10 text-leather",
};

export default async function AdminOrders() {
  let rows: OrderRow[] = [];
  let missing = false;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) missing = true;
    else rows = (data ?? []) as OrderRow[];
  } catch {
    missing = true;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-[380]">Commandes</h1>
      <p className="mt-2 text-ink/60">
        Paiement à la livraison — chaque commande passée sur le site arrive ici.
      </p>

      {missing ? (
        <SetupNote />
      ) : rows.length === 0 ? (
        <Empty label="Aucune commande pour l'instant." />
      ) : (
        <ul className="mt-8 space-y-5">
          {rows.map((o) => {
            const waPhone = o.phone.replace(/[^\d]/g, "");
            return (
              <li
                key={o.id}
                className="rounded-[2px] border border-ink/10 bg-paper-2/40 p-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg font-[380]">
                      {o.reference}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[0.62rem] uppercase tracking-wider ${
                        statusStyle[o.status] ?? "bg-ink/10 text-ink"
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                  <span className="text-sm text-ink/45">
                    {new Date(o.created_at).toLocaleString("fr-FR")}
                  </span>
                </div>

                <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div className="text-sm text-ink/75">
                    <p className="font-medium text-ink">{o.customer_name}</p>
                    <p className="mt-0.5">
                      <a href={`tel:${o.phone}`} className="hover:text-ink">
                        {o.phone}
                      </a>
                      {waPhone && (
                        <>
                          {" · "}
                          <a
                            href={`https://wa.me/${waPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="u-link hover:text-ink"
                          >
                            WhatsApp
                          </a>
                        </>
                      )}
                    </p>
                    <p className="mt-0.5 text-ink/60">
                      {[o.city, o.address].filter(Boolean).join(" — ")}
                    </p>
                    {o.note && <p className="mt-1 text-ink/55">📝 {o.note}</p>}
                  </div>
                  <p className="font-display text-xl font-[380] tabular-nums sm:text-right">
                    {formatMAD(o.subtotal)}
                  </p>
                </div>

                <ul className="mt-3 border-t border-ink/10 pt-3 text-sm text-ink/70">
                  {o.items?.map((it, idx) => {
                    const variant = [it.color, it.fit, it.size]
                      .filter(Boolean)
                      .join(" · ");
                    return (
                      <li
                        key={idx}
                        className="flex justify-between gap-3 py-0.5"
                      >
                        <span>
                          {it.name}
                          {variant ? ` (${variant})` : ""} ×{it.qty}
                        </span>
                        <span className="tabular-nums">
                          {formatMAD(it.price * it.qty)}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <form
                  action={updateOrderStatus}
                  className="mt-4 flex items-center gap-2"
                >
                  <input type="hidden" name="id" value={o.id} />
                  <select
                    name="status"
                    defaultValue={o.status}
                    className="rounded-[2px] border border-ink/20 bg-paper px-3 py-2 text-sm focus:border-ink focus:outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button className="rounded-[2px] border border-ink/20 px-4 py-2 text-sm transition-colors hover:border-ink">
                    Mettre à jour
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
