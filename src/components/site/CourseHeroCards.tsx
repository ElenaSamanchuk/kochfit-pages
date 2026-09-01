"use client";

import { useState, type ReactNode } from "react";
import { assetPath } from "@/lib/asset-path";
import { externalLinks } from "@/content/links";
import { VideoModal } from "@/components/site/VideoModal";
import {
  heroMobileCtaStripH,
  heroMobileCtaStripRadius,
} from "@/components/site/hero-layout";
import { BotPrelaunchIcons } from "@/components/ui/BotPrelaunchIcons";
import { AppLink } from "@/components/ui/AppLink";
import { Typo } from "@/components/ui/TypoText";

const gradientBtn = "var(--gradient-primary)";

type HeroPriceCardProps = {
  chip1: string;
  chip2: string;
  description: ReactNode;
  price: string;
  href: string;
  xlWidth?: string;
  /** max-xl: только полоска цены + кнопка (как HeroBeautyPriceCard) */
  compactMobile?: boolean;
};

/** Стеклянная карточка с ценой — мобила: flex, xl: фикс-ширина в ряду карточек hero */
export function HeroPriceCard({
  chip1,
  chip2,
  description,
  price,
  href,
  xlWidth = "xl:w-[445px]",
  compactMobile = false,
}: HeroPriceCardProps) {
  return (
    <Typo>
    <div
      className={`relative flex min-w-0 flex-1 flex-col overflow-hidden md:max-w-none xl:h-[234px] xl:flex-none xl:rounded-[20px] xl:p-0 ${xlWidth} ${
        compactMobile
          ? "max-xl:gap-0 max-xl:rounded-none max-xl:border-0 max-xl:bg-transparent max-xl:p-0 max-xl:backdrop-blur-none xl:border xl:border-solid xl:border-[rgba(242,242,242,0.32)] xl:bg-[rgba(0,0,0,0.15)]"
          : "gap-2.5 rounded-[14px] border border-solid border-[rgba(242,242,242,0.32)] bg-[rgba(0,0,0,0.15)] p-3 sm:max-xl:gap-3 sm:max-xl:rounded-[20px] sm:max-xl:p-[15px]"
      }`}
    >
      <div
        className={`flex flex-wrap items-center gap-1 sm:gap-2 xl:absolute xl:left-[15px] xl:top-[15px] xl:gap-[8px] ${compactMobile ? "max-xl:hidden" : ""}`}
      >
        <span className="plaque plaque-hero-card bg-surface text-ink-secondary">
          {chip1}
        </span>
        <span className="plaque plaque-hero-card bg-white/15 text-white">
          {chip2}
        </span>
      </div>

      <p
        className={`text-[12px] font-semibold leading-snug text-white sm:max-xl:text-[14px] xl:absolute xl:left-[16px] xl:top-[63px] xl:w-[413px] xl:text-[16px] xl:leading-[normal] ${compactMobile ? "max-xl:hidden" : ""}`}
      >
        {description}
      </p>

      <div
        className={`mt-auto flex flex-row items-center justify-between gap-2 rounded-[12px] bg-white p-2.5 sm:max-xl:rounded-[16px] sm:max-xl:p-3 xl:absolute xl:left-[16px] xl:top-[129px] xl:h-[89px] xl:w-[413px] xl:items-stretch xl:justify-start xl:rounded-[16px] xl:p-0 ${compactMobile ? `max-xl:mt-0 ${heroMobileCtaStripH}` : ""}`}
      >
        <p className="min-w-0 shrink text-left text-[14px] font-semibold leading-tight text-[#4b4d57] sm:text-[18px] xl:absolute xl:left-[21px] xl:top-[31px] xl:text-[20px]">
          {price}
        </p>
        <AppLink
          href={href}
          className="flex min-h-[36px] w-auto shrink-0 items-center justify-center font-semibold rounded-[10px] px-2 py-1 sm:max-xl:min-h-[44px] sm:max-xl:rounded-[12px] sm:max-xl:px-6 sm:max-xl:py-3 xl:absolute xl:left-[161px] xl:top-[20px] xl:min-h-0 xl:rounded-[12px] xl:px-[32px] xl:py-[16px]"
          style={{ backgroundImage: gradientBtn }}
        >
          <span className="whitespace-nowrap text-center font-display text-[11px] font-semibold leading-[1.15] text-white sm:text-[14px]">
            Посмотреть программу
          </span>
        </AppLink>
      </div>
    </div>
    </Typo>
  );
}

type HeroFreeWorkoutCardProps = {
  imageDir: string;
  chipClass?: string;
};

/**
 * Карточка бесплатной тренировки — открывает Kinescope-плеер в модалке.
 * Превью — скрин видео из Figma («Снимок экрана 2026-05-13…»), свой на каждую
 * страницу: images/<dir>/free-workout-thumb.webp.
 */
