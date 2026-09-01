import { PageShell } from "@/components/site/PageShell";
import { JournalGrid } from "@/components/site/JournalGrid";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Полезный блог",
  description: "Полезный блог Kochfit: питание, тренировки, ЗОЖ",
  path: "/journal",
  ogTitle: "Полезный блог Kochfit",
});

export default function JournalPage() {
  return (
    <PageShell>
      <header className="max-w-[720px]">
        <h1 className="font-display text-[36px] font-normal leading-[1.15] text-ink">
          Полезный блог Kochfit
        </h1>
        <p className="mt-[12px] text-[16px] leading-[1.5] text-ink-secondary">
          Статьи про питание, тренировки и здоровый образ жизни от команды
          Kochfit
        </p>
      </header>
      <JournalGrid />
    </PageShell>
  );
}
