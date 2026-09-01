import { PageShell } from "@/components/site/PageShell";
import { AppLink } from "@/components/ui/AppLink";
import { saleTariffs } from "@/content/payments";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Скидки и тарифы",
  description: "Актуальные тарифы и оплата курсов Kochfit",
  path: "/sale",
});

export default function SalePage() {
  return (
    <PageShell>
      <header>
        <h1 className="font-display text-[36px] font-normal text-ink">Скидки</h1>
        <p className="mt-[12px] text-[16px] text-ink-secondary">
          Оплата тарифов на платформе v2.kochfit.ru
        </p>
      </header>
      <div className="mt-[28px] space-y-[12px]">
        {saleTariffs.map((t) => (
          <AppLink
            key={t.checkoutUrl}
            href={t.checkoutUrl}
            className="flex items-center justify-between rounded-[16px] bg-white px-[22px] py-[18px] shadow-[var(--shadow-card)] transition hover:bg-surface-blue"
          >
            <span className="font-display text-[16px] font-bold text-ink">
              {t.name}
            </span>
            <span className="font-display text-[13px] font-bold text-accent">
              Оплатить →
            </span>
          </AppLink>
        ))}
      </div>
    </PageShell>
  );
}
