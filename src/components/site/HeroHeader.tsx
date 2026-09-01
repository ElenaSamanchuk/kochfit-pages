"use client";

import { useLayoutEffect, useRef } from "react";
import { routes } from "@/content/routes";
import { ActiveNavLink } from "@/components/site/ActiveNavLink";
import {
  heroHeaderLiftScrollPx,
  heroHeaderTop,
} from "@/components/site/hero-layout";
import { SiteMenu } from "@/components/site/SiteMenu";
import { siteHeaderZ } from "@/components/site/site-header";
import { AccountIconLink } from "@/components/ui/AccountIconLink";

function progressFromScrollY(scrollY: number): number {
  return Math.min(Math.max(scrollY / heroHeaderLiftScrollPx, 0), 1);
}

function applyHeroHeaderLift(el: HTMLElement, scrollY: number): void {
  el.style.setProperty(
    "--hero-header-progress",
    String(progressFromScrollY(scrollY)),
  );
}

/**
 * Шапка hero-лендингов: fixed поверх контента, glass-пилюли как в Figma.
 * Должна быть sibling'ом `<main>` (не внутри overflow-x-clip / hero transform):
 * иначе first paint и hydrated position расходятся и меню прыгает.
 * На старте — rest внутри hero; при скролле visual top едет rest→docked
 * за ~120px scrollY. Travel/inset — per-breakpoint в CSS.
 */
export function HeroHeader({ mobileLightTop = false }: { mobileLightTop?: boolean }) {
  const headerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    let raf = 0;
    let liveScroll = false;
    let scrollEndTimer = 0;
    const readScrollY = () =>
      window.scrollY || document.documentElement.scrollTop || 0;

    const update = (fromUserScroll: boolean) => {
      raf = 0;
      if (fromUserScroll) {
        if (!liveScroll) {
          liveScroll = true;
          el.classList.add("is-scrolling");
        }
        window.clearTimeout(scrollEndTimer);
        scrollEndTimer = window.setTimeout(() => {
          liveScroll = false;
          el.classList.remove("is-scrolling");
        }, 140);
      }
      applyHeroHeaderLift(el, readScrollY());
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => update(true));
    };

    // First apply keeps CSS transition so restored scrollY eases into place.
    update(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(scrollEndTimer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`pointer-events-none fixed inset-x-0 ${siteHeaderZ} ${heroHeaderTop}`}
    >
      <div className="hero-header-bar pointer-events-auto mx-auto flex w-full max-w-[1400px] items-center justify-between">
        <SiteMenu variant="hero" mobileLight={mobileLightTop} />
        <div className="flex items-center gap-1.5 sm:gap-[8px]">
          <nav className="header-glass-pill header-glass-pill--nav hidden h-[39px] items-center gap-[16px] rounded-full px-[20px] text-small font-semibold leading-none text-white xl:flex">
            <ActiveNavLink href={routes.home} variant="hero">
              Главная
            </ActiveNavLink>
            <ActiveNavLink href={routes.journal} variant="hero">
              Полезный блог
            </ActiveNavLink>
            <ActiveNavLink href={routes.result} variant="hero">
              Результаты участниц
            </ActiveNavLink>
            <ActiveNavLink href={routes.equipment} variant="hero">
              Оборудование
            </ActiveNavLink>
            <ActiveNavLink href="/info_referral" variant="hero">
              Реферальная программа
            </ActiveNavLink>
          </nav>
          <AccountIconLink />
        </div>
      </div>
    </header>
  );
}
