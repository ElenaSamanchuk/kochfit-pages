"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { externalLinks } from "@/content/links";
import { Typo } from "@/components/ui/TypoText";

const STORAGE_KEY = "cookieConsent";

/** Баннер cookies — как на старом сайте Тильды, в голубой схеме */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "accepted") return;
    const t = window.setTimeout(() => setVisible(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  if (!visible) return null;

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    localStorage.setItem("cookieConsentDate", new Date().toISOString());
    setVisible(false);
  }

  return (
    <Typo>
    <div
      role="dialog"
      aria-label="Согласие на cookies"
      className="cookie-banner animate-fade-in fixed bottom-[16px] left-[16px] z-[90] max-w-[min(320px,calc(100vw-32px))] rounded-[12px] border border-white/20 bg-[rgba(75,77,87,0.92)] p-[14px] text-white shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-[20px] lg:bottom-[24px] lg:left-[24px]"
    >
      <p className="text-[12px] leading-[1.45] text-white/90">
        Наш сайт использует куки. Продолжая им пользоваться, вы соглашаетесь на
        обработку персональных данных в соответствии с{" "}
        <Link
          href={externalLinks.legal.dataConsent}
          className="font-semibold text-accent underline-offset-2 hover:underline"
        >
          политикой
        </Link>
      </p>
      <button
        type="button"
        onClick={accept}
        className="btn-primary mt-[12px] min-h-[44px] rounded-[8px] px-[20px] py-[10px] text-[12px] transition hover:scale-[1.02] active:scale-[0.98]"
      >
        Согласен
      </button>
    </div>
    </Typo>
  );
}
