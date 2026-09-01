import { PageShell } from "@/components/site/PageShell";
import { externalLinks } from "@/content/links";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Оплата прошла успешно",
  description: "Спасибо за покупку курса Kochfit! Войдите в личный кабинет и начинайте тренироваться",
  path: "/yes",
  noIndex: true,
  follow: false,
});

/** Результат оплаты: успех (Тильда page29988509, /yes) */
export default function PaymentSuccessPage() {
  return (
    <PageShell>
      <article className="rounded-[24px] bg-white p-[15px] text-center shadow-[var(--shadow-card)] lg:p-[48px]">
        <h1 className="font-display text-[28px] font-normal leading-[1.2] text-ink lg:text-[36px]">
          Оплата прошла успешно
        </h1>
        <p className="mt-[16px] text-[16px] leading-[1.45] sm:leading-[1.6] text-ink-secondary">
          Спасибо за покупку курса! Войдите в личный кабинет и начинайте тренироваться
        </p>
        <p className="mt-[8px] text-[14px] leading-[1.45] sm:leading-[1.6] text-ink-muted">
          Если возникнут сложности, задайте вопрос в{" "}
          <a
            href={externalLinks.telegramBot}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2"
          >
            чат-бот
          </a>
          , и мы поможем. Вы в любое время можете отказаться от участия в курсе в личном кабинете Kochfit
        </p>
        <a
          href={externalLinks.login}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-[28px] inline-flex min-h-[48px] items-center justify-center rounded-[12px] px-[40px] py-[14px] font-display text-[15px] font-bold text-white transition hover:opacity-90"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          Войти в личный кабинет
        </a>
      </article>
    </PageShell>
  );
}
