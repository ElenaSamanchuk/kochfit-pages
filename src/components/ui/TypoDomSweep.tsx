"use client";

import { useEffect, useLayoutEffect } from "react";
import { applyTypoToDom } from "@/lib/typography";

function sweepTypo() {
  applyTypoToDom(document.body);
}

/**
 * Клиентский проход по DOM: закрывает пробелы, которые React-обёртка Typo
 * не достаёт (client components, dangerouslySetInnerHTML, динамические модалки).
 */
export function TypoDomSweep() {
  useLayoutEffect(() => {
    sweepTypo();
  }, []);

  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sweepTypo);
    };

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    const onNavigation = () => schedule();
    window.addEventListener("popstate", onNavigation);
    window.addEventListener("hashchange", onNavigation);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("popstate", onNavigation);
      window.removeEventListener("hashchange", onNavigation);
    };
  }, []);

  return null;
}
