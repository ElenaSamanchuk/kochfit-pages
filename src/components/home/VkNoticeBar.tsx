"use client";

import { useSyncExternalStore, useState } from "react";
import { externalLinks } from "@/content/links";
import { Typo } from "@/components/ui/TypoText";

/** Как на старом сайте запоминали закрытие (`kochfit_top_banner_closed` в localStorage),
 *  здесь — cookie, чтобы переживать закрытие вкладки. Срок: 1 год. */
const COOKIE_NAME = "kochfit_vk_notice_closed";
const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 365;

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function readClosedCookie(): boolean {
  try {
    return document.cookie.split("; ").some((part) => {
      const eq = part.indexOf("=");
      if (eq < 0) return false;
      return part.slice(0, eq) === COOKIE_NAME && part.slice(eq + 1) === "1";
    });
  } catch {
    return false;
  }
}

function writeClosedCookie() {
  try {
    document.cookie = `${COOKIE_NAME}=1; Max-Age=${COOKIE_MAX_AGE_SEC}; Path=/; SameSite=Lax`;
  } catch {
    /* ignore */
  }
}

/**
 * Плашка «Если не работает Телеграм — переходите сюда» как на текущем kochfit.ru
 * (page14498897): белая карточка с лого ВК и крестиком поверх hero слева.
 * Закрытие запоминается в cookie на 1 год.
 *
 * Mobile (<xl): absolute overlay + flow-spacer для высоты плашки.
 * Desktop (xl+): absolute, left-aligned with hero tags (xl:left-[100px]) — не сдвигает теги/заголовок.
 */
export function VkNoticeBar() {
  // На сервере/до маунта считаем плашку скрытой, чтобы не было flash и SSR-mismatch
  const closed = useSyncExternalStore(subscribe, readClosedCookie, () => true);
  const [exiting, setExiting] = useState(false);

  const close = () => {
    writeClosedCookie();
    setExiting(true);
  };

  const onAnimEnd = () => {
    if (!exiting) return;
    emit();
  };

  if (closed) return null;

  return (
    <Typo>
      {/* Flow-spacer <xl: резерв под absolute-плашку, чтобы hero pt мог быть как на других лендингах */}
      <div
        aria-hidden
        className="pointer-events-none max-xl:h-[48px] sm:max-xl:h-[52px] xl:hidden"
      />
      <div
        className={`vk-notice absolute max-xl:inset-x-(--page-inset-x) top-[56px] z-10 flex items-center gap-[6px] rounded-[10px] bg-white py-[6px] pl-[6px] pr-[22px] shadow-[0_10px_30px_rgba(75,77,87,0.2)] sm:top-[72px] sm:gap-[8px] sm:py-[8px] sm:pl-[8px] sm:pr-[26px] xl:inset-x-auto xl:left-[100px] xl:max-w-[430px] ${
          exiting ? "vk-notice-exit" : "vk-notice-enter"
        }`}
        onAnimationEnd={onAnimEnd}
      >
        {/* Кликабельна вся плашка: ссылка-оверлей поверх карточки, крестик — выше по слою */}
        <a
          href={externalLinks.vk}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Дублируем информацию в других соцсетях, перейти во ВКонтакте"
          className="absolute inset-0 z-[1] rounded-[10px]"
        />
        <span aria-hidden className="flex shrink-0 items-center justify-center">
          <span className="flex size-[26px] items-center justify-center rounded-sm bg-[#2787f5] sm:size-[38px]">
            <svg aria-hidden viewBox="0 0 24 24" className="size-[16px] fill-white sm:size-[22px]">
              <path d="M12.79 18.51c-6.55 0-10.29-4.49-10.44-11.96h3.28c.11 5.48 2.53 7.8 4.44 8.28V6.55h3.09v4.73c1.89-.2 3.88-2.36 4.55-4.73h3.09c-.52 2.92-2.67 5.08-4.2 5.96 1.53.72 3.98 2.62 4.91 6h-3.4c-.73-2.27-2.55-4.03-4.95-4.27v4.27h-.37z" />
            </svg>
          </span>
        </span>
        {/* 9px mobile / 11px desktop — компактнее, обе строки по одной визуальной линии */}
        <p className="text-[9px] font-semibold leading-[1.4] text-ink sm:text-[11px] sm:leading-[1.45]">
          Дублируем информацию в других соцсетях
          <br />
          Если не работает Телеграм,{" "}
          <span className="text-accent underline underline-offset-2">переходите сюда</span>
        </p>
        <button
          type="button"
          aria-label="Закрыть уведомление"
          onClick={close}
          disabled={exiting}
          className="absolute right-0 top-0 z-[2] flex size-[44px] items-start justify-end pt-[8px] pr-[8px] pb-[4px] pl-[4px] rounded-full text-ink-muted transition hover:text-ink disabled:pointer-events-none"
        >
          <svg aria-hidden viewBox="0 0 12 12" className="size-[10px]">
            <path
              d="M1.5 1.5l9 9M10.5 1.5l-9 9"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </Typo>
  );
}
