"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { readCssMs } from "@/components/motion/tokens";

const REVEAL_SEL =
  "[data-reveal], main > section, main section[data-figma-node], main article";

const HERO_SEL = "[data-reveal-hero], .hero-motion";

/**
 * Глобальная плавность: появление hero при загрузке/навигации + секций при скролле.
 * Не трогает DOM виджета nn99.
 */
export function MotionRoot() {
  const pathname = usePathname();
  const revealPassRef = useRef<() => void>(() => {});

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isWidget = (el: Element) =>
      !!el.closest(
        '[data-widget-id], [class*="nn99"], [id*="nn99"], iframe[src*="nn99"]',
      );

    const isHero = (el: HTMLElement) =>
      el.hasAttribute("data-reveal-hero") ||
      el.classList.contains("hero-motion") ||
      !!el.closest(HERO_SEL);

    /** Не дублировать reveal внутри уже обёрнутого блока */
    const isNestedReveal = (el: HTMLElement) => {
      const parent = el.parentElement?.closest("[data-reveal]");
      return !!parent && parent !== el;
    };

    const collect = () =>
      Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SEL)).filter(
        (el) => !isHero(el) && !isNestedReveal(el) && !isWidget(el),
      );

    const heroes = () =>
      Array.from(document.querySelectorAll<HTMLElement>(HERO_SEL)).filter(
        (el) => !isWidget(el),
      );

    const revealAllImmediate = () => {
      document
        .querySelectorAll<HTMLElement>(
          "[data-reveal], [data-reveal-hero], .hero-motion, main section, main article",
        )
        .forEach((el) => {
          if (!isWidget(el)) el.classList.add("is-revealed");
        });
      document.documentElement.classList.add("motion-ready");
    };

    if (reduce) {
      revealAllImmediate();
      revealPassRef.current = revealAllImmediate;
      return;
    }

    const observed = new WeakSet<Element>();

    const prep = (el: HTMLElement) => {
      const raw = el.getAttribute("data-reveal") || el.dataset.reveal || "up";
      el.setAttribute("data-reveal", raw === "fade" ? "fade" : "up");
      el.classList.add("reveal-ready");
    };

    const staggerMs = readCssMs("--reveal-stagger", 70);
    const staggerInitialMs = readCssMs("--reveal-stagger-initial", 80);

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement);

        visible
          .sort(
            (a, b) =>
              a.getBoundingClientRect().top - b.getBoundingClientRect().top,
          )
          .forEach((el, i) => {
            el.style.setProperty(
              "--reveal-delay",
              `${Math.min(i, 5) * staggerMs}ms`,
            );
            el.classList.add("is-revealed");
            io.unobserve(el);
          });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.1 },
    );

    const observeRest = () => {
      collect().forEach((el) => {
        prep(el);
        if (el.classList.contains("is-revealed") || observed.has(el)) return;
        observed.add(el);
        io.observe(el);
      });
    };

    const revealInViewport = () => {
      let stagger = 0;
      collect()
        .sort(
          (a, b) =>
            a.getBoundingClientRect().top - b.getBoundingClientRect().top,
        )
        .forEach((el) => {
          if (el.classList.contains("is-revealed")) return;
          const top = el.getBoundingClientRect().top;
          if (top < window.innerHeight * 0.92 && top > -48) {
            el.style.setProperty(
              "--reveal-delay",
              `${staggerInitialMs + stagger * staggerMs}ms`,
            );
            stagger += 1;
            el.classList.add("is-revealed");
          }
        });
    };

    const revealHeroes = () => {
      heroes().forEach((el) => el.classList.add("is-revealed"));
    };

    const markLift = () => {
      document
        .querySelectorAll<HTMLElement>(
          'main [class*="shadow-"], main [class*="rounded-[20px]"], main [class*="rounded-[24px]"]',
        )
        .forEach((el) => {
          if (
            isHero(el) ||
            isWidget(el) ||
            el.classList.contains("motion-lift")
          ) {
            return;
          }
          // Подъём при наведении — только если сам блок кликабельный.
          // Карточка, внутри которой лежит кнопка, не поднимается: эффект должен быть на кнопке.
          if (!el.matches("a, button")) return;
          el.classList.add("motion-lift");
        });
    };

    let raf1 = 0;
    let raf2 = 0;

    const revealPass = () => {
      collect().forEach(prep);
      document.documentElement.classList.add("motion-ready");

      // Hero сразу в следующем кадре — не ждём MutationObserver
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          revealHeroes();
          revealInViewport();
          observeRest();
          markLift();
        });
      });
    };

    revealPassRef.current = revealPass;
    revealPass();

    const mo = new MutationObserver((mutations) => {
      if (
        mutations.every(
          (m) => m.target instanceof Element && isWidget(m.target),
        )
      ) {
        return;
      }
      // Soft-nav / streaming: новые hero и first-viewport тоже нужно открыть
      revealHeroes();
      revealInViewport();
      observeRest();
      markLift();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      io.disconnect();
      mo.disconnect();
      revealPassRef.current = () => {};
    };
  }, []);

  // App Router soft navigation: html.motion-ready уже стоит,
  // новые узлы стартуют с opacity:0 — нужно заново reveal.
  useEffect(() => {
    revealPassRef.current();
    // DOM страницы иногда монтируется после обновления pathname
    const t = window.setTimeout(() => revealPassRef.current(), 0);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return null;
}
