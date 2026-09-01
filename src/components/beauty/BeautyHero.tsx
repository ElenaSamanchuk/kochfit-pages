import { assetPath } from "@/lib/asset-path";
import { LcpPreload } from "@/components/site/LcpPreload";
import { HeroBeautyPriceCard, HeroBotCard } from "@/components/site/CourseHeroCards";
import {
  heroBgPhotoBeauty,
  heroBgPhotoBeautyMobileWall,
  heroBeautyMobileTopOffset,
  heroBgPhotoPosBeauty,
  heroPhotoZoom,
  heroBody,
  heroCardsRow,
  heroPillsRow,
  heroShell,
  heroTopBlock,
} from "@/components/site/hero-layout";
import { externalLinks } from "@/content/links";
import { coursePricing } from "@/content/courses";

const img = (name: string) => assetPath(`/images/beauty-health/${name}`);

const heroTags = [
  "Флагманский курс",
  "4 недели тренировок",
  "Обновление материалов каждый месяц",
];

/** Hero «Красота и здоровье» — Figma 2031:2181 */
export function BeautyHero() {
  const heroPhotoSrc = img("img54.webp");
  const mobileHeroSrc = img("imgHeroBeautyMobile-1150.webp");
  const mobileHeroSrcSet = [550, 1100, 1150]
    .map((w) => `${img(`imgHeroBeautyMobile-${w}.webp`)} ${w}w`)
    .join(", ");

  return (
    <section
      data-figma-node="2031:2181"
      data-reveal-hero
      className={`${heroShell} xl:mt-[22px]`}
    >
      <LcpPreload href="/images/beauty-health/img54.webp" />
      {/* Figma 2187:1352 — xl: полный фон 1360×728 */}
      <div
        data-figma-node="2187:1352"
        className="absolute inset-0 hidden overflow-hidden xl:block xl:h-[728px] xl:w-full"
      >
        <div className={heroPhotoZoom}>
          <img
            alt=""
            fetchPriority="high"
            width={2720}
            height={1456}
            className={`${heroBgPhotoBeauty} ${heroBgPhotoPosBeauty}`}
            src={heroPhotoSrc}
          />
        </div>
      </div>

      {/* <xl: отдельный портретный кадр с наращенной стеной —
          фигура ниже текста, стык стены зеркальный (scripts/make-beauty-mobile-hero.mjs) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden max-xl:block xl:hidden"
      >
        <div className={heroPhotoZoom}>
          <img
            alt=""
            fetchPriority="high"
            width={1150}
            height={2044}
            className={`${heroBgPhotoBeauty} ${heroBgPhotoBeautyMobileWall}`}
            src={mobileHeroSrc}
            srcSet={mobileHeroSrcSet}
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 max-xl:bg-gradient-to-b max-xl:from-[rgba(37,37,45,0.34)] max-xl:via-[rgba(37,37,45,0.1)] max-xl:via-[48%] max-xl:to-transparent xl:hidden" />
      </div>

      <div
        className={`${heroBody} xl:absolute xl:inset-auto xl:left-[100px] xl:top-[140px] xl:max-w-[631px] xl:flex-none xl:justify-start xl:gap-[30px] xl:p-0`}
      >
        <div className={`${heroTopBlock} ${heroBeautyMobileTopOffset}`}>
          <div className={heroPillsRow}>
            {heroTags.map((tag, i) => (
              <span
                key={tag}
                className={`plaque-chip ${
                  i === 0 ? "plaque-chip-accent" : "plaque-chip-glass"
                } ${i === heroTags.length - 1 ? "max-xl:!hidden" : ""}`}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex w-full flex-col gap-4 text-white xl:gap-[20px]">
            {/* Mobile: 25px/−0.03em как HomeHero; xl — 50px Figma */}
            <h1 className="w-full whitespace-pre-line font-display text-[25px] font-normal leading-[1.2] tracking-[-0.03em] xl:whitespace-normal xl:text-[50px] xl:tracking-normal">
              Красота и здоровье
            </h1>
            {/* Mobile: 14px / lh 1.35 / max 320 как HomeHero; xl — 18px как было */}
            <p className="w-full whitespace-pre-line text-[14px] font-normal leading-[1.35] tracking-[-0.02em] max-xl:mx-auto max-xl:max-w-[320px] xl:mx-0 xl:w-auto xl:max-w-none xl:whitespace-normal xl:text-[18px] xl:leading-[normal] xl:tracking-normal">
              {`Система тренировок, дыхания и работы с телом,\nкоторую можно встроить в обычную жизнь\nи заниматься регулярно от 15 минут в день`}
            </p>
          </div>
        </div>

        <div className={heroCardsRow}>
          <HeroBeautyPriceCard
            chip1="Старт с момента покупки"
            chip2="Дома, в зале, в любой точке мира"
            description="Если вы не знаете, с чего начать, начните с этого курса, направленного на комплексную работу с телом"
            price={coursePricing.beautyHealth.heroLabel}
            discountLabel="Выгода с подпиской"
            href="#tariffs"
          />
          <HeroBotCard botHref={externalLinks.telegramBot} />
        </div>
      </div>
    </section>
  );
}
