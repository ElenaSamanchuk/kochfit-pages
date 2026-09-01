"use client";

import { useCallback, useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { assetPath } from "@/lib/asset-path";

type GalleryImage = { src: string; alt: string; caption?: string };

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d={dir === "prev" ? "M11.5 3.5 6 9l5.5 5.5" : "M6.5 3.5 12 9l-5.5 5.5"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function useIndex(length: number) {
  const [index, setIndex] = useState(0);
  const clamp = useCallback(
    (n: number) => ((n % length) + length) % length,
    [length],
  );
  const go = useCallback((n: number) => setIndex(clamp(n)), [clamp]);
  const prev = useCallback(() => setIndex((i) => clamp(i - 1)), [clamp]);
  const next = useCallback(() => setIndex((i) => clamp(i + 1)), [clamp]);
  return { index, go, prev, next };
}

export function ImageLightbox({
  images,
  openIndex,
  onClose,
}: {
  images: readonly GalleryImage[];
  openIndex: number | null;
  onClose: () => void;
}) {
  const { index, go, prev, next } = useIndex(images.length);

  useEffect(() => {
    if (openIndex !== null) go(openIndex);
  }, [openIndex, go]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, prev, next]);

  const current = images[index];
  if (!current) return null;

  return (
    <Modal
      open={openIndex !== null}
      onClose={onClose}
      ariaLabel={current.alt || "Увеличенное изображение"}
      overlayClassName="bg-[rgba(60,60,66,0.72)]"
      zIndexClass="z-[80]"
      panelClassName="max-w-[min(1100px,94vw)]"
    >
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-0 top-[-44px] flex size-[36px] items-center justify-center rounded-full bg-white text-ink transition hover:opacity-80"
          aria-label="Закрыть"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path d="M1 1l12 12M13 1 1 13" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
        <img
          src={assetPath(current.src)}
          alt={current.alt}
          className="max-h-[82vh] w-full rounded-[16px] object-contain"
        />
        {current.caption && (
          <p className="mt-[10px] text-center text-[13px] text-white/90">{current.caption}</p>
        )}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-[-8px] top-1/2 flex size-[40px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-[var(--shadow-card)] sm:left-[-18px]"
              aria-label="Предыдущее фото"
            >
              <Chevron dir="prev" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-[-8px] top-1/2 flex size-[40px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-[var(--shadow-card)] sm:right-[-18px]"
              aria-label="Следующее фото"
            >
              <Chevron dir="next" />
            </button>
            <p className="mt-[8px] text-center text-[12px] text-white/80">
              {index + 1} / {images.length}
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}

export function ArticleImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <figure className="py-[8px]">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-zoom-in overflow-hidden rounded-[16px] text-left"
      >
        <img
          src={assetPath(src)}
          alt={alt}
          loading="lazy"
          className="h-auto w-full max-w-full object-cover transition hover:opacity-95"
        />
      </button>
      {caption && (
        <figcaption className="mt-[8px] text-center text-[13px] text-ink-muted">{caption}</figcaption>
      )}
      <ImageLightbox
        images={[{ src, alt, caption }]}
        openIndex={open ? 0 : null}
        onClose={() => setOpen(false)}
      />
    </figure>
  );
}

export function ArticleImageSlider({ images }: { images: readonly GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-[8px]">
      <div className="relative">
        <div
          data-drag-scroll
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((im, j) => (
            <button
              key={im.src}
              type="button"
              onClick={() => setOpenIndex(j)}
              className="w-[min(100%,420px)] shrink-0 cursor-zoom-in snap-start overflow-hidden rounded-[16px] sm:w-[calc(50%-6px)]"
            >
              <img
                src={assetPath(im.src)}
                alt={im.alt}
                loading="lazy"
                className="h-[240px] w-full object-cover sm:h-[280px]"
              />
            </button>
          ))}
        </div>
        {images.length > 1 && (
          <div className="mt-[10px] hidden items-center justify-end gap-2 xl:flex">
            <button
              type="button"
              data-carousel-prev=""
              className="flex size-[36px] items-center justify-center rounded-full bg-surface-blue text-ink transition hover:opacity-80"
              aria-label="Предыдущее фото"
            >
              <Chevron dir="prev" />
            </button>
            <button
              type="button"
              data-carousel-next=""
              className="flex size-[36px] items-center justify-center rounded-full bg-surface-blue text-ink transition hover:opacity-80"
              aria-label="Следующее фото"
            >
              <Chevron dir="next" />
            </button>
          </div>
        )}
      </div>
      <ImageLightbox images={images} openIndex={openIndex} onClose={() => setOpenIndex(null)} />
    </section>
  );
}

export function ArticleVideo({ src }: { src: string }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-[16px] bg-[#0b0b0c] shadow-[var(--shadow-card)]"
      style={{ aspectRatio: "16 / 9" }}
    >
      <iframe
        src={src}
        className="absolute inset-0 size-full border-0"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        loading="lazy"
        title="Видео урока Kochfit"
      />
    </div>
  );
}

export function ArticleVideoSlider({ srcs }: { srcs: readonly string[] }) {
  const { index, go, prev, next } = useIndex(srcs.length);
  const src = srcs[index];
  if (!src) return null;

  return (
    <div className="py-[8px]">
      <ArticleVideo src={src} />
      <div className="mt-[10px] flex items-center justify-between gap-3">
        <p className="text-[13px] text-ink-muted">
          Видео {index + 1} из {srcs.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            className="hidden size-[36px] items-center justify-center rounded-full bg-surface-blue text-ink transition hover:opacity-80 xl:flex"
            aria-label="Предыдущее видео"
          >
            <Chevron dir="prev" />
          </button>
          <div className="flex gap-1.5">
            {srcs.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                className={`size-[8px] rounded-full transition ${
                  i === index ? "bg-accent" : "bg-line"
                }`}
                aria-label={`Видео ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            className="hidden size-[36px] items-center justify-center rounded-full bg-surface-blue text-ink transition hover:opacity-80 xl:flex"
            aria-label="Следующее видео"
          >
            <Chevron dir="next" />
          </button>
        </div>
      </div>
    </div>
  );
}
