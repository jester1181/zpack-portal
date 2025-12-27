"use client";

type ServerControlsProps = {
  status?: "online" | "offline" | "starting" | "stopping" | "unknown";
};

export default function ServerControls({ status = "unknown" }: ServerControlsProps) {
  return (
    <section className="rounded-lg border border-white/10 bg-black/40 p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/60">
            Server Controls
          </p>
          <p className="mt-1 text-sm text-white/80">Status: {status}</p>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-md border border-white/20 px-3 py-1 text-xs text-white/60"
            type="button"
            disabled
            aria-disabled="true"
          >
            Start
          </button>
          <button
            className="rounded-md border border-white/20 px-3 py-1 text-xs text-white/60"
            type="button"
            disabled
            aria-disabled="true"
          >
            Stop
          </button>
          <button
            className="rounded-md border border-white/20 px-3 py-1 text-xs text-white/60"
            type="button"
            disabled
            aria-disabled="true"
          >
            Restart
          </button>
        </div>
      </div>
      <p className="mt-3 text-xs text-white/50">
        Actions are disabled until the control plane API is wired in.
      </p>
    </section>
  );
}
