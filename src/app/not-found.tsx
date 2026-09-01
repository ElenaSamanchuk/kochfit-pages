import type { Metadata } from "next";
import Link from "next/link";
import { SimpleHeader } from "@/components/site/SimpleHeader";
import { simpleHeaderSpacerClass } from "@/components/site/site-header";
import { routes } from "@/content/routes";

export const metadata: Metadata = {
  title: "Страница не найдена",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SimpleHeader />
      <div aria-hidden className={simpleHeaderSpacerClass} />
      <main className="mx-auto flex min-h-[50vh] w-full max-w-[720px] flex-col items-start justify-center px-[20px] py-[80px]">
        <p className="font-display text-[14px] font-bold uppercase tracking-[0.06em] text-accent">
          404
        </p>
        <h1 className="mt-[12px] font-display text-[36px] font-normal text-ink">
          Страница не найдена
        </h1>
        <p className="mt-[12px] text-[16px] text-ink-secondary">
          Возможно, ссылка устарела или страница ещё в переносе с Тильды
        </p>
        <Link
          href={routes.home}
          className="mt-[28px] rounded-[12px] px-[24px] py-[12px] font-display text-[13px] font-bold text-white"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          На главную
        </Link>
      </main>
    </>
  );
}
