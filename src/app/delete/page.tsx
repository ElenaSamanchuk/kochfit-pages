import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { externalLinks } from "@/content/links";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Удаление аккаунта",
  description: "Запрос на удаление аккаунта Kochfit",
  path: "/delete",
  noIndex: true,
  follow: false,
});

export default function DeleteAccountRequestPage() {
  return (
    <PageShell>
      <article className="rounded-[24px] bg-white p-[15px] shadow-[var(--shadow-card)] lg:p-[40px]">
        <h1 className="font-display text-[32px] font-normal text-ink">
          Удаление аккаунта
        </h1>
        <p className="mt-[16px] text-[16px] leading-[1.45] sm:leading-[1.6] text-ink-secondary">
          Чтобы удалить аккаунт и персональные данные, напишите на{" "}
          <a href={externalLinks.email} className="text-accent underline">
            info@kochfit.ru
          </a>{" "}
          с темой «Удаление аккаунта» и укажите email регистрации
        </p>
        <p className="mt-[12px] text-[14px] text-ink-muted">
          Также доступна страница{" "}
          <Link href={externalLinks.legal.deleteAccount} className="text-accent underline">
            /del
          </Link>{" "}
          с инструкцией.
        </p>
      </article>
    </PageShell>
  );
}
