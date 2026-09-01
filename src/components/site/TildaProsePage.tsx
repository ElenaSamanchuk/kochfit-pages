import Link from "next/link";
import { ArticleBody } from "@/components/site/ArticleBody";
import { LessonVideos } from "@/components/site/LessonVideos";
import { PageShell } from "@/components/site/PageShell";
import { typo } from "@/lib/typography";
import { externalLinks } from "@/content/links";
import type { ProseDoc } from "@/content/tilda-dynamic";

export function TildaProsePage({ doc }: { doc: ProseDoc }) {
  // Статьи блога (/st1…/st14) возвращают в журнал, остальные prose-страницы — на главную
  const isJournalArticle = /^st\d+$/.test(doc.slug);
  return (
    <PageShell article>
      {doc.stub && !doc.lesson && (
        <div className="mb-[20px] rounded-[16px] border border-accent/30 bg-surface-blue px-[20px] py-[14px] text-[14px] text-ink-secondary">
          Страница сохранена для SEO и закладок. Актуальный контент может быть в{" "}
          <a
            href={externalLinks.login}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent underline"
          >
            личном кабинете
          </a>
        </div>
      )}
      {doc.lesson && (
        <div
          className="mb-[20px] rounded-[16px] px-[20px] py-[16px] text-[14px] leading-[1.5] text-white"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          Это материал курса Kochfit. Полный доступ к видео и программе, в{" "}
          <a
            href={externalLinks.login}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline underline-offset-2"
          >
            личном кабинете
          </a>
        </div>
      )}
      <article className="min-w-0 rounded-[24px] bg-white p-[15px] shadow-[var(--shadow-card)] sm:p-[28px] lg:p-[48px]">
        <Link
          href={isJournalArticle ? "/journal" : "/"}
          className="text-[13px] font-semibold text-accent transition hover:opacity-80"
        >
          {isJournalArticle ? "← Ко всем статьям" : "← На главную"}
        </Link>
        <h1 className="mt-[16px] font-display text-[28px] font-normal leading-[1.2] text-ink lg:text-[36px]">
          {typo(doc.title)}
        </h1>
        {doc.videos && <LessonVideos videos={doc.videos} />}
        {doc.blocks && <ArticleBody blocks={doc.blocks} />}
        <div className="mt-[28px] space-y-[14px] text-[15px] leading-[1.5] sm:leading-[1.65] text-ink-secondary">
          {doc.paragraphs.map((p, i) => {
            const isHeading =
              /^(\d+\.|[IVX]+\.|Пользовательское|Политика|Согласие|Партнер|Урок|День|Неделя)/i.test(
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
