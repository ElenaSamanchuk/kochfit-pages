import { assetPath } from "@/lib/asset-path";
import { coursePricing } from "@/content/courses";
import { LcpPreload } from "@/components/site/LcpPreload";
import { HeroFreeWorkoutCard, HeroPriceCard } from "@/components/site/CourseHeroCards";
import {
  heroBgPhotoPelvic,
  heroBgPhotoPosPelvic,
  heroPhotoZoom,
  heroBody,
  heroCardsRow,
  heroPillsRow,
  heroShell,
  heroTopBlock,
} from "@/components/site/hero-layout";

const img = (name: string) => assetPath(`/images/pelvic-floor/${name}`);

const heroTags = [
  "Практики + вебинары акушера-гинеколога",
  "Подходит женщинам любого возраста",
  "Видео от 15 до 40 минут",
];

/** Hero «Мышцы тазового дна и дыхание» — Figma 2031:2610 */
export function PelvicHero() {
  return (
    <section data-figma-node="2031:2610" data-reveal-hero className={heroShell}>
      <LcpPreload href="/images/pelvic-floor/img8892.webp" />
      {/* Figma 2222:2507 — фон 1360×728, object-bottom */}
      <div
        data-figma-node="2222:2507"
        className="absolute inset-0 overflow-hidden xl:h-[728px] xl:w-full"
      >
        <div className={heroPhotoZoom}>
          <img
            alt=""
            fetchPriority="high"
            width={2720}
            height={1456}
            className={`${heroBgPhotoPelvic} ${heroBgPhotoPosPelvic}`}
            src={img("img8892.webp")}
          />
        </div>
      </div>

      <div
        className={`${heroBody} xl:absolute xl:inset-auto xl:left-[100px] xl:top-[140px] xl:max-w-[838px] xl:flex-none xl:justify-start xl:gap-[30px] xl:p-0`}
      >
        <div className={`${heroTopBlock} min-w-0`}>
          <div className={heroPillsRow}>
            {heroTags.map((tag, i) => (
              <span
                key={tag}
                className={`plaque-chip ${i === 0 ? "plaque-chip-accent" : "plaque-chip-glass max-xl:!hidden"}`}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex w-full max-w-[631px] flex-col gap-4 text-white xl:max-w-none xl:gap-[20px]">
            {/* Mobile: 25px/−0.03em + 2 строки как HomeHero; xl — 50px Figma */}
            <h1 className="w-full whitespace-pre-line font-display text-[25px] font-normal leading-[1.2] tracking-[-0.03em] xl:whitespace-normal xl:text-[50px] xl:tracking-normal">
              {`Мышцы тазового дна\nи дыхание`}
            </h1>
            {/* Mobile: 14px / lh 1.35 / max 320 как HomeHero; xl — 18px как было */}
            <p className="w-full max-w-[562px] whitespace-pre-line text-[14px] font-normal leading-[1.35] tracking-[-0.02em] max-xl:mx-auto max-xl:max-w-[320px] xl:mx-0 xl:w-auto xl:max-w-[562px] xl:whitespace-normal xl:text-[18px] xl:leading-[normal] xl:tracking-normal">
              {`Курс для\u00A0тех, кто хочет укрепить тазовое\nдно, наладить дыхание и\u00A0убрать дискомфорт.\nЧтобы тело работало без\u00A0ограничений`}
            </p>
          </div>
        </div>

        <div className={heroCardsRow}>
          <HeroPriceCard
            compactMobile
            chip1="Старт с момента покупки"
            chip2="Доступ 3 месяца"
            description={
              <>
                Помогает вернуть телу опору после родов:
                 
                мышцы тазового дна, дыхание, осанка, живот
              </>
            }
            price={coursePricing.pelvicFloor.heroLabel}
            href="#tariffs"
          />
          <HeroFreeWorkoutCard imageDir="pelvic-floor" />
        </div>
      </div>
    </section>
  );
}