export function HeroFreeWorkoutCard({
  imageDir,
  chipClass = "bg-surface-blue text-plaque",
}: HeroFreeWorkoutCardProps) {
  const img = (name: string) => assetPath(`/images/${imageDir}/${name}`);
  const [open, setOpen] = useState(false);

  return (
    <Typo>
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Смотреть бесплатную тренировку"
        className={`group/free relative flex min-w-0 flex-1 cursor-pointer flex-col gap-1.5 overflow-hidden bg-white p-2 text-left transition hover:shadow-[0_10px_30px_rgba(75,77,87,0.18)] max-xl:flex-none max-xl:gap-0 max-xl:p-0 md:max-w-none xl:h-[234px] xl:w-[288px] xl:flex-none xl:gap-0 xl:rounded-[20px] xl:p-0 ${heroMobileCtaStripH} ${heroMobileCtaStripRadius}`}
      >
        {/* max-xl: strip fills CTA height (= price bar); xl: Figma 126×272 preview */}
        <span className="relative block h-full w-full shrink-0 overflow-hidden max-xl:rounded-[inherit] xl:absolute xl:left-[8px] xl:top-[8px] xl:!h-[126px] xl:!w-[272px] xl:rounded-[12px]">
          <img
            alt=""
            className="absolute inset-0 size-full max-w-none object-cover transition duration-500 group-hover/free:scale-105"
            src={img("free-workout-thumb.webp")}
            width={544}
            height={252}
          />
          <span className="absolute inset-0 block rounded-[inherit] bg-[rgba(0,0,0,0.2)] transition group-hover/free:bg-[rgba(0,0,0,0.32)]" />
          {/* Figma 2031:2658 — play 41×41, треугольник inset; max-xl: слева по центру полоски */}
          <span className="pointer-events-none absolute size-[28px] max-xl:left-2 max-xl:top-1/2 max-xl:-translate-y-1/2 xl:left-1/2 xl:top-1/2 xl:size-[41px] xl:-translate-x-1/2 xl:-translate-y-1/2 transition group-hover/free:scale-110">
            <span className="relative flex size-full rotate-90 items-center justify-center">
              <span className="absolute inset-[7.32%_12.04%_25%_12.04%]">
                <img
                  alt=""
                  className="block size-full max-w-none"
                  src={img("imgPolygon5.svg")}
                  width={31}
                  height={28}
                />
              </span>
            </span>
          </span>
          {/* max-xl: плашка поверх превью справа по центру полоски */}
          <span
            className={`plaque plaque-hero-label pointer-events-none absolute right-2 top-1/2 z-[1] -translate-y-1/2 xl:!hidden ${chipClass}`}
          >
            Бесплатная тренировка
          </span>
        </span>

        <span className="flex flex-col gap-2.5 sm:gap-3 max-xl:hidden xl:contents">
          <span
            className={`plaque plaque-hero-label max-xl:!hidden xl:absolute xl:left-[16px] xl:top-[150px] ${chipClass}`}
          >
            Бесплатная тренировка
          </span>
          <span className="hidden text-[12px] font-medium leading-snug text-[#676971] xl:absolute xl:left-[16px] xl:top-[188px] xl:block xl:w-[239px] xl:text-[12px] xl:leading-[normal]">
            Высвобождение шейного региона через
            <br className="hidden xl:block" aria-hidden />
            {" "}
            движение таза и позвоночника
          </span>
        </span>
      </button>
      {open && (
        <VideoModal
          src={externalLinks.freeWorkoutVideo}
          title="Бесплатная тренировка Kochfit"
          onClose={() => setOpen(false)}
        />
      )}
    </>
    </Typo>
  );
}

type HeroBotCardProps = {
  botHref: string;
};

