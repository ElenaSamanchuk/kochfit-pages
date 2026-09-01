import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { externalLinks } from "@/content/links";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Служба заботы",
  description: "Служба заботы Kochfit, помощь участницам курсов",
  path: "/care",
});

export default function CarePage() {
  return (
    <PageShell>
      <article className="rounded-[24px] bg-white p-[15px] shadow-[var(--shadow-card)] lg:p-[40px]">
        <h1 className="font-display text-[32px] font-normal text-ink">Служба заботы</h1>
        <p className="mt-[16px] text-[16px] leading-[1.45] sm:leading-[1.6] text-ink-secondary">
          Если у вас возникли вопросы по курсам, доступу или оплате, напишите нам.
          Мы ответим в рабочие часы службы поддержки
        </p>
        <p className="mt-[16px]">
          <Link href="/suport" className="font-display font-bold text-accent underline">
            Перейти в службу поддержки
          </Link>
        </p>
        <p className="mt-[12px] text-[14px] text-ink-muted">
          Email:{" "}
          <a href={externalLinks.email} className="text-accent underline">
            info@kochfit.ru
          </a>
        </p>
      </article>
    </PageShell>
  );
}
