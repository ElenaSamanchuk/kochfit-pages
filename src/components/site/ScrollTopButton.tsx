"use client";

import { useEffect, useState } from "react";

/**
 * Стрелка «наверх» — появляется после прокрутки страницы (как на старом сайте).
 * Стоит над чат-виджетом в правом нижнем углу.
 */
export function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setVisible(window.scrollY > 600));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Наверх"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-[92px] right-[20px] z-30 flex size-[44px] items-center justify-center rounded-full bg-white text-accent shadow-[0_8px_24px_rgba(75,77,87,0.25)] transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_28px_rgba(75,77,87,0.35)] active:scale-95 sm:bottom-[100px] sm:right-[24px] ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg aria-hidden viewBox="0 0 16 16" className="size-[16px]">
        <path
          d="M8 13V3M8 3L3.5 7.5M8 3l4.5 4.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
