export function Loader({ label }: { label: string }) {
  return (
    <div className="flex min-h-[50vh] animate-fade-in flex-col items-center justify-center" role="status">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-800/40 border-t-secondary" />
        <div className="absolute inset-2 flex animate-pulse items-center justify-center rounded-full border border-slate-800 bg-slate-950/80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" className="h-6 w-6 opacity-60" />
        </div>
      </div>
      <p className="mt-4 animate-pulse text-xs font-bold tracking-widest text-slate-400 uppercase">{label}</p>
    </div>
  );
}
