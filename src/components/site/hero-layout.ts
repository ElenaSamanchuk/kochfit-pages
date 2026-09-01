/** Общие Tailwind-фрагменты hero: мобилка/планшет — база, desktop — единый брейкпоинт xl: (1280px) */

/**
 * Фиксированная высота hero на всех брейкпоинтах.
 * Мобилка НЕ на dvh: при показе/скрытии адресной строки dvh меняется и
 * контент «скачет». 640/720 — адекватно для большинства телефонов/планшетов.
 */
export const heroShell =
  "hero-motion relative mx-auto mt-0 flex h-[640px] w-full max-w-[1360px] flex-col overflow-hidden rounded-3xl bg-white sm:h-[720px] xl:mt-[20px] xl:h-[728px] xl:rounded-2xl";

/**
 * Header lift (all breakpoints): JS sets `--hero-header-progress` 0→1 over
 * `heroHeaderLiftScrollPx` of scrollY. Render `<HeroHeader />` as a sibling of
 * `<main>` (not inside the hero / overflow-x-clip) so first paint matches.
 * Travel / horizontal inset-extra live in `.hero-header` / `.hero-header-bar`
 * (globals.css) per breakpoint:
 * - <640: travel 14px, inset-extra 12px (rest inside cover → docked nearer edges)
 * - 640–1279: travel 18px, inset-extra 12px
 * - xl: travel 36px (20+16), bar px = page-inset-x-desktop+20 (static)
 * Desktop rest visual top ≈ --page-inset-top + 36 (~44); docked ≈ 8.
 */
export const heroHeaderTravelPx = 20 + 16;

/** scrollY (px) over which travel completes (same curve mobile + desktop). */
export const heroHeaderLiftScrollPx = 120;

/** Docked visual `top` after the header has fully lifted. */
export const heroHeaderTopDockedPx = 8;

/** Позиция меню: класс `.hero-header` в globals.css. */
export const heroHeaderTop = "hero-header";

/* pt — воздух под шапкой до чипсов/заголовка (<xl); xl:p-0 в компонентах */
export const heroBody =
  "relative z-[1] flex flex-1 flex-col justify-between gap-3 px-(--page-inset-x) pb-5 pt-[64px] sm:gap-4 sm:pb-6 sm:pt-[72px]";

/** Мобилка: плашки + h1 + подзаголовок по центру; xl — как в Figma слева */
export const heroTopBlock =
  "flex flex-col items-center gap-3 text-center sm:gap-4 xl:items-start xl:gap-[30px] xl:text-left";

/** Чипсы hero: на мобилке переносим по строкам и центрируем, от xl — ряд слева как в макете */
export const heroPillsRow =
  "flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 xl:mb-0 xl:justify-start xl:gap-2";

export const heroCardsRow =
  "flex w-full flex-col-reverse items-stretch gap-2 sm:gap-2.5 xl:absolute xl:left-0 xl:top-[304px] xl:mt-0 xl:h-[234px] xl:w-auto xl:max-w-none xl:flex-row xl:gap-[20px]";

/**
 * Mobile/tablet hero dual bottom strips — price CTA («Посмотреть программу»)
 * and free-workout preview share one height. Desktop xl unchanged.
 * 56 = p-2.5 (10+10) + min-h-36; 68 = p-3 (12+12) + min-h-44.
 * Keep class strings literal in CourseHeroCards too so Tailwind emits utilities.
 */
export const heroMobileCtaStripH = "max-xl:h-[56px] sm:max-xl:h-[68px]";

/** Outer radius of the mobile CTA strips (price bar + free workout). */
export const heroMobileCtaStripRadius =
  "max-xl:rounded-[12px] sm:max-xl:rounded-[16px]";

/**
 * Separate girl/figure layer marker (pregnancy / postpartum).
 * Load zoom lives on `.hero-figure-zoom` wrappers — not on the img crop.
 */
export const heroFigurePhoto = "hero-figure-photo";

/**
 * Ken Burns load zoom — inner wrapper so img crop (scale / object-position)
 * is never overridden. Settles to identity transform.
 */
export const heroPhotoZoom = "hero-photo-zoom absolute inset-0 size-full";
export const heroFigureZoom = "hero-figure-zoom absolute inset-0 size-full";

/** Фон hero: лёгкий zoom на мобилке, без scale на desktop. К object-position — per-page. */
export const heroBgPhoto =
  "hero-bg-photo absolute inset-0 size-full max-w-none object-cover scale-[1.15] xl:scale-100";

/** /community hero — <xl лёгкий zoom вокруг головы; xl без scale. */
export const heroBgPhotoBeauty =
  "hero-bg-photo absolute inset-0 size-full max-w-none object-cover max-xl:scale-[1.1] xl:scale-100";

