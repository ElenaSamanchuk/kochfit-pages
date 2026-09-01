"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
} from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { isNavLinkActive } from "@/lib/nav-active";

const subscribeNoop = () => () => {};
import { menuLinks, menuLogin, menuSocials } from "@/content/nav";
import { routes } from "@/content/routes";
import { MenuIcon } from "@/components/ui/MenuIcon";
import { MenuSocialIcon, menuSocialIconAssets } from "@/components/ui/SocialIcons";
import { Typo } from "@/components/ui/TypoText";

type Variant = "hero" | "light";

/**
 * Бургер → левый drawer как на старом сайте (Tilda t450 #menuopen).
 * Оформление — голубая схема; открытие/закрытие — CSS transition (без remount keyframes).
 */
export function SiteMenu({
  variant = "hero",
  mobileLight = false,
}: {
  variant?: Variant;
  /** hero-шапка на светлом фоне (<xl): голубая пилюля + тёмный логотип; xl — glass как в макете */
  mobileLight?: boolean;
}) {
  const [open, setOpen] = useState(false);
  // Портал монтируем только на клиенте (после гидратации)
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const panelId = useId();
  const pathname = usePathname();
  const isHero = variant === "hero";
  const heroOnLightMobile = isHero && mobileLight;

  const closeMenu = useCallback(() => setOpen(false), []);
  const openMenu = useCallback(() => setOpen(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);

    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyPadding = document.body.style.paddingRight;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.classList.add("menu-open");
    if (scrollbar > 0) {
      document.body.style.paddingRight = `${scrollbar}px`;
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.documentElement.classList.remove("menu-open");
      document.body.style.paddingRight = prevBodyPadding;
    };
  }, [open, closeMenu]);

  return (
    <Typo>
    <>
      <div
        className={
          heroOnLightMobile
            ? "header-glass-pill relative flex h-[32px] items-center gap-1.5 rounded-[1000px] max-xl:border-0 max-xl:bg-surface-blue max-xl:shadow-none max-xl:backdrop-blur-none pl-0 pr-[8px] sm:h-[40px] sm:gap-[8px] sm:pr-[12px] xl:h-[39px] xl:pr-[14px]"
            : isHero
              ? "header-glass-pill relative flex h-[32px] items-center gap-1.5 rounded-[1000px] pl-0 pr-[8px] sm:h-[40px] sm:gap-[8px] sm:pr-[12px] xl:h-[39px] xl:pr-[14px]"
              : "relative flex h-[44px] items-center gap-2 rounded-[1000px] bg-surface-blue pl-0 pr-[12px] sm:gap-[8px] sm:pr-[14px]"
        }
      >
        <button
          type="button"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => (open ? closeMenu() : openMenu())}
          className={
            isHero
              ? "relative flex size-[30px] shrink-0 items-center justify-center rounded-[1000px] bg-white transition before:absolute before:-inset-[4px] before:content-[''] hover:scale-105 hover:opacity-90 active:scale-95 sm:ml-[2px] sm:size-[40px] sm:before:hidden xl:size-[34px] xl:min-h-0 xl:min-w-0"
              : "flex size-[44px] shrink-0 items-center justify-center rounded-[1000px] bg-white shadow-sm transition hover:scale-105 hover:opacity-90 active:scale-95 sm:ml-[2px]"
          }
        >
          <MenuIcon className="block h-[15px] w-[15px] sm:h-[19px] sm:w-[19px] xl:h-[21px] xl:w-[21px]" />
        </button>
        <Link
          href={routes.home}
          className={
            heroOnLightMobile
              ? "flex items-center font-display text-[13px] font-bold leading-none text-ink transition hover:text-accent sm:text-[14px] xl:text-white xl:hover:text-white xl:hover:opacity-80"
              : isHero
                ? "flex items-center font-display text-[13px] font-bold leading-none text-white transition hover:opacity-80 sm:text-[14px]"
                : "flex min-h-[44px] items-center font-display text-[13px] font-bold leading-none text-ink transition hover:text-accent sm:text-[14px]"
          }
          onClick={closeMenu}
        >
          KOCHFIT.
        </Link>
      </div>

      {/* Оверлей — порталом в body: backdrop-filter/transform у предков (например,
          backdrop-blur в SimpleHeader) создают containing block для fixed и
          обрезают drawer по высоте шапки. */}
      {mounted
        ? createPortal(
      <div
        className={`site-menu site-menu--light${open ? " is-open" : ""}`}
        aria-hidden={!open}
        inert={!open ? true : undefined}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label="Закрыть меню"
          className="site-menu-backdrop"
          onClick={closeMenu}
        />
        <aside
          id={panelId}
          role="dialog"
          aria-modal={open}
          aria-label="Меню"
          className="site-menu-drawer absolute left-0 top-0 flex h-full w-[min(260px,88vw)] flex-col shadow-[4px_0_24px_rgba(75,77,87,0.12)]"
        >
          <div className="flex items-center justify-between px-[20px] pt-[18px]">
            <Link
              href={routes.home}
              onClick={closeMenu}
              tabIndex={open ? 0 : -1}
              className="site-menu-drawer-logo font-display text-[18px] font-bold uppercase transition hover:opacity-80"
            >
              Kochfit.
            </Link>
            <button
              type="button"
              tabIndex={open ? 0 : -1}
              aria-label="Закрыть меню"
              onClick={closeMenu}
              className="site-menu-close relative flex size-[44px] items-center justify-center rounded-full transition hover:scale-105 active:scale-95"
            >
              <span className="site-menu-close-bar absolute block h-px w-[16px] rotate-45" />
              <span className="site-menu-close-bar absolute block h-px w-[16px] -rotate-45" />
            </button>
          </div>

          <nav className="mt-[28px] flex-1 overflow-y-auto px-[8px]">
            <ul className="site-menu-nav flex flex-col">
              {menuLinks.map((item, i) => {
                const active = isNavLinkActive(item.href, pathname);
                return (
                  <li
                    key={item.label}
                    style={{ transitionDelay: open ? `${100 + i * 28}ms` : "0ms" }}
                  >
                    <Link
                      href={item.href}
                      tabIndex={open ? 0 : -1}
                      className={`site-menu-link${active ? " is-active" : ""}`}
                      aria-current={active ? "page" : undefined}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="site-menu-footer mt-auto border-t border-line px-[20px] py-[20px]">
            <div className="flex items-center gap-[8px]">
              {menuSocials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  tabIndex={open ? 0 : -1}
                  className="site-menu-social"
                >
                  <span className="site-menu-social-badge">
                    <MenuSocialIcon asset={menuSocialIconAssets[s.label]} />
                  </span>
                </a>
              ))}
            </div>
            <a
              href={menuLogin.href}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={open ? 0 : -1}
              className="site-menu-login"
            >
              {menuLogin.label}
            </a>
          </div>
        </aside>
      </div>,
          document.body,
        )
        : null}
    </>
    </Typo>
  );
}
