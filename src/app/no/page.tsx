import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { externalLinks } from "@/content/links";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Ошибка оплаты",
  description: "Оплата не прошла. Попробуйте ещё раз или напишите в поддержку Kochfit",
  path: "/no",
  noIndex: true,
  follow: false,
});

/** Результат оплаты: ошибка (Тильда page29989191, /no) */
export default function PaymentErrorPage() {
  return (
    <PageShell>
      <article className="rounded-[24px] bg-white p-[15px] text-center shadow-[var(--shadow-card)] lg:p-[48px]">
        <h1 className="font-display text-[28px] font-normal leading-[1.2] text-ink lg:text-[36px]">
          Ой, что-то не получилось…
        </h1>
        <p className="mt-[16px] text-[16px] leading-[1.45] sm:leading-[1.6] text-ink-secondary">
          Оплата не прошла. Попробуйте ещё раз, а если ошибка повторится, напишите нам, и мы поможем
        </p>
        <div className="mt-[28px] flex flex-col items-center justify-center gap-[12px] sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-[48px] items-center justify-center rounded-[12px] px-[40px] py-[14px] font-display text-[15px] font-bold text-white transition hover:opacity-90"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            Попробовать ещё раз
          </Link>
          <Link
            href={externalLinks.support}
            className="inline-flex min-h-[48px] items-center justify-center rounded-[12px] border border-accent/40 px-[40px] py-[14px] font-display text-[15px] font-bold text-accent transition hover:bg-surface-blue"
          >
            Написать в поддержку
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
