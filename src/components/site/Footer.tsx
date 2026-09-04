import { assetPath } from "@/lib/asset-path";
import Link from "next/link";
import { AppLink } from "@/components/ui/AppLink";
import { externalLinks } from "@/content/links";
import {
  footerSocialIcons,
  footerSocialSizes,
  footerSocialSrcSet,
  footerSocialWebp,
} from "@/components/ui/SocialIcons";

const img = (name: string) => assetPath(`/images/shared/footer/${name}`);

/** Figma 442:11723 — native 422w, sizes = ширина файла. */
const NINETYNINE_BUST = "v=footer-nn-native-422";

const courseLinks = [
  { text: "Красота и здоровье", href: "/community" },
  { text: "Мышцы тазового дна", href: "/e_mtd" },
  { text: "Активная беременность", href: "/for_pregnant" },
  { text: "Восстановление после родов", href: "/r" },
  { text: "Персональная работа", href: "/basket" },
];

const pageLinks = [
  { text: "Главная", href: "/" },
  { text: "Обо мне", href: "/person" },
  { text: "Кочфит журнал", href: "/journal" },
  { text: "Результаты и отзывы клиентов", href: "/result" },
  { text: "Оборудование для тренировок", href: "/equipment" },
];

const mobileLegalLeft = [
  { text: "Политика обработки персональных данных", href: externalLinks.legal.privacy },
  { text: "Партнерское соглашение о реферальной программе", href: externalLinks.legal.partOferta },
  { text: "Договор - оферта", href: externalLinks.legal.oferta },
] as const;

const mobileLegalRight = [
  { text: "Согласие на обработку персональных данных", href: externalLinks.legal.dataConsent },
] as const;

function FooterLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  /* Мобилка — плотный список; lg — исходный компактный список Figma */
  const linkClass = `flex w-full items-start py-[6px] font-normal leading-[1.3] transition hover:translate-x-0.5 hover:text-accent lg:block lg:py-0 lg:leading-[1.2] ${className}`;
  return (
    <AppLink href={href} className={linkClass}>
      {children}
    </AppLink>
  );
}

/** Иконки соцсетей — Figma 442:11737, native 120w @4× webp + srcset */
const socialLinks = [
  { key: "tg", href: externalLinks.telegramChannel, label: "Telegram", icon: footerSocialIcons.telegram },
  { key: "vk", href: externalLinks.vk, label: "ВКонтакте", icon: footerSocialIcons.vk },
  { key: "yt", href: externalLinks.youtube, label: "YouTube", icon: footerSocialIcons.youtube },
  { key: "mail", href: externalLinks.email, label: "Почта", icon: footerSocialIcons.email },
  { key: "ig", href: externalLinks.instagram, label: "Instagram*", icon: footerSocialIcons.instagram, star: true },
] as const;

function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <div
      data-figma-node="442:11737"
      className={`relative flex w-fit items-center gap-[5px] ${className}`}
    >
      {socialLinks.map((s) => (
        <AppLink
          key={s.key}
          href={s.href}
          aria-label={s.label}
          className="relative flex size-[30px] shrink-0 items-center justify-center rounded-full transition hover:opacity-85"
        >
          <img
            loading="lazy"
            alt=""
            width={30}
            height={30}
            className="block size-full max-w-none rounded-full"
            src={footerSocialWebp(s.icon.stem, s.icon.width)}
            srcSet={footerSocialSrcSet(s.icon.stem, s.icon.width)}
            sizes={footerSocialSizes}
          />
          {"star" in s && s.star ? (
            <img
              loading="lazy"
              alt=""
              aria-hidden
              width={6}
              height={6}
              className="pointer-events-none absolute -top-0.5 -right-0.5 block size-[6px]"
              src={img(footerSocialIcons.asterisk)}
            />
          ) : null}
        </AppLink>
      ))}
    </div>
  );
}

function CtaButtons({ layout }: { layout: "mobile" | "desktop" }) {
  const isMobile = layout === "mobile";
  const wrapperClass = isMobile
    ? "flex w-[148px] shrink-0 flex-col items-stretch gap-[6px]"
    : "flex w-full max-w-[320px] shrink-0 flex-col items-start gap-[12px] lg:w-[160px]";
  const buttonClass = isMobile
    ? "flex h-[36px] w-full items-center justify-center rounded-sm px-[10px] transition hover:scale-[1.03] active:scale-[0.98]"
    : "flex h-[44px] w-full items-center justify-center rounded-sm px-[28px] transition hover:scale-[1.03] active:scale-[0.98] lg:h-[40px]";

  return (
    <div className={wrapperClass}>
      <AppLink
        href={externalLinks.login}
        className={`${buttonClass} border border-solid border-white hover:bg-white/10`}
      >
        <span className="whitespace-nowrap font-display text-[12px] font-semibold leading-[1.2] text-white lg:text-[12px]">
          Личный кабинет
        </span>
      </AppLink>
      <AppLink
        href={externalLinks.telegramBot}
        className={`${buttonClass} btn-primary`}
      >
        <span className="whitespace-nowrap font-display text-[12px] font-semibold leading-[1.2] text-white lg:text-[12px]">
          Предзапись
        </span>
      </AppLink>
    </div>
  );
}

