"use client";

import { useEffect } from "react";

/**
 * Глобальный движок горизонтальных лент (ничего не рендерит):
 *
 * 1. Drag-to-scroll мышью для всех `[data-drag-scroll]` — через делегирование
 *    на document, поэтому работает и после клиентской навигации Next.js.
 *    Тач-скролл работает нативно.
 * 2. Стрелки: кнопка с атрибутом `data-carousel-prev` / `data-carousel-next`
 *    (значение — CSS-селектор ленты; без значения — ближайший
 *    `[data-drag-scroll]` внутри родительской <section>) плавно листает
 *    ленту на ширину одной карточки.
 * 3. Marquee: лента с `[data-marquee]` — бесшовный цикл вперёд, если контента
 *    достаточно (period ≤ maxScroll); иначе ping-pong. Пауза при hover, drag
 *    и касании (touch/pen); возобновление через паузу после отпускания.
 *    Контент: карточки + копия в `[data-marquee-copy]` (+ доп. копии для широких экранов).
 *    Уважает prefers-reduced-motion: авто-движение отключается, drag остаётся.
 *    Скрытые ленты (display:none / нулевая ширина) не крутятся.
 */
export function DragScrollInit() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    /* ——— 1. Drag-to-scroll (делегирование) ——— */
    let dragEl: HTMLElement | null = null;
    let lastX = 0;
    let totalDx = 0;
    let suppressClickUntil = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-drag-scroll]");
      if (!el) return;
      dragEl = el;
      lastX = e.clientX;
      totalDx = 0;
      // Сразу отключаем scroll-smooth, иначе первые px drag «глотаются» браузером.
      // Класс is-dragging (pointer-events:none на ссылках), только после порога,
      // иначе click по карточке не доходит до <a>.
      el.style.scrollBehavior = "auto";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragEl) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      totalDx += dx;
      if (Math.abs(totalDx) > 4) dragEl.classList.add("is-dragging");
      dragEl.scrollLeft -= dx;
    };
    const endDrag = () => {
      if (!dragEl) return;
      if (Math.abs(totalDx) > 4) suppressClickUntil = performance.now() + 80;
      dragEl.classList.remove("is-dragging");
      dragEl.style.scrollBehavior = "";
      dragEl = null;
    };
    // Гасим клик после drag, чтобы ссылки/кнопки внутри ленты не срабатывали
    const onClickCapture = (e: MouseEvent) => {
      if (performance.now() < suppressClickUntil) {
        e.preventDefault();
        e.stopPropagation();
        suppressClickUntil = 0;
      }
    };
    // Нативный drag картинок/ссылок обрывает pointer-события — глушим его в лентах
    const onDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement).closest?.("[data-drag-scroll]")) e.preventDefault();
    };

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    document.addEventListener("click", onClickCapture, true);
    document.addEventListener("dragstart", onDragStart);

    // Вертикальное колёсико над лентой → горизонтальный скролл (как в нативных каруселях)
    const onWheel = (e: WheelEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-drag-scroll]");
      if (!el || el.scrollWidth <= el.clientWidth + 1) return;
      let delta = e.deltaX;
      if (Math.abs(delta) <= Math.abs(e.deltaY)) delta = e.deltaY;
      if (delta === 0) return;
      // Только если у ленты есть куда листать в направлении жеста
      const goingRight = delta > 0;
      if (goingRight && el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) return;
      if (!goingRight && el.scrollLeft <= 0) return;
      e.preventDefault();
      el.scrollLeft += delta;
    };
    document.addEventListener("wheel", onWheel, { passive: false });

    cleanups.push(() => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      document.removeEventListener("click", onClickCapture, true);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("wheel", onWheel);
    });

    /* ——— 2. Стрелки ——— */
    const cardStep = (scroller: HTMLElement): number => {
      const kids = scroller.children;
      if (kids.length >= 2) {
        const a = kids[0] as HTMLElement;
        const b = kids[1] as HTMLElement;
        const step = b.offsetLeft - a.offsetLeft;
        if (step > 0) return step;
      }
      return Math.round(scroller.clientWidth * 0.8);
    };

    const onArrowClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-carousel-prev],[data-carousel-next]",
      );
      if (!btn) return;
      const isNext = btn.hasAttribute("data-carousel-next");
      const sel =
        btn.getAttribute("data-carousel-next") || btn.getAttribute("data-carousel-prev");
      const scroller = sel
        ? document.querySelector<HTMLElement>(sel)
        : btn.closest("section")?.querySelector<HTMLElement>("[data-drag-scroll]");
      if (!scroller) return;
      scroller.scrollBy({ left: (isNext ? 1 : -1) * cardStep(scroller), behavior: "smooth" });
    };
    document.addEventListener("click", onArrowClick);
    cleanups.push(() => document.removeEventListener("click", onArrowClick));

    /* ——— 3. Marquee ——— */
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const attached = new WeakSet<HTMLElement>();

    const attachMarquee = (el: HTMLElement) => {
      if (attached.has(el)) return;
      attached.add(el);

      const speed = Number(el.getAttribute("data-marquee")) || 30; // px/сек
      let hovered = false;
      let touchPaused = false;
      let resumeTimer = 0;
      let direction = 1; // ping-pong: 1 = вперёд, -1 = назад
      let rafId = 0;
      let lastT = 0;

      const period = (): number => {
        const first = el.firstElementChild as HTMLElement | null;
        const copy = el.querySelector<HTMLElement>(":scope > [data-marquee-copy]");
        if (!first || !copy) return 0;
        return copy.offsetLeft - first.offsetLeft;
      };

      const maxScroll = (): number => Math.max(0, el.scrollWidth - el.clientWidth);

      const onEnter = () => (hovered = true);
      const onLeave = () => (hovered = false);
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);

      const isFinePointer = (e: PointerEvent) => e.pointerType === "mouse";
      const onPointerDown = (e: PointerEvent) => {
        if (isFinePointer(e)) return;
        touchPaused = true;
        window.clearTimeout(resumeTimer);
      };
      const onPointerRelease = (e: PointerEvent) => {
        if (isFinePointer(e) || !touchPaused) return;
        window.clearTimeout(resumeTimer);
        resumeTimer = window.setTimeout(() => {
          touchPaused = false;
        }, 2000);
      };
      el.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointerup", onPointerRelease);
      window.addEventListener("pointercancel", onPointerRelease);

      const tick = (t: number) => {
        const dt = Math.min(t - lastT, 100);
        lastT = t;
        if (el.clientWidth === 0) {
          rafId = requestAnimationFrame(tick);
          return;
        }
        const p = period();
        const buffer = 2;
        const max = maxScroll();
        const canSeamlessLoop = p > 0 && max >= p - buffer;

        if (p > 0) {
          const autorun =
            !hovered && !touchPaused && dragEl !== el && !reducedMotion.matches;
          if (autorun) {
            el.scrollLeft += (canSeamlessLoop ? 1 : direction) * (speed * dt) / 1000;
          }

          if (canSeamlessLoop) {
            // Бесшовный цикл: нормализация в обе стороны (и при drag).
            if (el.scrollLeft >= p + buffer) el.scrollLeft -= p;
            else if (el.scrollLeft < buffer) el.scrollLeft += p;
          } else {
            // Fallback: ping-pong — вперёд до конца, назад до начала.
            if (el.scrollLeft >= max - buffer) {
              direction = -1;
              el.scrollLeft = Math.min(el.scrollLeft, max - buffer);
            } else if (el.scrollLeft <= buffer) {
              direction = 1;
              el.scrollLeft = Math.max(el.scrollLeft, buffer);
            }
          }
        }
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame((t) => {
        lastT = t;
        rafId = requestAnimationFrame(tick);
      });

      cleanups.push(() => {
        cancelAnimationFrame(rafId);
        window.clearTimeout(resumeTimer);
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        el.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointerup", onPointerRelease);
        window.removeEventListener("pointercancel", onPointerRelease);
      });
    };

    const scanMarquees = () => {
      document.querySelectorAll<HTMLElement>("[data-marquee]").forEach(attachMarquee);
    };
    scanMarquees();
    // Ленты, появившиеся после клиентской навигации
    const observer = new MutationObserver(scanMarquees);
    observer.observe(document.body, { childList: true, subtree: true });
    cleanups.push(() => observer.disconnect());

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
