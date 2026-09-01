"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";

/**
 * Модалка с Kinescope-плеером (защищённый видеохостинг курса — нативной
 * замены iframe нет). Открывается по клику на карточку бесплатной тренировки.
 * Пока плеер инициализируется (несколько секунд чёрного экрана), показываем
 * спиннер; скрываем его по postMessage `event: "ready"` от player.js
 * или по страховочному таймауту.
 */
export function VideoModal({
  src,
  title,
  onClose,
}: {
  src: string;
  title?: string;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);

  const requestClose = () => setOpen(false);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!String(e.origin).includes("kinescope")) return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data?.event === "ready") setLoading(false);
      } catch {
        // не JSON — игнорируем
      }
    };
    window.addEventListener("message", onMessage);
    const fallback = setTimeout(() => setLoading(false), 15000);
    return () => {
      window.removeEventListener("message", onMessage);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <Modal
      open={open}
      onClose={requestClose}
      onClosed={onClose}
      ariaLabel={title ?? "Видео"}
      overlayClassName="bg-black/70 backdrop-blur-sm"
      panelClassName="max-w-[900px]"
      zIndexClass="z-[100]"
    >
      <button
        type="button"
        aria-label="Закрыть видео"
        onClick={requestClose}
        className="absolute -top-[42px] right-0 flex size-[34px] items-center justify-center rounded-full bg-white/90 text-ink transition hover:bg-white"
      >
        <svg aria-hidden viewBox="0 0 14 14" className="size-[12px]">
          <path
            d="M1.5 1.5l11 11M12.5 1.5l-11 11"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div
        className="relative w-full overflow-hidden rounded-[16px] bg-black"
        style={{ aspectRatio: "16 / 9" }}
      >
        <iframe
          src={src}
          className="absolute inset-0 size-full border-0"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          title={title ?? "Видео урока Kochfit"}
        />
        {loading && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black"
          >
            <span className="size-[42px] animate-spin rounded-full border-[3px] border-white/25 border-t-white" />
            <span className="text-[13px] font-medium text-white/70">
              Загружаем видео…
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}
