import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { ResultCards } from "@/components/site/ResultCards";
import { routes } from "@/content/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Результаты участниц",
  description:
    "13 реальных историй участниц онлайн-курсов Kochfit с фото «до/после»: здоровье, осанка, восстановление после родов",
  path: "/result",
  ogTitle: "Результаты участниц Kochfit",
});

export default function ResultPage() {
  return (
    <PageShell>
      <header className="max-w-[720px]">
        <h1 className="font-display text-[36px] font-normal leading-[1.15] text-ink">
          Результаты участниц проекта Kochfit
        </h1>
        <p className="mt-[12px] text-[16px] leading-[1.5] text-ink-secondary">
          Реальные истории изменений с фото «до/после»: здоровье, осанка,
          дыхание и отношение к своему телу
        </p>
      </header>

      <ResultCards />

      <div className="mt-[36px] flex flex-wrap gap-[12px]">
        <Link
          href={routes.beautyHealth}
          className="rounded-[12px] px-[22px] py-[12px] font-display text-[13px] font-bold text-white"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          Курс «Красота и здоровье»
        </Link>
        <Link
          href={routes.postpartum}
          className="rounded-[12px] border border-accent px-[22px] py-[12px] font-display text-[13px] font-bold text-accent"
        >
          Восстановление после родов
        </Link>
      </div>
    </PageShell>
  );
}
