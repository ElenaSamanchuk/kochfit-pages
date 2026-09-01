import { PageShell } from "@/components/site/PageShell";
import { AppLink } from "@/components/ui/AppLink";
import { externalLinks } from "@/content/links";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Отписаться от рассылки",
  description: "Отписка от email-рассылки Kochfit",
  path: "/unsubscribe",
  noIndex: true,
  follow: false,
});

export default function UnsubscribePage() {
  return (
    <PageShell>
      <article className="rounded-[24px] bg-white p-[15px] shadow-[var(--shadow-card)] lg:p-[40px]">
        <h1 className="font-display text-[32px] font-normal text-ink">
          Отписаться от рассылки
        </h1>
        <p className="mt-[16px] text-[16px] leading-[1.45] sm:leading-[1.6] text-ink-secondary">
          Чтобы отписаться от информационных писем Kochfit, отправьте запрос на{" "}
          <a href={externalLinks.email} className="text-accent underline">
            info@kochfit.ru
          </a>{" "}
          с темой «Отписка» и укажите email, на который приходят письма
        </p>
        <p className="mt-[12px] text-[14px] text-ink-muted">
          Обработка данных описана в{" "}
          <AppLink href={externalLinks.legal.consent} className="text-accent underline">
            согласии на рассылку
          </AppLink>
          .
        </p>
      </article>
    </PageShell>
  );
}
