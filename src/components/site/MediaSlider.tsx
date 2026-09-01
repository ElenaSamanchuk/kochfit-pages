"use client";

import { useCallback, useRef, useState } from "react";
import {
  ArticleImage,
  ArticleVideo,
  ImageLightbox,
} from "@/components/site/ArticleMedia";
import { VideoModal } from "@/components/site/VideoModal";
import { assetPath } from "@/lib/asset-path";

export type MediaSlide =
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "video"; src: string; preview?: string };

function isImage(
  item: MediaSlide,
): item is Extract<MediaSlide, { kind: "image" }> {
  return item.kind === "image";
}

function kinescopePosterUrl(embedSrc: string): string | undefined {
  const match = embedSrc.match(/kinescope\.io\/(?:embed\/)?([^/?#]+)/i);
  const id = match?.[1];
  if (!id) return undefined;
  return `https://kinescope.io/${id}/poster.jpg`;
}

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

function PlayMark() {
  return (
    <span
      className="flex size-[80px] items-center justify-center rounded-full text-white shadow-[0_8px_24px_rgba(0,0,0,0.28)]"
      style={{ backgroundImage: "var(--gradient-primary)" }}
    >
      <svg width="22" height="24" viewBox="0 0 14 16" fill="none" aria-hidden>
        <path
          d="M13 6.27a2 2 0 0 1 0 3.46L3 15.5A2 2 0 0 1 0 13.77V2.23A2 2 0 0 1 3 .5l10 5.77Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

function withKinescopeAutoplay(src: string): string {
  if (src.includes("autoplay=")) return src;
  return `${src}${src.includes("?") ? "&" : "?"}autoplay=1`;
}

function useMediaLightbox(items: readonly MediaSlide[]) {
  const images = items.filter(isImage);
  const [imageIndex, setImageIndex] = useState<number | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const openSlide = useCallback(
    (i: number) => {
      const item = items[i];
      if (!item) return;
      if (item.kind === "image") {
        let idx = 0;
        for (let k = 0; k < i; k++) {
          if (items[k]?.kind === "image") idx += 1;
        }
        setImageIndex(idx);
        return;
      }
      setVideoSrc(item.src);
    },
    [items],
  );

  const lightbox = (
    <>
      {images.length > 0 && (
        <ImageLightbox
          images={images}
          openIndex={imageIndex}
          onClose={() => setImageIndex(null)}
        />
      )}
      {videoSrc && (
        <VideoModal
          src={withKinescopeAutoplay(videoSrc)}
          onClose={() => setVideoSrc(null)}
        />
      )}
    </>
  );

  return { openSlide, lightbox };
}

function VideoSlideTile({
  src,
  preview,
  onOpen,
}: {
  src: string;
  preview?: string;
  onOpen: () => void;
}) {
  const poster = kinescopePosterUrl(src);
  const fallback = preview ? assetPath(preview) : undefined;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="relative block h-full w-full cursor-pointer overflow-hidden rounded-[16px] bg-surface-blue text-white"
      aria-label="Смотреть видео"
    >
      {fallback && (
        <img
          src={fallback}
          alt=""
          draggable={false}
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
        />
      )}
      {poster && (
        <img
          src={poster}
          alt=""
          draggable={false}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 size-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
      <span className="pointer-events-none absolute inset-0 bg-black/30" aria-hidden />
      <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3">
        <PlayMark />
        <span className="font-display text-[15px] font-bold drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]">
          Смотреть видео
        </span>
      </span>
    </button>
  );
}

function SlideTile({
  item,
  onOpen,
}: {
  item: MediaSlide;
  onOpen: () => void;
}) {
  if (item.kind === "image") {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="relative block h-full w-full cursor-zoom-in overflow-hidden rounded-[16px] text-left"
      >
        <img
          src={assetPath(item.src)}
          alt={item.alt}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover"
        />
        {item.caption && (
          <span className="absolute inset-x-0 bottom-0 bg-black/45 px-[12px] py-[8px] text-[12px] text-white">
            {item.caption}
          </span>
        )}
      </button>
    );
  }

  return <VideoSlideTile src={item.src} preview={item.preview} onOpen={onOpen} />;
}

function MediaPair({ items }: { items: readonly [MediaSlide, MediaSlide] }) {
  const { openSlide, lightbox } = useMediaLightbox(items);

  return (
    <section className="py-[8px]">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item, i) => (
          <div
            key={`${item.kind}-${item.src}-${i}`}
            className="aspect-video min-h-0 overflow-hidden rounded-[16px]"
          >
            <SlideTile item={item} onOpen={() => openSlide(i)} />
          </div>
        ))}
      </div>
      {lightbox}
    </section>
  );
}

function MediaCarousel({ items }: { items: readonly MediaSlide[] }) {
  const length = items.length;
  const [index, setIndex] = useState(0);
  const { openSlide, lightbox } = useMediaLightbox(items);
  const swipe = useRef({ startX: 0, startY: 0, dx: 0, active: false, moved: false });

  const clamp = useCallback(
    (n: number) => ((n % length) + length) % length,
    [length],
  );
  const go = useCallback((n: number) => setIndex(clamp(n)), [clamp]);
  const prev = useCallback(() => setIndex((i) => clamp(i - 1)), [clamp]);
  const next = useCallback(() => setIndex((i) => clamp(i + 1)), [clamp]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    swipe.current = {
      startX: e.clientX,
      startY: e.clientY,
      dx: 0,
      active: true,
      moved: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!swipe.current.active) return;
    const dx = e.clientX - swipe.current.startX;
    const dy = e.clientY - swipe.current.startY;
    swipe.current.dx = dx;
    // Same threshold as slide-change, so a click with slight jitter still opens video.
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      swipe.current.moved = true;
    }
  };

  const endPointer = () => {
    if (!swipe.current.active) return;
    const { dx, moved } = swipe.current;
    swipe.current.active = false;
    if (!moved) return;
    if (dx > 40) prev();
    else if (dx < -40) next();
  };

  const onOpen = (i: number) => {
    if (swipe.current.moved) return;
    openSlide(i);
  };

  return (
    <section
      className="py-[8px]"
      aria-roledescription="carousel"
      aria-label="Галерея"
    >
      <div className="relative">
        <div
          className="overflow-hidden rounded-[16px] select-none [touch-action:pan-y]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
        >
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {items.map((item, i) => (
              <div
                key={`${item.kind}-${item.src}-${i}`}
                className="aspect-video w-full shrink-0"
                aria-hidden={i !== index}
              >
                <SlideTile item={item} onOpen={() => onOpen(i)} />
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            prev();
          }}
          className="absolute left-[8px] top-1/2 z-10 hidden size-[40px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-[var(--shadow-card)] transition hover:opacity-80 xl:flex"
          aria-label="Предыдущий слайд"
        >
          <Chevron dir="prev" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            next();
          }}
          className="absolute right-[8px] top-1/2 z-10 hidden size-[40px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-[var(--shadow-card)] transition hover:opacity-80 xl:flex"
          aria-label="Следующий слайд"
        >
          <Chevron dir="next" />
        </button>
      </div>
      <div className="mt-[10px] flex items-center justify-between gap-3">
        <p className="text-[13px] text-ink-muted" aria-live="polite">
          {index + 1} / {length}
        </p>
        <div className="flex gap-1.5">
          {items.map((item, i) => (
            <button
              key={`${item.kind}-${item.src}-dot-${i}`}
              type="button"
              onClick={() => go(i)}
              className={`size-[8px] rounded-full transition ${
                i === index ? "bg-accent" : "bg-line"
              }`}
              aria-label={`Слайд ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
      </div>
      {lightbox}
    </section>
  );
}

/**
 * 1 медиа — без хрома слайдера.
 * 2 — сетка (колонка на мобиле, ряд на sm+), без стрелок.
 * 3+ — слайдер: стрелки меняют слайд, точки, свайп.
 */
export function MediaSlider({ items }: { items: readonly MediaSlide[] }) {
  if (items.length === 0) return null;

  if (items.length === 1) {
    const item = items[0];
    if (!item) return null;
    if (item.kind === "image") {
      return <ArticleImage src={item.src} alt={item.alt} caption={item.caption} />;
    }
    return <ArticleVideo src={item.src} />;
  }

  if (items.length === 2) {
    const a = items[0];
    const b = items[1];
    if (!a || !b) return null;
    return <MediaPair items={[a, b]} />;
  }

  return <MediaCarousel items={items} />;
}
