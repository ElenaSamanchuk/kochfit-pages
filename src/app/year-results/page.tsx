import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { yearResultsContent } from "@/content/public-pages";
import { routes } from "@/content/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: yearResultsContent.title,
  description: yearResultsContent.description,
  path: "/year-results",
});

export default function YearResultsPage() {
  const c = yearResultsContent;
  return (
    <PageShell>
      <section
        className="rounded-[24px] px-[28px] py-[48px] text-white lg:px-[48px]"
        style={{ backgroundImage: "var(--gradient-primary)" }}
      >
        <p className="text-[13px] font-semibold uppercase tracking-[0.04em] opacity-80">
          2025
        </p>
        <h1 className="mt-[12px] max-w-[760px] font-display text-[32px] font-normal leading-[1.15] lg:text-[44px]">
          {c.headline}
        </h1>
        <p className="mt-[16px] max-w-[560px] text-[16px] leading-[1.5] text-white/90">
          Все это мы сделали вместе. Каждое участие, вопрос и отзыв стали частью
          изменений
        </p>
      </section>

      <section className="mt-[28px] grid gap-[12px] sm:grid-cols-2">
        {c.highlights.map((h) => (
          <div
            key={h}
            className="rounded-[20px] bg-white p-[22px] text-[15px] leading-[1.5] text-ink-secondary shadow-[var(--shadow-card)]"
          >
            <span className="mb-[10px] block size-[8px] rounded-full bg-accent" />
            {h}
          </div>
        ))}
      </section>

      <Link
        href={routes.home}
        className="mt-[32px] inline-flex rounded-[12px] px-[24px] py-[12px] font-display text-[13px] font-bold text-white"
        style={{ backgroundImage: "var(--gradient-primary)" }}
      >
        На главную
      </Link>
    </PageShell>
  );
}
