import type { ReactNode } from "react";
import { SimpleHeader } from "@/components/site/SimpleHeader";
import { simpleHeaderSpacerClass } from "@/components/site/site-header";

export function PageShell({
  children,
  /** Узкая колонка только для страниц оплаты (карточка по центру) */
  narrow = false,
  compactBottom = false,
  /** Desktop: padding снаружи колонки 1160 (сетка 3×376 на /equipment) */
  content1160 = false,
}: {
  children: ReactNode;
  narrow?: boolean;
  /** Prose-страницы (статьи, юр. документы) — та же ширина, что у default */
  article?: boolean;
  /** Меньше отступа перед Footer (короткие страницы вроде /equipment) */
  compactBottom?: boolean;
  content1160?: boolean;
}) {
  // 1240 = 1160 контент + 40+40 pad — иначе pad съедает ширину и карточки ≠ 376
  const maxWidth = narrow
    ? "max-w-[820px]"
    : content1160
      ? "max-w-[1240px]"
      : "max-w-[1160px]";
  const horizontalPad = "px-(--page-inset-x) lg:px-[40px]";

  return (
    <>
      <SimpleHeader />
      <div aria-hidden className={simpleHeaderSpacerClass} />
      <main
        data-reveal="up"
        className={`mx-auto w-full min-w-0 overflow-x-clip ${horizontalPad} ${
          compactBottom
            ? "pt-[40px] pb-[16px] lg:pt-[60px] lg:pb-[24px]"
            : "py-[40px] lg:py-[60px]"
        } ${maxWidth}`}
      >
        {children}
      </main>
    </>
  );
}
