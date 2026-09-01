import { assetPath } from "@/lib/asset-path";
import { LcpPreload } from "@/components/site/LcpPreload";
import {
  heroBgPhotoHome,
  heroBgPhotoPosHome,
  heroPhotoZoom,
  heroShell,
} from "@/components/site/hero-layout";
import { VkNoticeBar } from "@/components/home/VkNoticeBar";
import { BotPrelaunchIcons } from "@/components/ui/BotPrelaunchIcons";
import { TelegramBadgeIcon } from "@/components/ui/TelegramBadgeIcon";
import { externalLinks } from "@/content/links";

const heroBg = assetPath("/images/shared/hero-bg.webp");
const heroGlassCard = assetPath("/images/shared/hero-glass-card.webp");
const heroGlassCardDesktop = assetPath("/images/home/img202605131451311.webp");

const heroTags = [
  "Умный фитнес",
  "Дыхание",
  "Кинезиология",
  "Биомеханика",
  "Силовые",
];
/** На мобилке показываем первые N — чтобы плашки уложились ровно в два ряда. */
const HERO_TAGS_MOBILE = 4;

type HeroArrowDirection = "down" | "right";

const heroArrowPaths: Record<HeroArrowDirection, string> = {
  down: "M7 2.5v7M7 9.5l-3-3M7 9.5l3-3",
  right: "M2.5 7h7M9.5 7l-3-3M9.5 7l-3 3",
};

