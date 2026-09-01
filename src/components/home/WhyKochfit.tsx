import { assetPath } from "@/lib/asset-path";

const img = (name: string) => assetPath(`/images/home/${name}`);

const CARDS_COUNT = 5;

/* Точки — статический индекс карточки в наборе (не слайд карусели) */
function Dots({ active }: { active: number }) {
  return (
    <span aria-hidden className="flex items-start gap-[4px]">
      {Array.from({ length: CARDS_COUNT }, (_, i) => (
        <span
          key={i}
          className={`block size-[7px] rounded-full bg-ink-muted transition-opacity ${
            i === active ? "" : "opacity-25"
          }`}
        />
      ))}
    </span>
  );
}

function CarouselArrow({ direction }: { direction: "prev" | "next" }) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Прокрутить назад" : "Прокрутить вперёд"}
      {...(direction === "prev"
        ? { "data-carousel-prev": "" }
        : { "data-carousel-next": "" })}
      className="flex size-[44px] shrink-0 items-center justify-center transition hover:opacity-80"
    >
      {/* Поворот живёт на иконке: глобальное button:active{transform:scale(.97)} перетирало transform кнопки и стрелка «переворачивалась» */}
      <img
        loading="lazy"
        alt=""
        width={40}
        height={40}
        className={`block size-[28px] md:size-[32px] xl:size-[40px] ${
          direction === "prev" ? "-rotate-90 -scale-y-100" : "-rotate-90"
        }`}
        src={img("img1.svg")}
      />
    </button>
  );
}

