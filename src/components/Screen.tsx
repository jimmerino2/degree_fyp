import type { ReactNode } from "react";
import { useDevice } from "../device";

/** Standard screen shell: top bar, scrolling body, optional footer. */
export function Screen({ top, footer, children }: { top: ReactNode; footer?: ReactNode; children: ReactNode }) {
  // On desktop, keep content to a readable column rather than stretching wide.
  const column = useDevice() === "desktop" ? "mx-auto w-full max-w-2xl" : "";

  return (
    <div className="fade-in flex h-full flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className={column}>{top}</div>
      <main className="flex flex-1 flex-col overflow-y-auto px-4 pb-6">
        <div className={`flex flex-1 flex-col gap-4 ${column}`}>{children}</div>
      </main>
      {footer && <div className={column}>{footer}</div>}
    </div>
  );
}
