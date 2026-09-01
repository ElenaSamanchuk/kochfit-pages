import type { ReactNode } from "react";

type Chip = { key: string; node: ReactNode };

/**
 * Плашки-бейджи: на мобиле — явные ряды из `rows` (ровно N строк, без свободного wrap),
 * на sm+ — единый flex-wrap по центру как в десктоп-макете.
 */
export function ChipBadgeRows({
  rows,
  className,
}: {
  /** Строки плашек; на мобиле каждая строка — отдельный ряд */
  rows: Chip[][];
  className?: string;
}) {
  const flat = rows.flat();
  const extra = className ? ` ${className}` : "";

  return (
    <>
      {/* Мобила (<sm): фиксированные ряды — 2+2 не скатывается в 3 строки */}
      <div className={`flex w-full flex-col items-center gap-1.5 sm:hidden${extra}`}>
        {rows.map((row) => (
          <div
            key={row.map((c) => c.key).join("|")}
            className="flex max-w-full flex-nowrap items-center justify-center gap-1.5"
          >
            {row.map((chip) => (
              <span key={chip.key} className="block">
                {chip.node}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* sm+: единый flex-wrap */}
      <div
        className={`hidden w-full flex-wrap items-center justify-center gap-3 sm:flex${extra}`}
      >
        {flat.map((chip) => (
          <span key={chip.key}>{chip.node}</span>
        ))}
      </div>
    </>
  );
}