/** Карточка бота предзаписи (beauty hero) — Figma 2031:2231 */
export function HeroBotCard({ botHref }: HeroBotCardProps) {
  return (
    <Typo>
    <>
      {/* Мобилка — компактная горизонтальная плашка, как в hero главной */}
      <AppLink
        href={botHref}
        aria-label="Бот предзаписи, перейти в Telegram"
        data-figma-node="2031:2231"
        className="group/hero-strip flex min-h-[52px] w-full items-center gap-2.5 rounded-md bg-white px-3 py-2 transition hover:bg-surface active:scale-[0.99] sm:hidden"
      >
        <span className="relative size-[28px] shrink-0">
          <BotPrelaunchIcons compact />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="whitespace-normal text-small font-bold leading-snug text-ink">
            Бот предзаписи
          </span>
          <span className="whitespace-normal text-small font-normal leading-snug text-ink-secondary">
            Курс по самым выгодным ценам
          </span>
        </span>
        <span
          aria-hidden
          className="flex size-[28px] shrink-0 items-center justify-center rounded-full"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          <svg className="size-[12px]" viewBox="0 0 14 14" fill="none">
            <path
              d="M2.5 7h7M9.5 7l-3-3M9.5 7l-3 3"
              stroke="white"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </AppLink>

      <div
        data-figma-node="2031:2231"
        className="relative hidden min-w-0 flex-1 flex-col overflow-hidden rounded-[14px] bg-white p-2.5 sm:flex sm:rounded-[20px] sm:max-xl:p-[15px] md:max-w-none xl:h-[234px] xl:w-[288px] xl:flex-none xl:p-0"
      >
      <div className="flex w-full flex-col items-center gap-1.5 sm:gap-[8px] xl:absolute xl:left-[30px] xl:top-1/2 xl:w-[228px] xl:-translate-y-1/2 xl:gap-[20px]">
        <div className="flex w-full flex-col items-center gap-1.5 sm:gap-[8px]">
          <span className="hidden sm:block">
            <BotPrelaunchIcons />
          </span>
          <span className="sm:hidden">
            <BotPrelaunchIcons compact />
          </span>
          <div className="flex w-full flex-col gap-1 text-center sm:gap-[8px]">
            <p className="text-[12px] font-bold text-[#4b4d57] sm:text-[14px]">Бот предзаписи</p>
            <p className="hidden text-[12px] font-normal text-[#676971] sm:block">
              Подпишитесь на бот, чтобы приобрести курс по самым выгодным ценам!
            </p>
          </div>
        </div>
        <AppLink
          href={botHref}
          className="btn-primary flex min-h-[44px] w-full items-center justify-center rounded-[10px] px-3 py-1.5 sm:max-xl:rounded-[12px] sm:max-xl:px-8 sm:max-xl:py-3 xl:rounded-[12px] xl:px-[64px] xl:py-[16px]"
        >
          <span className="whitespace-nowrap text-center font-display text-[13px] font-semibold leading-[1.2] text-white sm:text-[14px]">
            Перейти в бот
          </span>
        </AppLink>
      </div>
      </div>
    </>
    </Typo>
  );
}

type HeroBeautyPriceCardProps = {
  chip1: string;
  chip2: string;
  description: string;
  price: string;
  discountLabel: string;
  href: string;
};

/** Стеклянная карточка с ценой — beauty (шире на десктопе) */
export function HeroBeautyPriceCard({
  chip1,
  chip2,
  description,
  price,
  discountLabel,
  href,
}: HeroBeautyPriceCardProps) {
  return (
    <Typo>
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden md:max-w-none max-xl:gap-0 max-xl:rounded-none max-xl:border-0 max-xl:bg-transparent max-xl:p-0 max-xl:backdrop-blur-none xl:h-[234px] xl:w-[512px] xl:flex-none xl:rounded-[20px] xl:border xl:border-solid xl:border-[rgba(242,242,242,0.32)] xl:bg-[rgba(0,0,0,0.15)] xl:p-0 xl:backdrop-blur-[6px]">
      <div className="flex flex-wrap items-center gap-1 max-xl:hidden sm:gap-2 xl:absolute xl:left-[15px] xl:top-[15px] xl:gap-[8px]">
        <span className="plaque plaque-hero-card bg-surface text-ink-secondary">
          {chip1}
        </span>
        <span className="plaque plaque-hero-card bg-white/15 text-white">
          {chip2}
        </span>
      </div>

      <p className="max-xl:hidden text-[12px] font-semibold leading-snug text-white sm:max-xl:text-[14px] xl:absolute xl:left-[15px] xl:top-[63px] xl:w-[426px] xl:text-[16px] xl:leading-[normal]">
        {description}
      </p>

      <div className="mt-auto flex flex-col gap-2 rounded-[12px] bg-white p-2.5 max-xl:mt-0 sm:max-xl:flex-row sm:max-xl:items-center sm:max-xl:justify-between sm:max-xl:rounded-[16px] sm:max-xl:p-3 xl:absolute xl:left-[16px] xl:top-[129px] xl:h-[89px] xl:w-[481px] xl:flex-row xl:items-center xl:rounded-[16px] xl:p-0">
        <div className="flex flex-col gap-0.5 xl:absolute xl:left-[20px] xl:top-[18px]">
          <p className="text-[14px] font-semibold text-[#4b4d57] sm:text-[18px] xl:text-[20px]">
            {price}
          </p>
          <span className="flex items-center gap-1.5">
            <span className="text-[12px] font-semibold text-[#999ca8] sm:text-[14px]">
              {discountLabel}
            </span>
            <span className="inline-flex items-center justify-center rounded-[6px] bg-coral px-[6px] py-[4px] text-center text-[10px] font-semibold leading-none text-white">
              -25%
            </span>
          </span>
        </div>
        <AppLink
          href={href}
          className="flex min-h-[44px] w-full items-center justify-center rounded-[10px] px-2 py-2 font-semibold sm:max-xl:w-auto sm:max-xl:rounded-[12px] sm:max-xl:px-6 sm:max-xl:py-3 xl:absolute xl:left-[229px] xl:top-[20px] xl:w-auto xl:rounded-[12px] xl:px-[32px] xl:py-[16px]"
          style={{ backgroundImage: gradientBtn }}
        >
          <span className="text-center font-display text-[13px] font-semibold leading-[1.15] text-white sm:whitespace-nowrap sm:text-[14px]">
            Посмотреть программу
          </span>
        </AppLink>
      </div>
    </div>
    </Typo>
  );
}
