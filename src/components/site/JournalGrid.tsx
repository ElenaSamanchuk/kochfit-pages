"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { journalArticles } from "@/content/public-pages";
import { Typo } from "@/components/ui/TypoText";

const categories = ["Все", "Питание", "Тренировки", "ЗОЖ"] as const;
type Category = (typeof categories)[number];

/** Сетка статей журнала с рабочим фильтром по категориям */
export function JournalGrid() {
  const [active, setActive] = useState<Category>("Все");

  const visible = useMemo(
    () =>
      active === "Все"
        ? journalArticles
        : journalArticles.filter((a) => a.category === active),
    [active],
  );

  return (
    <Typo>
    <>
      {/* Мобила — один ряд без переноса; sm+ — свободный wrap */}
      <div
        className="mt-[28px] flex flex-nowrap gap-[6px] sm:flex-wrap sm:gap-[8px]"
        role="tablist"
        aria-label="Категории статей"
      >
        {categories.map((c) => {
          const isActive = c === active;
          return (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(c)}
              className={`inline-flex min-h-[34px] items-center justify-center whitespace-nowrap rounded-full px-[12px] py-[7px] text-center text-[12px] font-semibold leading-none transition sm:min-h-[44px] sm:px-[16px] sm:py-[8px] sm:text-[13px] ${
                isActive
                  ? "bg-accent text-white"
                  : "bg-white text-ink-secondary shadow-[var(--shadow-card)] hover:text-accent"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="mt-[32px] grid gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((a) => (
          <article
            key={a.title}
            className="group flex flex-col overflow-hidden rounded-[20px] bg-white shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-hover)]"
          >
            <Link href={a.href} className="flex flex-1 flex-col">
              <span className="flex flex-1 flex-col p-[22px]">
                <span className="text-[12px] font-semibold uppercase tracking-[0.04em] text-accent">
                  {a.category}
                </span>
                <h2 className="mt-[10px] font-display text-[18px] font-normal leading-[1.3] text-ink transition group-hover:text-accent">
                  {a.title}
                </h2>
                <p className="mt-auto pt-[16px] text-[13px] text-ink-muted">
                  {a.minutes} мин чтения
                </p>
              </span>
            </Link>
          </article>
        ))}
      </div>
    </>
    </Typo>
  );
}
