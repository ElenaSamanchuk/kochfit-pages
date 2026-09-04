import { assetPath } from "@/lib/asset-path";
import { ChipBadgeRows } from "@/components/ui/ChipBadgeRows";
import { FeatureCheckIcon } from "@/components/ui/FeatureCheckIcon";
import { FeatureToggleCard } from "@/components/ui/FeatureToggleCard";
import { PhoneStack } from "@/components/ui/PhoneMockup";

const img = (name: string) => assetPath(`/images/home/${name}`);

const chips = [
  "Удобно проходить",
  "Легко возвращаться",
  "Всё под рукой",
  "С телефона / ноутбука / в своём темпе",
];

const featuresLeft = [
  {
    title: "Все материалы в одном месте",
    text: "Тренировки, дополнительные уроки и полезные материалы собраны в личном кабинете и мобильном приложении",
  },
  {
    title: "Можно заниматься в своём ритме",
    text: "Записи доступны в удобное время, поэтому не нужно подстраивать жизнь под расписание",
  },
];

const featuresRight = [
  {
    title: "Подходит под разный уровень",
    text: "Можно заходить плавно с уровня 1 и по мере вашей готовности доходить до уровня 3",
  },
  {
    title: "Формат «Следуй за мной»",
    text: "От первой до последней минуты каждой тренировки я не только показываю, но и проговариваю каждое движение, создавая эффект присутствия",
  },
];

const chipNode = (label: string) => (
  <span className="plaque-feature plaque-feature-platform">
    <FeatureCheckIcon />
    {label}
  </span>
);

/** «Платформа и формат прохождения» — Figma 2262:2608 */
export function PlatformSection() {
  return (
    <section
      data-figma-node="2262:2608"
      className="relative mx-auto flex w-full max-w-[1160px] flex-col items-center gap-8 sm:gap-10 xl:gap-[218px]"
    >
      {/* Декоративные круги — Figma 2262:2609, только десктоп */}
      <span
        aria-hidden
        className="absolute bottom-[84px] left-[184.84px] hidden h-[320.847px] w-[792.419px] xl:block"
      >
        <img
          loading="lazy"
          alt=""
          className="absolute inset-[-7.57%_-3.06%_-7.33%_-2.09%] block size-auto h-[115%] w-[105%] max-w-none"
          src={img("imgGroup2085665813.svg")}
        />
      </span>
      <span
        aria-hidden
        className="absolute bottom-[156.5px] left-[13.84px] hidden h-[390.5px] w-[1135.481px] xl:block"
      >
        <img
          loading="lazy"
          alt=""
          className="absolute inset-[-6.22%_-2.13%_-6.06%_-2.12%] block size-auto h-[112%] w-[104%] max-w-none"
          src={img("imgGroup2085665812.svg")}
        />
      </span>

      {/* Figma 2262:2616 */}
      <div className="relative flex w-full max-w-[508px] flex-col items-center gap-6 sm:gap-10 xl:gap-[40px]">
        <h2 className="w-full text-center font-display text-[22px] font-normal leading-[1.25] text-ink xl:text-[24px] xl:leading-[1.2]">
          Платформа и формат прохождения
        </h2>
        <ChipBadgeRows
          rows={[
            chips.slice(0, 2).map((chip) => ({ key: chip, node: chipNode(chip) })),
            chips.slice(2, 4).map((chip) => ({ key: chip, node: chipNode(chip) })),
          ]}
        />
      </div>

      {/* Figma 2262:2639 — карточка + телефон */}
      <div className="relative flex w-full flex-col items-center gap-6 sm:gap-8 xl:min-h-[298px] xl:gap-0">
        {/* Figma 2262:2640 — белая карточка (в DOM первой, как в макете) */}
        <div className="relative z-0 flex w-full max-w-[1160px] flex-col gap-5 rounded-3xl bg-white p-[15px] sm:gap-10 sm:p-8 xl:h-[298px] xl:flex-row xl:flex-wrap xl:content-center xl:items-center xl:justify-between xl:gap-y-10 xl:p-[50px]">
          <div className="flex w-full flex-col items-start gap-5 sm:gap-8 xl:w-[351px] xl:gap-10">
            {featuresLeft.map((feature) => (
              <FeatureToggleCard
                key={feature.title}
                title={feature.title}
                text={feature.text}
              />
            ))}
          </div>

          <div className="flex w-full flex-col items-start gap-5 sm:gap-8 xl:w-[351px] xl:gap-10">
            {featuresRight.map((feature) => (
              <FeatureToggleCard
                key={feature.title}
                title={feature.title}
                text={feature.text}
              />
            ))}
          </div>

          {/* Мобилка: мокап под всеми пунктами. На xl телефон абсолютный — см. блок ниже */}
          <div
            aria-hidden
            className="relative mx-auto aspect-[352/482] w-[min(300px,78vw)] overflow-hidden sm:w-[min(330px,72vw)] xl:hidden"
          >
            <PhoneStack
              img={img}
              phoneFigmaNode="2262:2664"
              screenFigmaNode="2262:2668"
              responsive
              className="absolute inset-x-0 top-0 aspect-[352/522] w-full"
            />
            {/* Аналог дымки 2262:2674: корпус растворяется в белой карточке сразу под таб-баром */}
            <span
              data-figma-node="2262:2674"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[22%] bg-gradient-to-t from-white from-50% to-transparent"
            />
          </div>
        </div>

        {/* Figma 2262:2663 — телефон по центру макета (left 375px), не useScreenMask: экран 2262:2668 imgMask */}
        <div
          aria-hidden
          className="hidden xl:pointer-events-none xl:absolute xl:left-[375px] xl:top-[-203px] xl:mx-0 xl:block xl:h-[522px] xl:w-[352px] xl:max-w-none xl:overflow-visible"
        >
          <PhoneStack
            img={img}
            phoneFigmaNode="2262:2664"
            fadeFigmaNode="2262:2674"
            screenFigmaNode="2262:2668"
            responsive
            fadeVariant="platform"
            className="relative mx-auto aspect-[352/522] w-full xl:aspect-auto xl:h-full xl:w-full"
          />
        </div>
      </div>
    </section>
  );
}
