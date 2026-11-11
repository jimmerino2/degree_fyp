import type { ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  icon?: LucideIcon;
}

const variants = {
  primary: "bg-brand text-white hover:bg-brand/90",
  secondary: "bg-surface text-brand border border-brand hover:bg-brand-soft",
  ghost: "text-brand hover:bg-brand-soft",
};

export function Button({ variant = "primary", icon: Icon, className = "", children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-btn px-4 font-semibold disabled:opacity-50 ${variants[variant]} ${className}`}
      {...rest}
    >
      {Icon && <Icon aria-hidden size={20} />}
      {children}
    </button>
  );
}
