"use client";

import { useState } from "react";
import resultsJson from "@/content/migrated/results.json";
import { assetPath } from "@/lib/asset-path";
import { Modal } from "@/components/ui/Modal";
import { Typo } from "@/components/ui/TypoText";

type ResultStory = {
  name: string;
  course: string;
  quote: string;
  photo: string | null;
  story: string[];
};

const stories = resultsJson as ResultStory[];

/** Карточки участниц с фото «до/после» и попапом полной истории (старый /result, page32645944) */
export function ResultCards() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const open = openIdx === null ? null : stories[openIdx];

  return (
    <Typo>
    <>
      <div className="mt-[32px] grid gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((s, i) => (
          <article
            key={i}
            className="flex flex-col overflow-hidden rounded-[20px] bg-white shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-hover)]"
          >
            {s.photo && (
              <img
                src={assetPath(s.photo)}
                alt={`Результат «до/после», ${s.name}, курс «${s.course}»`}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            )}
            <div className="flex flex-1 flex-col p-[20px]">
              <span className="inline-flex items-center justify-center self-start rounded-full bg-surface-blue px-[12px] py-[4px] text-center text-[12px] font-semibold leading-none text-accent">
                {s.course}
              </span>
              <p className="mt-[12px] font-display text-[16px] font-bold text-ink">
                {s.name}
              </p>
              <p className="mt-[8px] line-clamp-5 text-[14px] leading-[1.45] sm:leading-[1.55] text-ink-secondary">
                "{s.quote}"
              </p>
              <div className="mt-auto pt-[14px]">
                <button
                  type="button"
                  onClick={() => setOpenIdx(i)}
                  className="btn-primary flex min-h-[40px] w-full items-center justify-center rounded-[10px] px-4 py-2.5 text-[13px] transition hover:brightness-105 active:brightness-95 xl:min-h-[44px] xl:rounded-[12px] xl:px-5 xl:py-3"
                >
                  Читать полную историю участницы
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Modal
        open={openIdx !== null}
        onClose={() => setOpenIdx(null)}
        ariaLabel={open?.name ?? "История участницы"}
        panelClassName="max-w-[640px] rounded-[24px] bg-white p-[24px] shadow-[0_20px_60px_rgba(75,77,87,0.18)] sm:p-[32px]"
      >
        {open ? (
          <>
            <button
              type="button"
              aria-label="Закрыть"
              onClick={() => setOpenIdx(null)}
              className="absolute right-[14px] top-[14px] flex size-[32px] items-center justify-center rounded-full text-ink-muted transition hover:bg-surface hover:text-ink"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <span className="inline-flex items-center justify-center rounded-full bg-surface-blue px-[12px] py-[4px] text-center text-[12px] font-semibold leading-none text-accent">
              {open.course}
            </span>
            <h2 className="mt-[10px] font-display text-[24px] font-normal text-ink">
              {open.name}
            </h2>
            {open.photo && (
              <img
                src={assetPath(open.photo)}
                alt={`Результат «до/после», ${open.name}`}
                className="mt-[16px] w-full rounded-[16px]"
              />
            )}
            <div className="mt-[16px] space-y-[10px] text-[15px] leading-[1.45] sm:leading-[1.6] text-ink-secondary">
              {open.story.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          </>
        ) : null}
      </Modal>
    </>
    </Typo>
  );
}
