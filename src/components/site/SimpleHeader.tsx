import { ActiveNavLink } from "@/components/site/ActiveNavLink";
import { SiteMenu } from "@/components/site/SiteMenu";
import {
  simpleHeaderBarClass,
  siteHeaderZ,
} from "@/components/site/site-header";
import { routes } from "@/content/routes";
import { AccountIconLink } from "@/components/ui/AccountIconLink";

/**
 * Светлая шапка для prose / marketing страниц без hero-медиа.
 * Состав меню — как на главной (HeroHeader): тот же набор ссылок
 * и круглая кнопка личного кабинета вместо широкой (не режется на мобиле).
 */
export function SimpleHeader() {
  return (
    <header
      className={`fixed inset-x-0 top-0 ${siteHeaderZ} border-b border-line bg-bg/90 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md`}
    >
      <div
        className={`mx-auto flex ${simpleHeaderBarClass} w-full max-w-[1400px] items-center justify-between px-(--page-inset-x) lg:px-[40px]`}
      >
        <SiteMenu variant="light" />
        <div className="flex items-center gap-1.5 sm:gap-[8px]">
          <nav className="hidden items-center gap-[16px] text-small font-semibold text-ink-secondary xl:flex">
            <ActiveNavLink href={routes.home} variant="light">
              Главная
            </ActiveNavLink>
            <ActiveNavLink href={routes.journal} variant="light">
              Полезный блог
            </ActiveNavLink>
            <ActiveNavLink href={routes.result} variant="light">
              Результаты участниц
            </ActiveNavLink>
            <ActiveNavLink href={routes.equipment} variant="light">
              Оборудование
            </ActiveNavLink>
            <ActiveNavLink href="/info_referral" variant="light">
              Реферальная программа
            </ActiveNavLink>
          </nav>
          <AccountIconLink />
        </div>
      </div>
    </header>
  );
}
