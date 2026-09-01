import { PageShell } from "@/components/site/PageShell";
import { AppLink } from "@/components/ui/AppLink";
import { externalLinks } from "@/content/links";
import { routes } from "@/content/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Быстрая навигация",
  description: "Быстрые ссылки Kochfit: курсы, блог, результаты и личный кабинет",
  path: "/taplink",
});

const links = [
  { href: routes.home, label: "Главная" },
  { href: routes.beautyHealth, label: "Красота и здоровье" },
  { href: routes.pelvicFloor, label: "МТД и дыхание" },
  { href: routes.postpartum, label: "После родов" },
  { href: routes.activePregnancy, label: "Активная беременность" },
  { href: routes.journal, label: "Блог" },
  { href: routes.result, label: "Результаты" },
  { href: routes.person, label: "О тренере" },
  { href: externalLinks.login, label: "Личный кабинет", external: true },
  { href: externalLinks.telegramBot, label: "Предзапись в Telegram", external: true },
];

export default function TaplinkPage() {
  return (
    <PageShell>
      <h1 className="font-display text-[32px] font-normal text-ink">Kochfit</h1>
      <p className="mt-[8px] text-[15px] text-ink-secondary">Быстрая навигация</p>
      <div className="mt-[28px] space-y-[10px]">
        {links.map((l) => {
          const isExternal = "external" in l && l.external;
          const className = isExternal
            ? "btn-primary block rounded-[14px] px-[20px] py-[16px] text-center text-[15px] shadow-[var(--shadow-card)] transition hover:brightness-105"
            : "block rounded-[14px] bg-white px-[20px] py-[16px] text-center font-display text-[15px] font-bold text-ink shadow-[var(--shadow-card)]";
          return (
            <AppLink key={l.label} href={l.href} className={className}>
              {l.label}
            </AppLink>
          );
        })}
      </div>
    </PageShell>
  );
}
