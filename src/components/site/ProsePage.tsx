import { PageShell } from "@/components/site/PageShell";
import { typo } from "@/lib/typography";

export function ProsePage({
  title,
  paragraphs,
}: {
  title: string;
  paragraphs: readonly string[];
}) {
  return (
    <PageShell article>
      <article className="min-w-0 rounded-[24px] bg-white p-[15px] shadow-[var(--shadow-card)] sm:p-[28px] lg:p-[48px]">
        <h1 className="font-display text-[28px] font-normal leading-[1.2] text-ink lg:text-[36px]">
          {typo(title)}
        </h1>
        <div className="mt-[28px] space-y-[14px] text-[15px] leading-[1.5] sm:leading-[1.65] text-ink-secondary">
          {paragraphs.map((p, i) => {
            const isHeading =
              /^(\d+\.|[IVX]+\.|Пользовательское|Политика|Согласие|Партнер)/i.test(
                p,
              ) && p.length < 120;
            if (isHeading) {
              return (
                <h2
                  key={i}
                  className="pt-[12px] font-display text-[18px] font-normal text-ink"
                >
                  {typo(p)}
                </h2>
              );
            }
            return <p key={i}>{typo(p)}</p>;
          })}
        </div>
      </article>
    </PageShell>
  );
}
