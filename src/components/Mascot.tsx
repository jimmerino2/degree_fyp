/** Placeholder chilli mascot. Swap for the final illustration later. */
export function Mascot({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden className="shrink-0">
      <circle cx="32" cy="32" r="32" fill="#E7F1E4" />
      <path d="M32 14 Q33 7 39 5" stroke="#2F6B3A" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M19 24 Q17 13 32 13 Q47 13 45 24 Q43 42 31 55 Q27 59 25 55 Q20 43 19 24 Z" fill="#C8372D" />
      <path d="M20 19 Q32 9 44 19 Q38 16 32 18 Q26 16 20 19 Z" fill="#2F6B3A" />
      <circle cx="27" cy="27" r="2.6" fill="#1E2A22" />
      <circle cx="37" cy="27" r="2.6" fill="#1E2A22" />
      <circle cx="27.8" cy="26.2" r="0.9" fill="#fff" />
      <circle cx="37.8" cy="26.2" r="0.9" fill="#fff" />
      <path d="M28 33 Q32 37 36 33" stroke="#1E2A22" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="23.5" cy="32" r="2" fill="#F08A7E" />
      <circle cx="40.5" cy="32" r="2" fill="#F08A7E" />
    </svg>
  );
}
