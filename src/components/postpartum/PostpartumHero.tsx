import { assetPath } from "@/lib/asset-path";
import { coursePricing } from "@/content/courses";
import { LcpPreload } from "@/components/site/LcpPreload";
import { HeroFreeWorkoutCard, HeroPriceCard } from "@/components/site/CourseHeroCards";
import {
  heroBgPhoto,
  heroBgPhotoPosCenter,
  heroBgPhotoPostpartum,
  heroBody,
  heroCardsRow,
  heroFigurePhoto,
  heroFigureZoom,
  heroPhotoZoom,
  heroPillsRow,
  heroPostpartumMobileFigureZoneTop,
  heroShell,
  heroTopBlock,
} from "@/components/site/hero-layout";

const img = (name: string) => assetPath(`/images/postpartum/${name}`);

/** Hero «Восстановление после родов» — Figma 2042:9157 */
export function PostpartumHero() {
  return (
    <section data-figma-node="2042:9157" data-reveal-hero className={heroShell}>
      <LcpPreload href="/images/postpartum/imgChatGptImage2420261720451.webp" />
      <LcpPreload href="/images/postpartum/imgHf20260520113803Accb8Bac783540Ad9B063Eae4D01114F1.webp" />
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

      {/* Тот же портрет, что на xl. <xl: зона 200 + origin-bottom scale 1.18 +
          object-[50%_12%] — ~14px gap under subtitle, heads clear; xl без изменений. */}
      <span
        className={`pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden -scale-x-100 ${heroPostpartumMobileFigureZoneTop} xl:inset-x-auto xl:bottom-auto xl:left-[939px] xl:right-auto xl:top-[-91px] xl:h-[886px] xl:w-[484px]`}
      >
        <span className={heroFigureZoom}>
          <img
            alt=""
            fetchPriority="high"
            className={`${heroBgPhotoPostpartum} ${heroFigurePhoto}`}
            src={img("imgHf20260520113803Accb8Bac783540Ad9B063Eae4D01114F1.webp")}
          />
        </span>
      </span>

      <div
        className={`${heroBody} xl:absolute xl:inset-auto xl:left-[100px] xl:top-[140px] xl:max-w-[793px] xl:flex-none xl:justify-start xl:gap-[30px] xl:p-0`}
      >
        <div className={heroTopBlock}>
          <div className={heroPillsRow}>
            <span className="plaque-chip plaque-chip-accent">
              После естественных родов и кесарева
            </span>
            <span className="plaque-chip plaque-chip-glass max-xl:!hidden">
              С первых дней после родов
            </span>
          </div>

          <div className="flex w-full max-w-[631px] flex-col gap-4 text-white xl:max-w-none xl:gap-[20px]">
            {/* Mobile: 25px/−0.03em + 2 строки как HomeHero; xl — 50px Figma */}
            <h1 className="w-full whitespace-pre-line font-display text-[25px] font-normal leading-[1.2] tracking-[-0.03em] xl:whitespace-normal xl:text-[50px] xl:tracking-normal">
              {`Восстановление\nпосле родов`}
            </h1>
            {/* Mobile: 14px / lh 1.35 / max 320 как HomeHero; xl — 18px как было */}
            <p className="w-full max-w-[527px] whitespace-pre-line text-[14px] font-normal leading-[1.35] tracking-[-0.02em] max-xl:mx-auto max-xl:max-w-[320px] xl:mx-0 xl:w-auto xl:max-w-[527px] xl:whitespace-normal xl:text-[18px] xl:leading-[normal] xl:tracking-normal">
              {`Курс для женщин, которые хотят\nвернуть телу подвижность, осанку\nи мышечную поддержку после родов`}
            </p>
          </div>
        </div>

        <div className={heroCardsRow}>
          <HeroPriceCard
            compactMobile
            chip1="Старт с момента покупки"
            chip2="Тренировки 20–30 минут"
            description={
              <>
                Помогает вернуть телу опору после родов:
                <br className="hidden xl:block" aria-hidden />{" "}
                мышцы тазового дна, дыхание, осанка, живот
              </>
            }
            price={coursePricing.postpartum.heroLabel}
            href="#tariffs"
          />
          <HeroFreeWorkoutCard imageDir="postpartum" />
        </div>
      </div>
    </section>
  );
}
