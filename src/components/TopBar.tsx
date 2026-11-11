import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { MASCOT_NAME } from "../config";
import { copy, mascotCopy } from "../data/copy";
import { useMascot } from "../mascot";
import { Mascot } from "./Mascot";

interface TopBarProps {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
}

export function TopBar({ title, onBack, right }: TopBarProps) {
  const { openChat } = useMascot();

  return (
    <header className="flex min-h-16 items-center gap-2 px-2 pt-2">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label={copy.common.back}
          className="flex size-12 items-center justify-center rounded-btn text-ink hover:bg-line/50"
        >
          <ChevronLeft aria-hidden size={28} />
        </button>
      ) : (
        <span className="w-2" />
      )}
      <h1 className="flex-1 text-[22px] font-semibold">{title}</h1>
      {right}
      <button
        type="button"
        onClick={openChat}
        aria-label={mascotCopy.open(MASCOT_NAME)}
        className="flex size-12 items-center justify-center rounded-full hover:bg-line/50"
      >
        <Mascot size={36} />
      </button>
    </header>
  );
}