/** Круглая кнопка-стрелка — Figma 2228:1435; `standalone` для отдельного tap-target на мобилке */
function HeroGradientArrowButton({
  compact = false,
  standalone = false,
  direction = "down",
}: {
  compact?: boolean;
  standalone?: boolean;
  direction?: HeroArrowDirection;
}) {
  const circleSize = standalone
    ? "size-[28px] sm:size-[44px]"
    : compact
      ? "size-[24px] sm:size-[28px]"
      : "size-[28px] sm:size-[36px] xl:size-[40px]";
  const iconSize = standalone
    ? "size-[12px] sm:size-[16px]"
    : compact
      ? "size-[9px] sm:size-[10px]"
      : "size-[10px] sm:size-[12px] xl:size-[14px]";

  return (
    <span
      aria-hidden
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ${circleSize}`}
      style={{ backgroundImage: "var(--gradient-primary)" }}
    >
      <svg
        className={`${direction === "down" ? "equipment-arrow-down" : ""} ${iconSize}`}
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path
          d={heroArrowPaths[direction]}
          stroke="white"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function HeroCourseArrowButton({ compact = false }: { compact?: boolean }) {
  return <HeroGradientArrowButton compact={compact} direction="down" />;
}

/** Hero главной — Figma 2031:1821 */
export function HomeHero() {
  return (
    <section data-figma-node="2031:1821" data-reveal-hero className={heroShell}>
      <LcpPreload href="/images/shared/hero-bg.webp" />
      <div className="absolute inset-0 xl:left-1/2 xl:top-[-309px] xl:h-[1073px] xl:w-[1374px] xl:-translate-x-1/2">
        <div className={heroPhotoZoom}>
          <img
            alt=""
            className={`${heroBgPhotoHome} ${heroBgPhotoPosHome}`}
            src={heroBg}
            width={2748}
            height={2146}
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>

      <VkNoticeBar />

      {/* pt <xl = heroBody; VK-плашка при открытии даёт flow-spacer в VkNoticeBar */}
      <div className="relative z-[1] flex flex-1 flex-col justify-between gap-3 px-(--page-inset-x) pb-5 pt-[64px] sm:gap-4 sm:pb-6 sm:pt-[72px] xl:absolute xl:inset-auto xl:left-[100px] xl:top-[140px] xl:flex-none xl:justify-start xl:gap-0 xl:p-0">
        <div className="flex flex-col items-center gap-4 text-center sm:gap-6 xl:items-start xl:gap-0 xl:text-left">
        <div className="flex flex-nowrap items-center justify-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-1.5 xl:mb-[32px] xl:justify-start xl:flex-wrap xl:gap-2 xl:overflow-visible [&::-webkit-scrollbar]:hidden">
          {heroTags.map((tag, i) => (
            <span
              key={tag}
              className={`plaque-chip ${
                i === 0 ? "plaque-chip-accent" : "plaque-chip-glass"
              } ${i >= HERO_TAGS_MOBILE || tag === "Биомеханика" ? "max-xl:!hidden" : ""}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex w-full max-w-[612px] flex-col gap-4 text-white xl:gap-[20px]">
          {/* Mobile: ровно 2 строки (hard \\n); 25px/−0.03em чтобы 1-я строка не soft-wrap на 360–390 */}
          <h1 className="w-full whitespace-pre-line font-display text-[25px] font-normal leading-[1.2] tracking-[-0.03em] xl:whitespace-normal xl:text-h1 xl:tracking-normal">
            {`Kochfit — фитнес-школа\nженского здоровья`}
          </h1>
          {/* Mobile: 14px / lh 1.35 / max 320 — 3 hard \\n; xl — text-lead */}
          <p className="w-full max-w-[548px] text-[14px] font-normal leading-[1.35] tracking-[-0.02em] max-xl:mx-auto max-xl:max-w-[320px] xl:mx-0 xl:w-auto xl:max-w-[548px] xl:text-lead xl:leading-[1.45] xl:tracking-normal">
            Система тренировок, которая встраивается в жизнь:
            <br aria-hidden />
            <span className="whitespace-nowrap">от 15-минутной</span> зарядки до силовых
            тренировок
          </p>
        </div>

        </div>

        <div className="flex w-full flex-col gap-2 sm:gap-2.5 xl:absolute xl:left-0 xl:top-[302px] xl:w-auto xl:gap-[16px]">
          {/* Mobile/SM — узкие горизонтальные плашки (стек: bot сверху, glass снизу) */}
          <div className="flex flex-col gap-2 sm:gap-2.5 xl:hidden">
            <a
              href={externalLinks.telegramBot}
              target="_blank"
              rel="noopener noreferrer"
              data-figma-node="2226:2527"
              aria-label="Бот предзаписи, перейти в Telegram"
              className="group/hero-strip flex min-h-[52px] w-full items-center gap-2.5 rounded-md bg-white px-3 py-2 transition hover:bg-surface active:scale-[0.99] sm:gap-3 sm:max-xl:px-[15px] sm:py-2.5"
            >
              <span className="relative size-[36px] shrink-0 sm:size-[40px]">
                <TelegramBadgeIcon className="size-full" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="whitespace-normal text-small font-bold leading-snug text-ink">
                  Бот предзаписи
                </span>
                <span className="whitespace-normal text-small font-normal leading-snug text-ink-secondary">
                  Курс по самым выгодным ценам
                </span>
              </span>
              <HeroGradientArrowButton standalone direction="right" />
            </a>

            <a
              href="#courses"
              data-figma-node="2228:1427"
              className="group/hero-strip flex min-h-0 w-full items-center gap-2 rounded-md border border-solid border-[rgba(239,239,239,0.3)] bg-[rgba(0,0,0,0.13)] px-2 py-1.5 backdrop-blur-[2px] transition hover:bg-[rgba(0,0,0,0.2)] active:scale-[0.99] sm:min-h-[64px] sm:gap-3 sm:max-xl:px-[15px] sm:py-2.5"
            >
              {/* Thumb 56/64: square + object-cover — uniform scale, no rotate/absolute % (those stretched faces) */}
              <span className="relative size-[56px] shrink-0 overflow-hidden rounded-[6px] sm:size-[64px]">
                <img
                  alt=""
                  className="hero-card-photo pointer-events-none size-full object-cover object-[50%_32%]"
                  src={heroGlassCard}
                  width={544}
                  height={264}
                />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:gap-1">
                <span className="inline-flex w-fit max-w-full items-center justify-center rounded-xs bg-surface-blue px-2 py-1">
                  {/* Бейдж — чуть меньше увеличенного: 11px / py-1; thumb 56; desktop xl — .plaque */}
                  <span className="whitespace-nowrap text-[11px] font-semibold leading-none text-accent">
                    {"> 4 000 девушек выбрали Kochfit"}
                  </span>
                </span>
                <span className="whitespace-normal text-caption font-semibold leading-snug text-white sm:text-small">
                  Найди свой курс: 4 программы под разные периоды жизни
                </span>
              </span>
              <HeroGradientArrowButton standalone direction="down" />
            </a>
          </div>

          {/* Desktop xl — полные карточки Figma (bot слева, glass справа) */}
          <div className="hidden items-stretch gap-[16px] xl:flex">
          {/* Карточка бота предзаписи — 2226:2527 (слева на desktop) */}
          <div className="flex w-[288px] flex-col items-start gap-5 rounded-2xl bg-white p-[30px]">
            <div className="flex w-full flex-col items-center gap-[8px]">
              <BotPrelaunchIcons />
              <div className="flex w-full flex-col gap-[8px] text-center">
                <p className="text-body font-bold leading-[normal] text-ink">
                  Бот предзаписи
                </p>
                <p className="whitespace-normal text-small font-normal leading-[normal] text-ink-secondary">
                  Подпишитесь на бот, чтобы приобрести курс по самым выгодным ценам!
                </p>
              </div>
            </div>
            <a
              href={externalLinks.telegramBot}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-auto flex min-h-[44px] w-full items-center justify-center rounded-md px-[64px] py-4"
            >
              <span className="whitespace-nowrap text-center font-display text-body font-bold leading-[1.2] text-white">
                Перейти в бот
              </span>
            </a>
          </div>

          {/* Стеклянная карточка «Найди свой курс» — 2228:1427 (справа на desktop) */}
          <a
            href="#courses"
            data-figma-node="2228:1427"
            className="group/hero-card flex w-[288px] flex-col items-center gap-[12px] rounded-2xl border border-solid border-[rgba(239,239,239,0.3)] bg-[rgba(0,0,0,0.13)] px-2 pb-4 pt-2 backdrop-blur-[2px]"
          >
            <span
              data-figma-node="2228:1428"
              className="relative block h-[132px] w-[272px] shrink-0 overflow-hidden rounded-md"
            >
              {/* Кроп + rotate 345deg как в Figma 2228:1428 */}
              <img
                alt=""
                width={1100}
                height={741}
                decoding="async"
                className="hero-card-photo pointer-events-none absolute left-[-11%] top-[-35%] h-[169.6%] w-[122.2%] max-w-none origin-center rotate-[345deg]"
                src={heroGlassCardDesktop}
              />
            </span>
            <span className="flex w-full items-end gap-[4px] px-[8px]">
              <span className="flex min-w-0 flex-1 flex-col items-start gap-[8px]">
                <span className="plaque plaque-hero-label bg-surface-blue text-accent">
                  {"> 4 000 девушек выбрали Kochfit"}
                </span>
                <span className="max-w-[201px] whitespace-normal text-small font-semibold leading-[normal] text-white">
                  Найди свой курс: 4 программы под разные периоды жизни
                </span>
              </span>
              <HeroCourseArrowButton />
            </span>
          </a>
          </div>
        </div>
      </div>
    </section>
  );
}