/** «Почему женщины выбирают Kochfit» — Figma 2031:1879 */
export function WhyKochfit() {
  return (
    /* overflow visible: иначе overflow-x-clip режет peek следующей карточки
       по inset колонки, а не по краю экрана. xl: лента до края viewport. */
    <section
      data-figma-node="2031:1879"
      className="relative mx-auto w-full max-w-[1400px] overflow-x-visible overflow-y-visible"
    >
      <div className="mx-auto flex min-w-0 max-w-[1160px] flex-col gap-6 overflow-x-visible xl:flex-row xl:gap-[16px]">
        {/* Заголовок + стрелки — стек на мобиле, колонка слева на десктопе */}
        <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between xl:w-[242px] xl:flex-col xl:items-start xl:justify-between">
          <h2 className="font-display text-h2 font-normal leading-[1.2] text-ink">
            {"Почему женщины"}
            <br aria-hidden className="hidden xl:block" />
            {" выбирают Kochfit"}
          </h2>
          <div className="hidden items-center gap-[8px] xl:flex">
            <CarouselArrow direction="prev" />
            <CarouselArrow direction="next" />
          </div>
        </div>

        {/* Горизонтальная карусель — hscroll-bleed до xl (inset с margin детей,
           не padding скроллера); xl: mr до края viewport, без clamp — иначе
           crop карточки на ~14–40px и серый зазор справа */}
        <div className="min-w-0 w-full overflow-x-visible overflow-y-visible">
          <div
            data-drag-scroll
            /* xl:snap-none — при mandatory-снапе точка привязки последней карточки лежит за maxScroll,
               и браузер откатывает скролл назад, из-за чего до 5-й карточки нельзя доехать драгом */
            className="flex min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-visible scroll-smooth pb-1 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [touch-action:pan-x_pan-y] max-xl:hscroll-bleed xl:mr-[calc((1160px-100vw)/2)] xl:flex-1 xl:hscroll-end-bleed xl:items-start xl:snap-none xl:gap-[16px] [&::-webkit-scrollbar]:hidden"
          >
          {/* Карточка 1 — Figma 2241:5251, h 207 */}
          <article className="relative flex w-[min(242px,78vw)] shrink-0 snap-start flex-col items-start max-xl:justify-between gap-3 rounded-xl bg-white p-[15px] drop-shadow-[var(--shadow-card)] xl:h-[207px] xl:p-[16px] xl:justify-start xl:gap-[78px]">
            <Dots active={0} />
            <div className="flex w-full flex-col gap-[4px]">
              <p className="text-body font-semibold leading-[normal] text-ink">
                {"Программа курса расписана"}
                <br aria-hidden className="hidden xl:block" />
                {" по дням:"}
              </p>
              <p className="text-small font-medium leading-[0] text-ink-secondary">
                <span className="leading-[normal]">{"зарядка, коррекция, силовая. "}</span>
                <br aria-hidden className="hidden xl:block" />
                <span className="leading-[normal] text-ink-muted">
                  {"Открываешь приложение и просто"}
                  <br aria-hidden className="hidden xl:block" />
                  {" начинаешь"}
                </span>
              </p>
            </div>
          </article>

          {/* Карточка 2 — Figma 2241:5261, h 207 */}
          <article className="relative flex w-[min(242px,78vw)] shrink-0 snap-start flex-col items-start max-xl:justify-between gap-3 rounded-xl bg-white p-[15px] drop-shadow-[var(--shadow-card)] xl:h-[207px] xl:p-[16px] xl:justify-start xl:gap-[65px]">
            <span className="xl:hidden">
              <Dots active={1} />
            </span>
            <div className="flex w-full flex-col gap-[12px]">
              <span className="hidden xl:block">
                <Dots active={1} />
              </span>
              <div className="flex w-full flex-col gap-[4px] leading-[normal]">
                <p className="pr-[44px] text-body font-semibold text-ink xl:pr-0">
                  {"Форматы от 15 до 90 минут"}
                </p>
                <p className="text-small font-medium text-ink-secondary">
                  {"Выполняй тренировку, на которую"}
                  <br aria-hidden className="hidden xl:block" />
                  {" сегодня есть время"}
                </p>
              </div>
            </div>
            <span className="why-kochfit-thumb-icon-box absolute right-[15px] top-[15px] block rounded-sm bg-surface-blue xl:relative xl:right-auto xl:top-auto">
              <img loading="lazy"
                alt=""
                width={24}
                height={24}
                className="why-kochfit-thumb-icon absolute block"
                src={img("imgSolarDumbbellsBoldDuotone.svg")}
              />
            </span>
          </article>

          {/* Карточка 3 — Figma 2241:5277, h 207; justify-between — nbsp-переносы чуть выше макета */}
          <article className="relative flex w-[min(242px,78vw)] shrink-0 snap-start flex-col items-start justify-between gap-3 rounded-xl bg-white p-[15px] drop-shadow-[var(--shadow-card)] xl:h-[207px] xl:gap-0 xl:p-[16px] max-xl:min-h-[165px]">
            <div className="why-kochfit-thumb-grid grid w-full items-start gap-x-[8px] xl:items-center">
              <div className="flex min-w-0 flex-col items-start gap-[12px]">
                <Dots active={2} />
                <p className="max-xl:-mb-1 max-xl:mt-[16px] text-body font-semibold leading-[normal] text-ink xl:mb-0 xl:mt-0 xl:pr-0">
                  Курсы под разные периоды жизни
                </p>
              </div>
              <span
                data-figma-node="2241:5287"
                className="why-kochfit-thumb-photo relative block justify-self-end overflow-hidden rounded-[10px]"
              >
                <img
                  loading="lazy"
                  decoding="async"
                  alt=""
                  width={120}
                  height={120}
                  className="absolute left-[-20.71%] top-[-16.08%] size-[143.21%] max-w-none -scale-x-100 object-cover"
                  src={img("imgImage.webp")}
                />
              </span>
            </div>
            <p className="w-full text-small font-medium leading-[0] text-ink-muted">
              <span className="leading-[normal] text-ink-secondary">
                Для каждой, кто хочет здоровое красивое тело в период подготовки, беременности и восстановления после родов
              </span>
            </p>
          </article>

          {/* Карточка 4 — Figma 2241:5289, h 207 */}
          <article className="relative flex w-[min(242px,78vw)] shrink-0 snap-start flex-col items-start max-xl:justify-between gap-3 rounded-xl bg-white p-[15px] drop-shadow-[var(--shadow-card)] xl:h-[207px] xl:p-[16px] xl:justify-start xl:gap-[30px]">
            <Dots active={3} />
            <div className="flex w-full flex-col gap-[12px]">
              <span className="why-kochfit-thumb-icon-box absolute right-[15px] top-[15px] block rounded-sm bg-surface-blue xl:relative xl:right-auto xl:top-auto">
                <span className="why-kochfit-thumb-icon absolute block overflow-hidden">
                  <img loading="lazy"
                    alt=""
                    width={20}
                    height={20}
                    className="absolute inset-[8.33%] block size-auto h-[83%] w-[83%] max-w-none"
                    src={img("imgGroup.svg")}
                  />
                </span>
              </span>
              <div className="flex w-full flex-col gap-[4px] leading-[normal]">
                <p className="pr-[44px] text-body font-semibold text-ink xl:pr-0">
                  {"Не только красиво, "}
                  <br aria-hidden className="hidden xl:block" />
                  {"но и функционально"}
                </p>
                <p className="text-small font-medium text-ink-muted">
                  Работаем с осанкой, дыханием, тазовым дном, биомеханикой суставов и мышечным корсетом
                </p>
              </div>
            </div>
          </article>

          {/* Карточка 5 — Figma 2241:5307, h 207; justify-between — nbsp-переносы чуть выше макета */}
          <article className="relative flex w-[min(242px,78vw)] shrink-0 snap-start flex-col items-start justify-between gap-3 rounded-xl bg-white p-[15px] drop-shadow-[var(--shadow-card)] xl:h-[207px] xl:gap-0 xl:p-[16px] max-xl:min-h-[165px]">
            <div className="why-kochfit-thumb-grid grid w-full items-start gap-x-[8px] xl:items-center">
              <div className="flex min-w-0 flex-col items-start gap-[12px]">
                <Dots active={4} />
                <p className="max-xl:-mb-1 max-xl:mt-[16px] max-xl:pr-[44px] text-body font-semibold leading-[normal] text-ink xl:mb-0 xl:mt-0 xl:max-w-[113px] xl:pr-0">
                  От простого к сложному
                </p>
              </div>
              <span
                data-figma-node="2241:5317"
                className="why-kochfit-thumb-photo relative block justify-self-end overflow-hidden rounded-[10px]"
              >
                <img
                  loading="lazy"
                  decoding="async"
                  alt=""
                  width={120}
                  height={178}
                  className="absolute left-[-0.49%] top-[-15.73%] h-[148.74%] w-full max-w-none object-cover"
                  src={img("imgImage1.webp")}
                />
              </span>
            </div>
            <p className="w-full text-small font-medium leading-[0] text-ink-muted">
              <span className="leading-[normal] text-ink-secondary">
                Система, а не хаотичный набор упражнений. Даём понимание, как связаны дыхание, осанка, живот, таз, стопы и общее самочувствие
              </span>
            </p>
          </article>
        </div>
        </div>
      </div>
    </section>
  );
}
