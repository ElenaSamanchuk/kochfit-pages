/** Декоративный «включённый» переключатель — Figma 2262:2643 (26×14 + тень кнопки).
 * CSS вместо SVG-с-фильтром: feGaussianBlur в `<img>` растрируется на 1× и выглядит мыльно. */
export function Switch() {
  return (
    <span
      aria-hidden
      className="relative block h-[14px] w-[26px] shrink-0 rounded-full"
      style={{ backgroundImage: "var(--gradient-primary)" }}
    >
      <span className="absolute right-[2px] top-[2px] size-2.5 rounded-full bg-surface shadow-[0_3px_4px_rgba(0,0,0,0.1)]" />
    </span>
  );
}
