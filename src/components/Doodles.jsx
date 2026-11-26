// Hand-drawn style doodles from the Crumb & Co. menu posters (stars, loop arrow, crumbs). Stroke follows currentColor.
export function Star({ className = '', style }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" aria-hidden="true">
      <path d="M50 6 L61 38 L95 39 L67 59 L78 93 L50 72 L21 93 L33 59 L5 39 L39 38 Z" />
      <path d="M52 12 L60 40 L88 42" opacity=".55" />
    </svg>
  );
}

export function LoopArrow({ className = '', style }) {
  return (
    <svg viewBox="0 0 220 110" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
      <path d="M6 58 C 30 10, 80 10, 70 52 C 62 88, 22 78, 40 52 C 62 22, 130 70, 205 52" />
      <path d="M188 38 L206 52 L186 64" />
    </svg>
  );
}

export function Crumbs({ className = '', style }) {
  return (
    <svg viewBox="0 0 60 40" className={className} style={style} fill="currentColor" aria-hidden="true">
      <circle cx="8" cy="30" r="4" /><circle cx="22" cy="14" r="3" /><circle cx="36" cy="26" r="5" /><circle cx="50" cy="10" r="3" />
    </svg>
  );
}
