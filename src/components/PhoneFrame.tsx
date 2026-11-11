import type { ReactNode } from "react";

/** 390 × 844 phone on desktop; fills the screen on small viewports. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-canvas sm:h-[844px] sm:w-[390px] sm:shrink-0 sm:rounded-[44px] sm:border-[10px] sm:border-neutral-800">
      {children}
    </div>
  );
}