/** Футер сайта — Figma 442:11705 «Footer от 1200 px»; мобилка — как старый сайт */
export function Footer() {
  return (
    <footer data-figma-node="442:11705" className="mt-[32px] w-full bg-ink lg:mt-[56px]">
      <div className="mx-auto w-full max-w-[1400px] px-(--page-inset-x) pb-[12px] pt-[48px] md:px-[40px] lg:px-[60px] lg:pb-[37px] lg:pt-[72px] xl:px-[120px]">
        {/* ——— Мобилка: структура как на старом сайте ——— */}
        <div className="flex flex-col gap-[18px] lg:hidden">
          {/* 1. Лого + соцсети слева | кнопки справа; Meta — на всю ширину, ровно 2 строки */}
          <div className="flex items-start justify-between gap-[8px]">
            <div className="min-w-0 flex-1">
              <Link
                href="/"
                className="inline-block whitespace-nowrap py-0 font-display text-[22px] font-bold uppercase leading-[1.2] text-accent"
              >
                Kochfit.
              </Link>
              <SocialIcons className="mt-[6px]" />
            </div>
            <CtaButtons layout="mobile" />
          </div>
          <p className="-mt-[8px] whitespace-pre-line text-[11px] font-normal leading-[1.25] text-white/60">
            {`Meta признана экстремистской
организацией на территории РФ*`}
          </p>

          {/* 2. Две колонки: Курсы | Страницы */}
          <div className="grid grid-cols-2 gap-x-[12px] font-display text-[12px] leading-[1.25] text-white">
            <div className="flex min-w-0 flex-col items-start gap-0">
              <p className="w-full pb-[8px] text-[13px] font-bold leading-[1.2]">
                Курсы и предложения
              </p>
              {courseLinks.map((link) => (
                <FooterLink key={link.text} href={link.href}>
                  {link.text}
                </FooterLink>
              ))}
            </div>
            <div className="flex min-w-0 flex-col items-start gap-0">
              <p className="w-full pb-[8px] text-[13px] font-bold leading-[1.2]">
                Другие страницы
              </p>
              {pageLinks.map((link) => (
                <FooterLink key={link.text} href={link.href}>
                  {link.text}
                </FooterLink>
              ))}
            </div>
          </div>

          {/* 3. Документы в 2 колонки + ИП / Shumann lab */}
          <div className="grid grid-cols-2 gap-x-[12px] font-display text-[11px] font-normal leading-[1.25] text-white/50">
            <div className="flex min-w-0 flex-col items-start gap-0">
              {mobileLegalLeft.map((link) => (
                <AppLink
                  key={link.href}
                  href={link.href}
                  className="py-[6px] transition hover:text-accent"
                >
                  {link.text}
                </AppLink>
              ))}
            </div>
            <div className="flex min-w-0 flex-col items-start gap-0">
              {mobileLegalRight.map((link) => (
                <AppLink
                  key={link.href}
                  href={link.href}
                  className="py-[6px] transition hover:text-accent"
                >
                  {link.text}
                </AppLink>
              ))}
              <p className="mt-[4px] leading-[1.25]">
                ИП Шуман Игорь Викторович
                <span className="mt-[1px] block">ИНН 246521363326</span>
              </p>
              <AppLink
                href="https://shumann.ru/"
                className="mt-[2px] block text-[11px] text-white/50 transition hover:text-white/70"
              >
                <span className="whitespace-nowrap">Shumann lab</span>
              </AppLink>
            </div>
          </div>
        </div>

        {/* ——— Десктоп: исходный макет Figma ——— */}
        <div className="hidden lg:block">
          <div className="flex flex-row items-start justify-between gap-[40px]">
            <div className="w-[182px] shrink-0">
              <Link
                href="/"
                className="inline-block whitespace-nowrap py-[6px] font-display text-[24px] font-bold uppercase leading-[1.2] text-accent"
              >
                Kochfit.
              </Link>
              <SocialIcons className="mt-[13px] flex" />
              <p className="mt-[42px] w-[260px] text-[12px] font-normal leading-[1.4] text-white/60">
                {"Meta признана экстремистской "}
                организацией на территории РФ*
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-start gap-[12px] font-display text-[12px] leading-[1.2] text-white lg:w-[182px]">
              <p className="w-full font-bold">Курсы и предложения</p>
              {courseLinks.map((link) => (
                <FooterLink key={link.text} href={link.href} className="whitespace-nowrap">
                  {link.text}
                </FooterLink>
              ))}
            </div>

            <div className="flex shrink-0 flex-col items-start gap-[12px] font-display text-[12px] leading-[1.2] text-white lg:w-[191px]">
              <p className="w-full font-bold">Другие страницы</p>
              {pageLinks.map((link) => (
                <FooterLink key={link.text} href={link.href} className="whitespace-nowrap">
                  {link.text}
                </FooterLink>
              ))}
            </div>

            <CtaButtons layout="desktop" />
          </div>

          <span className="mt-[24px] block h-px w-full bg-white/20" />

          <div className="mt-[30px] flex flex-row flex-wrap items-start justify-between gap-x-[20px] gap-y-[16px] font-display text-[12px] font-normal leading-[1.2] text-white/50">
            <AppLink href={externalLinks.legal.oferta} className="whitespace-nowrap">
              Договор - оферта
            </AppLink>
            <AppLink href={externalLinks.legal.partOferta} className="whitespace-nowrap">
              {"Партнерское соглашение "}
               о реферальной программе
            </AppLink>
            <AppLink href={externalLinks.legal.privacy} className="whitespace-nowrap">
              {"Политика обработки "}
              персональных данных
            </AppLink>
            <AppLink href={externalLinks.legal.dataConsent} className="whitespace-nowrap">
              {"Согласие на обработку "}
              персональных данных
            </AppLink>
            <span className="whitespace-nowrap">
              {"ИП Шуман Игорь Викторович"}
              <span className="mt-[13px] block">ИНН 246521363326</span>
            </span>
            <span className="flex w-[119px] flex-col items-start">
              <AppLink href="https://shumann.ru/" className="whitespace-nowrap">
                Shumann lab
              </AppLink>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
