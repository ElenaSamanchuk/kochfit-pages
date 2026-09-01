import { assetPath } from "@/lib/asset-path";
import { coursePricing } from "@/content/courses";
import { LcpPreload } from "@/components/site/LcpPreload";
import { HeroFreeWorkoutCard, HeroPriceCard } from "@/components/site/CourseHeroCards";
import {
  heroBgPhoto,
  heroBgPhotoPosCenter,
  heroBgPhotoPosPregnancy,
  heroBgPhotoPregnancy,
  heroBody,
  heroCardsRow,
  heroFigurePhoto,
  heroFigureZoom,
  heroPhotoZoom,
  heroPillsRow,
  heroPregnancyMobileFigureZoneTop,
  heroShell,
  heroTopBlock,
} from "@/components/site/hero-layout";

const img = (name: string) => assetPath(`/images/pregnancy/${name}`);

const heroTags = [
  "Перед началом проконсультируйтесь с врачом",
  "Подготовка к родам и восстановлению",
  "Безопасные нагрузки для каждого триместра",
];

/** Hero «Активная беременность» — Figma 2351:10753 */
export function PregnancyHero() {
  return (
    <section data-figma-node="2351:10753" data-reveal-hero className={heroShell}>
      <LcpPreload href="/images/pregnancy/imgChatGptImage2420261720451.webp" />
      <LcpPreload href="/images/pregnancy/imgImage2398.webp" />
      {/* Figma фон — flip; <xl полный кадр сцены, xl absolute sizing */}
      <div className="absolute inset-0 overflow-hidden -scale-x-100">
        <div className={heroPhotoZoom}>
          <img
            alt=""
            fetchPriority="high"
            className={`${heroBgPhoto} ${heroBgPhotoPosCenter} xl:left-[-20px] xl:top-[-25px] xl:h-[786px] xl:w-[1400px] xl:object-cover`}
            src={img("imgChatGptImage2420261720451.webp")}
          />
        </div>
        <span className="absolute inset-0 bg-[rgba(37,37,45,0.33)]" />
      </div>

      {/* Тот же портрет, что на xl (без зеркала — она уже смотрит влево).
          <xl: зона с 208px (Playwright @375), z-0 под карточками. xl: 527×786. */}
      <span
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-0 overflow-hidden ${heroPregnancyMobileFigureZoneTop} xl:inset-x-auto xl:bottom-auto xl:left-[845px] xl:right-auto xl:top-0 xl:h-[786px] xl:w-[527px] xl:z-auto`}
      >
        <span className={heroFigureZoom}>
          <img
            alt=""
            fetchPriority="high"
            className={`${heroBgPhotoPregnancy} ${heroBgPhotoPosPregnancy} ${heroFigurePhoto} xl:relative`}
            src={img("imgImage2398.webp")}
          />
        </span>
      </span>

      <div
        className={`${heroBody} xl:absolute xl:inset-auto xl:left-[100px] xl:top-[140px] xl:max-w-[850px] xl:flex-none xl:justify-start xl:gap-[30px] xl:p-0`}
      >
        <div className={heroTopBlock}>
          <div className={`${heroPillsRow} xl:flex-wrap xl:gap-2 xl:overflow-visible`}>
            {heroTags.map((tag, i) => (
              <span
                key={tag}
                className={`plaque-chip ${i === 0 ? "plaque-chip-accent" : "plaque-chip-glass max-xl:!hidden"}`}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex w-full max-w-[631px] flex-col gap-4 text-white xl:gap-[20px]">
            {/* Mobile: 25px/−0.03em как HomeHero; xl — 50px Figma */}
            <h1 className="w-full whitespace-pre-line font-display text-[25px] font-normal leading-[1.2] tracking-[-0.03em] xl:whitespace-normal xl:text-[50px] xl:tracking-normal">
              Активная беременность
            </h1>
            {/* Mobile: 14px / lh 1.35 / max 320 как HomeHero; xl — nowrap+br как было */}
            <p className="w-full max-w-[527px] whitespace-pre-line text-[14px] font-normal leading-[1.35] tracking-[-0.02em] max-xl:mx-auto max-xl:max-w-[320px] xl:mx-0 xl:w-auto xl:max-w-[640px] xl:whitespace-normal xl:text-[18px] xl:leading-[normal] xl:tracking-normal">
              <span className="xl:hidden">
                {`Тренировки и лекции, которые помогают\nчувствовать себя в ресурсе, подготовить\nтело к родам и восстановиться быстрее`}
              </span>
              <span className="hidden xl:inline">
                <span className="xl:whitespace-nowrap">
                  Тренировки и лекции, которые помогают чувствовать себя в ресурсе,
                </span>
                <br aria-hidden />{" "}
                подготовить тело к родам и восстановиться быстрее
              </span>
            </p>
          </div>
        </div>

        <div
          className={`${heroCardsRow} xl:absolute xl:left-0 xl:top-[304px] xl:mt-0 xl:h-[234px] xl:w-auto xl:max-w-none xl:flex-row xl:gap-[20px]`}
        >
          <HeroPriceCard
            compactMobile
            chip1="Старт с момента покупки"
            chip2="Тренировки 20–30 минут"
            description="Все тренировки адаптированы под физиологию беременных. Проконсультируйтесь с врачом"
            price={coursePricing.activePregnancy.heroLabel}
            href="#tariffs"
          />
          <HeroFreeWorkoutCard imageDir="pregnancy" chipClass="bg-line text-ink-secondary" />
        </div>
      </div>
    </section>
  );
}
