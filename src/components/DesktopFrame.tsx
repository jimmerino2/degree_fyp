import type { ReactNode } from "react";

/** Browser-window frame for the desktop view. */
export function DesktopFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[760px] w-full max-w-[1100px] flex-col overflow-hidden rounded-card border border-neutral-400 bg-canvas">
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-line bg-neutral-100 px-4" aria-hidden>
        <span className="size-3 rounded-full bg-neutral-300" />
        <span className="size-3 rounded-full bg-neutral-300" />
        <span className="size-3 rounded-full bg-neutral-300" />
      </div>
      <div className="flex min-h-0 flex-1">{children}</div>
    </div>
  );
}