/** /community hero <xl — высота верхней текстовой зоны (subtitle ~240px @375 + 20px gap). */
export const heroBeautyMobileTextZoneH = "h-[260px]";

/** /community hero <xl — старт нижней зоны с фигурой (sync with text zone height). */
export const heroBeautyMobileFigureZoneTop = "top-[260px]";

/** /community hero <xl — текст наверху, как на остальных основных страницах (offset снят). */
export const heroBeautyMobileTopOffset = "";

/** Главная hero-bg.webp — меньший zoom, чтобы влезли поднятые руки слева (<xl). */
export const heroBgPhotoHome =
  "hero-bg-photo absolute inset-0 size-full max-w-none object-cover scale-[1.1] xl:scale-100";

/** hero-bg.webp — девочка справа, руки слева (<xl). Desktop — center. */
export const heroBgPhotoPosHome =
  "object-[72%_16%] sm:object-[68%_18%] xl:object-center";

/** Курсовые hero (beauty/pelvic) — субъект в правой части кадра, на мобилке держим его в поле зрения */
export const heroBgPhotoPosLeftBottom =
  "object-[78%_bottom] sm:object-[70%_bottom] xl:object-bottom";

/** /e_mtd hero — object-cover без scale (<xl); лицо через object-position. Desktop без изменений. */
export const heroBgPhotoPelvic =
  "hero-bg-photo absolute inset-0 size-full max-w-none object-cover";

/** /e_mtd img8892 — лицо ~95% X / ~48% Y (<xl). xl: object-bottom как в макете. */
export const heroBgPhotoPosPelvic =
  "object-[95%_48%] sm:object-[95%_48%] xl:object-bottom";

/**
 * /community hero <xl — единая стена + фигура на весь hero (без отдельного top bg-surface).
 * object-[50%_26%] + origin-[50%_38%] + translate: голова ~8–20px под subtitle @375,
 * pose крупнее (scale на heroBgPhotoBeauty). xl: object-bottom без изменений.
 */
export const heroBgPhotoBeautyMobileWall =
  "max-xl:object-[50%_30%] max-xl:origin-[50%_38%] max-xl:-translate-y-[24px] xl:object-bottom xl:origin-center";

/** /community hero — xl: полный фон object-bottom. <xl: см. heroBgPhotoBeautyMobileWall. */
export const heroBgPhotoPosBeauty =
  `${heroBgPhotoBeautyMobileWall} xl:origin-center xl:object-bottom`;

/** Беременность / послеродовое — flip-фон (<xl). Desktop — center + absolute sizing в компоненте. */
export const heroBgPhotoPosCenter =
  "object-[35%_center] sm:object-[50%_center] xl:object-center";

/** Mobile figure zone — scale 1.08 origin-bottom, zone 208px (fill subtitle gap; head via object-position). */
export const heroPregnancyMobileFigureZoneTop = "top-[208px]";

export const heroBgPhotoPregnancy =
  "hero-bg-photo absolute inset-0 size-full max-w-none object-cover scale-[1.08] xl:scale-100";

/** <xl: 50% 18% — keep full head with mobile scale 1.08 (was 20% @ scale 0.96; 62% clipped forehead).
 *  xl: object-left-top unchanged. */
export const heroBgPhotoPosPregnancy =
  "object-[50%_18%] origin-bottom xl:origin-center xl:object-left-top";

/**
 * /r hero <xl — subtitle bottom ~235px @375. Zone 200 raises figure so
 * visual gap under subtitle ≈8–20px (not a studio headroom wall).
 * DO NOT restore top-[248px] (huge empty band). DO NOT use scale ≥1.22
 * (heads crop). xl: absolute sizing в PostpartumHero.
 */
export const heroPostpartumMobileFigureZoneTop = "top-[224px]";

/**
 * /r portrait <xl — origin-bottom scale-[1.18] + object-[50%_12%]:
 * bottom-origin zoom trims studio headroom (aspect≈zone so object-% alone
 * barely moves). Full hairline + baby crown; ~14px gap under subtitle @375.
 * Never restore scale-[1.28]/1.22] (heads gone) or scale-[1.14]+top-248
 * (empty band). Load zoom: `.hero-figure-zoom` (identity after settle).
 * xl: relative, scale-100, object-left-top.
 */
export const heroBgPhotoPostpartum =
  "hero-bg-photo absolute inset-0 size-full max-w-none origin-bottom object-cover object-[50%_4%] scale-[1.18] xl:relative xl:origin-center xl:scale-100 xl:object-left-top";
