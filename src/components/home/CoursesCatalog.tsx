import type React from "react";
import { assetPath } from "@/lib/asset-path";
import Link from "next/link";
import { coursePricing } from "@/content/courses";
import { routes } from "@/content/routes";
import { TrialAndPersonal } from "@/components/home/TrialAndPersonal";

const img = (name: string) => assetPath(`/images/home/${name}`);

/** Figma 2241:5358 — native 4096w, srcSet для retina @ 362px xl / full-width mobile */
const COURSE_IMAGE_BUST = "v=catalog-beauty-hires-1800-q92";
const courseImageSrc = `${img("imgCourseImage.webp")}?${COURSE_IMAGE_BUST}`;
const courseImageSrcSet = `${img("imgCourseImage-900.webp")}?${COURSE_IMAGE_BUST} 900w, ${courseImageSrc} 1800w`;
const courseImageSizes = "362px";

type SmallCourse = {
  title: string;
  description: React.ReactNode;
  badge: string;
  href: string;
  mark: string;
  /** catalogLabel из courses.ts — рядом с кнопкой, НЕ внутри */
  catalogLabel: string;
};

const smallCourses: SmallCourse[] = [
  {
    title: "Мышцы тазового дна и дыхание",
    description:
      "Курс для углублённой работы с мышцами тазового дна и животом через дыхание и восстановление движения в суставах",
    badge: "Старт с момента покупки",
    href: routes.pelvicFloor,
    mark: "imgRectangle29425.webp",
    catalogLabel: coursePricing.pelvicFloor.catalogLabel,
  },
  {
    title: "Активная беременность",
    description:
      "Бережные тренировки во время беременности для поддержания мышечного корсета и подготовки тела к родам, снятия напряжения и хорошего самочувствия",
    badge: "Старт с момента покупки",
    href: routes.activePregnancy,
    mark: "imgRectangle29426.webp",
    catalogLabel: coursePricing.activePregnancy.catalogLabel,
  },
  {
    title: "Восстановление после родов",
    description: (
      <>
        {"Курс для мягкого восстановления после родов с первых дней: поможет "}
        {"бережно вернуть тело в движение и поддержать эмоциональное и физическое состояние"}
      </>
    ),
    badge: "Старт с момента покупки",
    href: routes.postpartum,
    mark: "imgRectangle29427.webp",
    catalogLabel: coursePricing.postpartum.catalogLabel,
  },
];

/** Кнопка каталога — только это слово. Цена — catalogLabel в соседнем span. */
const CATALOG_CTA_BUTTON_TEXT = "Подробнее" as const;

const catalogCtaButtonClass =
  "catalog-cta-btn btn-primary flex min-h-[36px] shrink-0 items-center justify-center rounded-[10px] px-2 py-1 sm:max-xl:min-h-[44px] sm:max-xl:rounded-[12px] sm:max-xl:px-6 sm:max-xl:py-3 xl:min-h-0 xl:rounded-[12px] xl:px-[32px] xl:py-[16px]";

/** Теги флагманского курса — Figma 2261:1785; на max-xl «Дыхание» скрыто в globals.css */
const flagshipContentTags = [
  { label: "Питание", className: "flagship-tag-pilates" },
  { label: "Силовые", className: "flagship-tag-strength" },
  { label: "Дыхание", className: "flagship-tag-breath" },
  { label: "МФР", className: "flagship-tag-mfr" },
] as const;

const flagshipFeatures = [
  "тренировки распределены по уровням и задачам",
  "материалы по нутрициологии, физиологии, психологии",
  "работа с осанкой, животом, движением, общим состоянием",
];

function splitCatalogPricePeriod(label: string): { main: string; periodSuffix: string | null } {
  const match = label.match(/^(.+?)(\/(?:месяц|мес\.?))$/u);
  if (match) {
    return { main: match[1]!, periodSuffix: match[2]! };
  }
  return { main: label, periodSuffix: null };
}

function CatalogPriceLabel({ label, className = "" }: { label: string; className?: string }) {
  const { main, periodSuffix } = splitCatalogPricePeriod(label);

  return (
    <span className={`whitespace-nowrap text-body-lg font-bold text-ink ${className}`.trim()}>
      {main}
      {periodSuffix ? (
        <span className="text-[11px] font-normal text-ink-muted">{periodSuffix}</span>
      ) : null}
    </span>
  );
}

type CatalogPriceCtaProps = {
  /** courses.ts → catalogLabel (от … ₽). НЕ catalogPrices.currentPriceLabel в кнопке. */
  catalogLabel: string;
  /** Внутренняя ссылка; либо href, либо onClick */
  href?: string;
  /** Внешняя ссылка (оплата) */
  externalHref?: string;
  onClick?: () => void;
  /** Подпись кнопки; по умолчанию «Подробнее» */
  label?: string;
  className?: string;
};

