/**
 * JS access to reveal tokens defined on `:root` in `globals.css`.
 * CSS is the source of truth — do not duplicate durations here.
 */
export function readCssMs(name: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const n = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(name),
  );
  return Number.isFinite(n) ? n : fallback;
}
