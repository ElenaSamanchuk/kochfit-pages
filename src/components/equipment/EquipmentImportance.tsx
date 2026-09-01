"use client";

import { useEffect, useRef, useState } from "react";

const MS_PER_PERCENT = 26;
const MIN_DURATION = 450;
const MAX_DURATION = 2800;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function durationForTarget(target: number) {
  return Math.round(
    Math.max(MIN_DURATION, Math.min(MAX_DURATION, target * MS_PER_PERCENT)),
  );
}

/** Figma 2351:10228 — fill width % per importance label (non-linear) */
const FIGMA_BAR_WIDTH: Record<number, string> = {
  98: "97.38%",
  85: "80.28%",
  70: "69.77%",
  60: "61.05%",
  30: "29.94%",
  20: "17.15%",
  15: "12.5%",
};

export function importanceBarWidth(value: number) {
  return (
    FIGMA_BAR_WIDTH[value] ??
    `${Math.min(100, Math.max(0, value * 0.993))}%`
  );
}

/** Шкала «Важность» — Intersection Observer + scaleX, как kochfit-oborudovanie */
export function EquipmentImportance({
  value,
  barClassName = "h-2",
}: {
  value: number;
  barClassName?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [displayPercent, setDisplayPercent] = useState(0);
  const animatedRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    const bar = barRef.current;
    if (!root || !bar) return;

    const target = Math.max(0, Math.min(100, value));
    const duration = durationForTarget(target);

    const runAnimation = () => {
      if (animatedRef.current) return;
      animatedRef.current = true;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) {
        setDisplayPercent(Math.round(target));
        bar.classList.add("is-filled");
        return;
      }

      bar.style.width = importanceBarWidth(target);
      bar.style.transform = "scaleX(0)";
      bar.style.transition = "none";
      void bar.offsetWidth;
      bar.style.transition = `transform ${duration}ms ease-in-out`;
      bar.style.transform = "scaleX(1)";

      const start = performance.now();
      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        setDisplayPercent(Math.round(target * easeInOut(t)));
        if (t < 1) requestAnimationFrame(frame);
        else setDisplayPercent(Math.round(target));
      };
      requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          runAnimation();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [value]);

  return (
    <div ref={rootRef} className="flex w-full flex-col gap-3">
      <div className="flex justify-between text-[12px] font-semibold">
        <span className="text-ink-muted">Важность:</span>
        <span className="tabular-nums text-ink">{displayPercent}%</span>
      </div>
      <div className={`relative w-full ${barClassName}`}>
        <span className="absolute inset-0 rounded-full bg-surface-blue shadow-[inset_0px_4px_4px_0px_rgba(132,176,210,0.12)]" />
        <span
          ref={barRef}
          className="equipment-importance-fill absolute inset-y-0 left-0 rounded-full"
          style={{
            width: importanceBarWidth(value),
            backgroundImage: "var(--gradient-primary)",
          }}
        />
      </div>
    </div>
  );
}
