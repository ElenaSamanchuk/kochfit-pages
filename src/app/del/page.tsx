import { MailtoCta } from "@/components/site/MailtoCta";
import { PageShell } from "@/components/site/PageShell";
import { deleteAccountContent } from "@/content/public-pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: deleteAccountContent.title,
  description: deleteAccountContent.description,
  path: "/del",
  noIndex: true,
  follow: false,
});

export default function DeleteAccountPage() {
  const c = deleteAccountContent;
  return (
    <PageShell>
      <section className="rounded-[24px] bg-white p-[28px] shadow-[var(--shadow-card)] lg:p-[40px]">
        <h1 className="font-display text-[32px] font-normal text-ink">{c.title}</h1>
        <p className="mt-[12px] text-[15px] leading-[1.45] sm:leading-[1.55] text-ink-secondary">
          {c.note}
        </p>
        <MailtoCta
          subject="Удаление аккаунта Kochfit"
          label="Отправить заявку на удаление"
          note="Заявку можно отправить письмом на"
        />
      </section>
    </PageShell>
  );
}
