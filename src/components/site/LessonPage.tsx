import Link from "next/link";
import { ArticleBody } from "@/components/site/ArticleBody";
import { PageShell } from "@/components/site/PageShell";
import { externalLinks } from "@/content/links";
import type { ProseDoc } from "@/content/tilda-dynamic";

/**
 * Страница урока курса — голубая схема, контент из Тильды (текст + Kinescope + фото).
 * Figma-референс: prose-статья + lesson banner.
 */
export function LessonPage({ doc }: { doc: ProseDoc }) {
  return (
    <PageShell article>
      <div
        className="mb-[20px] rounded-[16px] px-[20px] py-[16px] text-[14px] leading-[1.5] text-white sm:px-[24px] sm:py-[18px]"
        style={{ backgroundImage: "var(--gradient-primary)" }}
      >
        <span className="mb-[6px] inline-flex items-center justify-center rounded-[7px] bg-white/20 px-[10px] py-[4px] text-center text-[11px] font-semibold uppercase leading-none tracking-wide">
          Материал курса
        </span>
        <p>
          Полный доступ к программе и остальным урокам, в{" "}
          <a
            href={externalLinks.login}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline underline-offset-2"
          >
            личном кабинете
          </a>
          .
        </p>
      </div>

      <article
        data-figma-node="lesson-stlk"
        className="min-w-0 rounded-[24px] bg-white p-[20px] shadow-[var(--shadow-card)] sm:p-[28px] lg:p-[48px]"
      >
        <Link
          href="/"
          className="text-[13px] font-semibold text-accent transition hover:opacity-80"
        >
          ← На главную
        </Link>
        <h1 className="mt-[16px] font-display text-[28px] font-normal leading-[1.2] text-ink lg:text-[36px]">
          {doc.title}
        </h1>
        {doc.blocks && doc.blocks.length > 0 && <ArticleBody blocks={doc.blocks} />}
      </article>
    </PageShell>
  );
}
