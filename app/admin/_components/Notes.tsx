export function SetupNote() {
  return (
    <div className="mt-8 rounded-[2px] border border-leather/30 bg-leather/5 p-5 text-sm text-leather">
      Cette table n&apos;existe pas encore. Exécutez le script de{" "}
      <code className="rounded bg-ink/10 px-1">SUPABASE_SETUP.md</code> dans
      Supabase → SQL Editor, puis rechargez la page.
    </div>
  );
}

export function Empty({ label }: { label: string }) {
  return (
    <p className="mt-8 rounded-[2px] border border-dashed border-ink/15 p-10 text-center text-ink/50">
      {label}
    </p>
  );
}