/** CTA «Подробнее» + цена — mobile: цена над кнопкой; xl: цена рядом с кнопкой (Figma 2261:1785) */
export function CatalogPriceCta({
  catalogLabel,
  href,
  externalHref,
  onClick,
  label = CATALOG_CTA_BUTTON_TEXT,
  className = "",
}: CatalogPriceCtaProps) {
  const inner = (
    <span className="whitespace-nowrap text-center font-display text-[11px] leading-[1.15] sm:text-[14px]">
      {label}
    </span>
  );
  const btnClass = `order-2 xl:order-1 ${catalogCtaButtonClass}`;

  return (
    <div
      className={`mt-auto flex w-full max-xl:flex-col max-xl:items-center max-xl:gap-2 xl:flex-row xl:items-center xl:justify-start xl:gap-3 ${className}`.trim()}
    >
      <CatalogPriceLabel label={catalogLabel} className="order-1 xl:order-2" />
      {externalHref ? (
        <a
          href={externalHref}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
        >
          {inner}
        </a>
      ) : onClick ? (
        <button type="button" onClick={onClick} className={btnClass}>
          {inner}
        </button>
      ) : (
        <Link href={href ?? "/"} className={btnClass}>
          {inner}
        </Link>
      )}
    </div>
  );
}

/** «Курсы Kochfit» — Figma 2261:1785 */
export function CoursesCatalog() {
  return (
    <section
      id="courses"
      data-figma-node="2261:1785"
      className="mx-auto flex w-full max-w-[1160px] flex-col items-start gap-6 sm:gap-10"
    >
      <h2 className="w-full font-display text-[22px] font-normal leading-[1.25] text-ink xl:text-[24px] xl:leading-[1.2]">
        Курсы <span className="font-bold text-accent">Kochfit</span>
      </h2>

      <div className="flex w-full flex-col items-start gap-[18px] rounded-2xl bg-surface-blue p-[15px] sm:p-5">
        {/* Флагманский курс + изображение */}
        <div className="flex w-full flex-col gap-[18px] xl:flex-row xl:items-center xl:justify-between">
          {/* Обводка как у тарифа «Премиум» (TariffsSection): border-2 #84b0d2 */}
          <article className="course-card course-card-abs relative w-full overflow-hidden border-2 border-solid border-[#84b0d2] xl:h-[267px] xl:w-[740px]">
            <span
              aria-hidden
              className="pointer-events-none absolute left-[323px] top-[-290px] hidden h-[655.831px] w-[699.715px] items-center justify-center"
            >
              <span className="block rotate-[-144.22deg]">
                <img
                  loading="lazy"
                  decoding="async"
                  alt=""
                  width={1200}
                  height={801}
                  className="block h-[388.693px] w-[582.367px] object-cover opacity-35"
                  src={img("imgSectionImage.webp")}
                />
              </span>
            </span>

            <div className="relative flex flex-col gap-2 xl:contents">
              <div className="w-full xl:absolute xl:left-[16px] xl:top-[16px] xl:w-auto">
                <div className="flagship-catalog-header flex min-w-0 flex-1 max-xl:grid max-xl:grid-cols-[1fr_auto] max-xl:items-start max-xl:gap-x-2 xl:flex xl:flex-wrap xl:items-center xl:gap-2">
                  <div className="flagship-catalog-tag-stack flagship-catalog-tags flex min-w-0 flex-row flex-wrap items-center xl:contents xl:flex-row xl:flex-wrap xl:items-center xl:gap-2">
                    <span className="flagship-tag-flag course-catalog-tag bg-surface-blue text-accent">
                      Флагманский курс
                    </span>
                    <span className="flagship-tag-intro course-catalog-tag bg-surface text-ink-muted">
                      Если не знаете, с чего начать
                    </span>
                    {flagshipContentTags.map((tag) => (
                      <span
                        key={tag.label}
                        className={`${tag.className} course-catalog-tag bg-surface text-ink-muted`}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                  <span className="relative inline-grid shrink-0 place-items-start leading-none max-xl:col-start-2 max-xl:row-start-1 xl:hidden">
                    <span className="col-start-1 row-start-1 size-[60px]">
                      <img
                        loading="lazy"
                        alt=""
                        width={60}
                        height={60}
                        className="block size-full"
                        src={img("imgRectangle29424.svg")}
                      />
                    </span>
                    <span className="col-start-1 row-start-1 ml-[4px] mt-[4px] size-[52px] overflow-hidden rounded-sm">
                      <img
                        loading="lazy"
                        decoding="async"
                        alt="Курс «Красота и здоровье»"
                        data-figma-node="2241:5358"
                        width={52}
                        height={52}
                        className="block size-full origin-[52%_18%] object-cover object-[52%_22%] [scale:2.65]"
                        src={courseImageSrc}
                      />
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 xl:absolute xl:left-[16px] xl:top-[58px] xl:flex-row xl:items-start xl:gap-[40px] xl:leading-[normal]">
                <div className="flex max-w-[301px] flex-col gap-1">
                  <p className="text-body-lg font-semibold text-ink">Красота и здоровье</p>
                  <p className="text-small font-normal text-ink-secondary">
                    Пошаговая система, с которой тренировки станут регулярными и в удовольствие
                  </p>
                </div>
                <div className="flex max-w-[302px] flex-col gap-1">
                  <p className="text-body font-semibold text-ink">Кому подойдёт:</p>
                  <p className="text-small font-normal text-ink-secondary">
                    Тем, кто хочет один сильный курс «на каждый день», в котором собраны тренировки для решения любой задачи от здоровья суставов до эстетики
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 xl:absolute xl:left-[357px] xl:top-[153px] xl:w-[362px] xl:leading-[normal]">
                <p className="text-body font-semibold text-ink">Что внутри:</p>
                {flagshipFeatures.map((feature) => (
                  <span key={feature} className="flex w-full items-center gap-2">
                    <span className="relative block size-[13px] shrink-0 overflow-hidden">
                      <img loading="lazy"
                        alt=""
                        width={13}
                        height={13}
                        className="absolute inset-[13.33%_0] block h-[73.34%] w-full max-w-none"
                        src={img("imgGroup1.svg")}
                      />
                    </span>
                    <span className="text-small font-normal text-ink-secondary">{feature}</span>
                  </span>
                ))}
              </div>

              <CatalogPriceCta
                catalogLabel={coursePricing.beautyHealth.catalogLabel}
                href={routes.beautyHealth}
                className="xl:absolute xl:left-[16px] xl:top-[202px]"
              />
            </div>
          </article>

          <span className="relative hidden h-[267px] w-[362px] shrink-0 overflow-hidden rounded-md border border-solid border-line xl:block">
            {/* Figma 2241:5358 — crop/zoom на img */}
            <img
              loading="lazy"
              decoding="async"
              alt="Курс «Красота и здоровье»"
              data-figma-node="2241:5358"
              width={1800}
              height={1005}
              className="absolute inset-0 size-full max-w-none object-cover xl:inset-auto xl:left-[-22.17%] xl:top-[-9.27%] xl:h-[109.13%] xl:w-[144.25%]"
              src={courseImageSrc}
              srcSet={courseImageSrcSet}
              sizes={courseImageSizes}
            />
          </span>
        </div>

        {/* Три курса */}
        <div className="grid w-full grid-cols-1 gap-[18px] md:grid-cols-2 xl:grid-cols-3">
          {smallCourses.map((course) => (
            <article
              key={course.title}
              className="course-card relative flex min-h-[215px] w-full flex-col items-start gap-5 overflow-hidden"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute left-[82px] top-[24px] hidden h-[321.378px] w-[357.775px] items-center justify-center sm:flex"
              >
                <span className="block rotate-[-29.96deg]">
                  <img
                    loading="lazy"
                    decoding="async"
                    alt=""
                    width={1200}
                    height={801}
                    className="block h-[199.045px] w-[298.223px] object-cover opacity-35"
                    src={img("imgSectionImage.webp")}
                  />
                </span>
              </span>
              <div className="relative flex min-h-px w-full flex-1 flex-col items-start gap-5">
                <div className="flex w-full flex-wrap items-start gap-x-2 gap-y-5">
                  <div className="min-w-0 flex-1">
                    <span className="course-catalog-tag bg-surface text-ink-secondary">
                      {course.badge}
                    </span>
                    <div className="mt-2 flex flex-col gap-1 leading-[normal] xl:mt-4">
                      <p className="text-body-lg font-semibold text-ink">{course.title}</p>
                      {/* Описание рядом с миниатюрой — только от sm; на мобилке оно ниже во всю ширину */}
                      <p className="hidden text-small font-normal text-ink-secondary sm:block">
                        {course.description}
                      </p>
                    </div>
                  </div>
                  <span className="relative inline-grid shrink-0 place-items-start leading-none">
                    <span className="col-start-1 row-start-1 size-[60px]">
                      <img
                        loading="lazy"
                        alt=""
                        width={60}
                        height={60}
                        className="block size-full"
                        src={img("imgRectangle29424.svg")}
                      />
                    </span>
                    <span className="col-start-1 row-start-1 ml-[4px] mt-[4px] size-[52px] overflow-hidden rounded-sm">
                      <img
                        loading="lazy"
                        decoding="async"
                        alt=""
                        width={104}
                        height={104}
                        className="block size-full object-cover"
                        src={img(course.mark)}
                      />
                    </span>
                  </span>
                </div>
                {/* Мобилка — описание во всю ширину карточки, не зажато миниатюрой */}
                <p className="-mt-3 text-small font-normal leading-[1.4] text-ink-secondary sm:hidden">
                  {course.description}
                </p>
                <CatalogPriceCta catalogLabel={course.catalogLabel} href={course.href} />
              </div>
            </article>
          ))}
        </div>

        {/* Тестовая неделя и персональные тренировки — нижний ряд каталога */}
        <TrialAndPersonal />
      </div>
    </section>
  );
}
