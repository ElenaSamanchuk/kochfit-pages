import { MailtoCta } from "@/components/site/MailtoCta";
import { PageShell } from "@/components/site/PageShell";
import { supportContent } from "@/content/public-pages";
import { externalLinks } from "@/content/links";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: supportContent.title,
  description: supportContent.description,
  path: "/suport",
});

export default function SupportPage() {
  const c = supportContent;
  return (
    <PageShell>
      <section className="rounded-[24px] bg-white p-[28px] shadow-[var(--shadow-card)] lg:p-[40px]">
        <h1 className="font-display text-[32px] font-normal text-ink">{c.title}</h1>
        <p className="mt-[12px] text-[16px] leading-[1.5] text-ink-secondary">
          {c.intro}
        </p>
        <p className="mt-[12px] text-[15px] leading-[1.45] sm:leading-[1.55] text-ink-secondary">
          {c.details}
        </p>
        <p className="mt-[12px] font-display text-[15px] font-bold text-accent">
          {c.hours}
        </p>
        <p className="mt-[8px] text-[14px] text-ink-muted">{c.note}</p>
        <p className="mt-[16px] text-[14px]">
          Или напишите сразу:{" "}
          <a className="text-accent underline" href={externalLinks.email}>
            info@kochfit.ru
          </a>
        </p>
        <MailtoCta
          subject="Обращение в службу заботы Kochfit"
          label="Написать в службу заботы"
        />
      </section>
    </PageShell>
  );
}
