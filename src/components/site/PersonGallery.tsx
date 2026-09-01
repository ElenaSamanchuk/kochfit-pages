"use client";

import { useCallback, useEffect, useState } from "react";
import { assetPath } from "@/lib/asset-path";
import { Modal } from "@/components/ui/Modal";

/** Галерея фото и дипломов с лайтбоксом (стрелки, Escape, клик по фону) */
export function PersonGallery({ images }: { images: readonly string[] }) {
  const [idx, setIdx] = useState<number | null>(null);

  const prev = useCallback(
    () => setIdx((i) => (i === null ? null : (i + images.length - 1) % images.length)),
    [images.length],
  );
  const next = useCallback(
    () => setIdx((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  );

  const close = () => setIdx(null);
  const current = idx === null ? null : images[idx];

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, next, prev]);

  return (
    <>
      <div className="mt-[20px] grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-[10px] lg:grid-cols-6">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIdx(i)}
            aria-label={`Открыть изображение ${i + 1} из ${images.length}`}
            className="group flex aspect-[3/4] min-h-[88px] items-center justify-center rounded-[12px] bg-white p-[4px] shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-hover)] sm:aspect-[4/3] sm:min-h-0 sm:p-[6px]"
          >
            <img
              src={assetPath(src)}
              alt={`Дипломы и сертификаты Юлии Кочкиной, ${i + 1}`}
              loading="lazy"
              className="size-full object-contain transition duration-300 group-hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      <Modal
        open={idx !== null}
        onClose={close}
        ariaLabel="Просмотр изображения"
        overlayClassName="bg-[rgba(30,30,34,0.82)]"
        panelClassName="w-auto max-w-none bg-transparent shadow-none"
      >
        {current !== null && idx !== null ? (
          <>
            <button
              type="button"
              aria-label="Закрыть"
              onClick={close}
              className="fixed right-[16px] top-[16px] z-[1] flex size-[40px] items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Предыдущее"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="fixed left-[8px] top-1/2 z-[1] flex size-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-[24px]"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M11.5 3 6 9l5.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="mx-auto flex h-[85vh] max-h-[85vh] w-[min(90vw,1200px)] max-w-[min(90vw,1200px)] items-center justify-center">
              <img
                src={assetPath(current)}
                alt={`Дипломы и сертификаты Юлии Кочкиной, ${idx + 1}`}
                className="size-full rounded-[12px] object-contain"
              />
            </div>
            <button
              type="button"
              aria-label="Следующее"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="fixed right-[8px] top-1/2 z-[1] flex size-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-[24px]"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M6.5 3 12 9l-5.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <p className="mt-4 text-center text-[13px] font-semibold text-white/80">
              {idx + 1} / {images.length}
            </p>
          </>
        ) : null}
      </Modal>
    </>
  );
}
