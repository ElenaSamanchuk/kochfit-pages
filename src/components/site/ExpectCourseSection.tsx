import { assetPath } from "@/lib/asset-path";
import { FeatureCheckIcon } from "@/components/ui/FeatureCheckIcon";
import { PhoneMockup, PhoneStack } from "@/components/ui/PhoneMockup";

/** Якорь на блок тарифов той же страницы — не checkout, не новая вкладка. */
const TARIFFS_HASH = "#tariffs";

function expectChipNode(chip: ExpectChip, compact = false) {
  const label = compact && chip.mobileText ? chip.mobileText : chip.text;
  return (
    <span
      className={compact ? "plaque-feature plaque-feature-expect-mobile" : "plaque-feature"}
      {...(compact && chip.mobileText && chip.mobileText !== chip.text
        ? { title: chip.text, "aria-label": chip.text }
        : {})}
    >
      <FeatureCheckIcon
        className={`block shrink-0 ${compact ? "size-[11px]" : "size-[13px] lg:size-[13px]"}`}
      />
      <span className={compact ? "shrink-0" : "min-w-0 truncate"}>{label}</span>
    </span>
  );
}

/** Мобила: до 3 строк; внутри строки — flex-wrap. 5 → 2+1+2 (не 2+2+1: пара на ~390px ломается в 4 ряда). */
function mobileChipRows(chips: ExpectChip[]): ExpectChip[][] {
  const n = chips.length;
  if (n <= 2) return n === 0 ? [] : [chips];
  if (n === 3) return [chips.slice(0, 2), chips.slice(2)];
  if (n === 4) return [chips.slice(0, 2), chips.slice(2)];
  if (n === 5) return [chips.slice(0, 2), chips.slice(2, 3), chips.slice(3)];
  const rows: ExpectChip[][] = [];
  for (let i = 0; i < n; i += 2) rows.push(chips.slice(i, i + 2));
  return rows;
}

export type ExpectChip = {
  icon: string;
  text: string;
  /** Короткая подпись только для мобильной сетки 2+2(+1); desktop — полный `text`. */
  mobileText?: string;
  hideOnMobile?: boolean;
};

export type ExpectStep = { title: string; text: React.ReactNode };

const defaultSteps: ExpectStep[] = [
  {
    title: "1 шаг",
    text: "Купите тариф, получите доступ к личному кабинету",
  },
  {
    title: "2 шаг",
    text: (
      <>
        {"Занимайтесь по 20–30 минут "}
        <br aria-hidden />в день, в своём темпе
      </>
    ),
  },
  {
    title: "3 шаг",
    text: (
      <>
        {"Заходите с телефона "}
        <br aria-hidden />
        или ноутбука в удобное время
      </>
    ),
  },
];

function StepDots({ active, className }: { active: number; className?: string }) {
  return (
    <span className={`flex items-start gap-[4px]${className ? ` ${className}` : ""}`}>
      {Array.from({ length: 3 }, (_, d) => (
        <span
          key={d}
          className={`block size-[7px] rounded-[100px] bg-[#999ca8] ${d === active ? "" : "opacity-25"}`}
        />
      ))}
    </span>
  );
}

/** Экран 2031:2602 в контейнере 352×522: Figma left 57.21 / width 267.26 → 16.25% / 75.93%.
 *  Перебивает общие 16.19%/75.85% из PhoneMockup, чтобы контент сидел по центру корпуса
 *  (беззел ~11px слева и справа), не трогая PlatformSection. */
const courseScreenAlignClass =
  "[&_[data-figma-node='2031:2602']]:left-[16.25%] [&_[data-figma-node='2031:2602']]:w-[75.93%]";

/**
 * «Что вас ждет на курсе» + «Как начать?» с мокапом iPhone —
 * общая секция страниц курсов (Figma 2031:2534 / 2031:2877 и др.).
 * Экран телефона — imgChangeThis1.png через SVG-маску, контейнер 267×478 (как Platform).
 * lg+ — пиксель-в-пиксель абсолютный макет, ниже lg — мобильный стек.
 */
export function ExpectCourseSection({
  figmaNode,
  imageDir,
  chipsRow1,
  chipsRow2,
  steps = defaultSteps,
}: {
  figmaNode: string;
  /** Папка в /public/images с ассетами страницы (Shadow, iPhone, ChangeThis) */
  imageDir: string;
  chipsRow1: ExpectChip[];
  chipsRow2: ExpectChip[];
  /** Шаги «Как начать?»; по умолчанию — общие для всех курсов. */
  steps?: ExpectStep[];
}) {
  const img = (name: string) => assetPath(`/images/${imageDir}/${name}`);

  return (
    <section
      data-figma-node={figmaNode}
      className="relative mx-auto w-full max-w-[1160px] overflow-x-clip rounded-[24px] lg:h-[514px] lg:overflow-visible lg:rounded-[32px]"
    >
      {/* ——— Desktop (lg+): исходный абсолютный макет Figma ——— */}
      <div className="hidden lg:block">
        <span className="absolute inset-x-0 top-[67px] block h-[447px] rounded-[32px] bg-[#edf4f9]" />

        {/* Белая панель «Как начать?» */}
        <div className="absolute inset-x-0 top-[269px] h-[245px] overflow-hidden rounded-[28px] bg-white">
          <h3 className="absolute left-[40px] top-[40px] whitespace-nowrap font-display text-[24px] font-normal leading-[1.2] text-[#4b4d57]">
            Как начать?
          </h3>
          <div className="absolute left-[40px] top-[99px] flex items-stretch gap-[20px]">
            {steps.map((step, i) => (
              <article
                key={step.title}
                className="flex w-[228px] flex-col items-start gap-[20px] rounded-[16px] border border-solid border-[#efefef] bg-white p-[16px]"
              >
                <div className="flex w-full items-center">
                  <p className="whitespace-nowrap text-[16px] font-semibold leading-[normal] text-[#4b4d57]">
                    {step.title}
                  </p>
                  <StepDots active={i} className="ml-auto shrink-0" />
                </div>
                <p className="w-full text-[12px] font-normal leading-[normal] text-[#999ca8]">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>

        <h2 className="absolute left-[40px] top-[107px] w-[670px] font-display text-[24px] font-normal leading-[1.2] text-ink">
          Что вас ждет на курсе
        </h2>
        <div className="absolute left-[40px] top-[169px] flex items-center gap-[12px]">
          {chipsRow1.map((chip) => (
            <span key={chip.text}>{expectChipNode(chip)}</span>
          ))}
        </div>
        <div className="absolute left-[40px] top-[206px] flex items-center gap-[12px]">
          {chipsRow2.map((chip) => (
            <span key={chip.text}>{expectChipNode(chip)}</span>
          ))}
        </div>

        {/* Phone stack — Figma 2031:2594 справа (left 769px); экран 2031:2602; дымка 2031:2604 */}
        <PhoneStack
          img={img}
          phoneFigmaNode="2031:2594"
          fadeFigmaNode="2031:2604"
          screenFigmaNode="2031:2602"
          useScreenMask
          responsive
          fadeVariant="course"
          className={`pointer-events-none absolute left-[769px] top-[-11px] z-10 h-[522px] w-[352px] overflow-visible ${courseScreenAlignClass}`}
        />

        <a
          href={TARIFFS_HASH}
          className="absolute left-[856px] top-[425px] z-30 flex items-center justify-center rounded-[12px] px-[32px] py-[14px]"
          style={{
            backgroundImage:
              "var(--gradient-primary)",
          }}
        >
          <span className="whitespace-nowrap text-center font-display text-[14px] font-semibold leading-[1.2] text-white">
            Купить курс сейчас
          </span>
        </a>
      </div>

      {/* ——— Mobile (<lg): вертикальный стек ——— */}
      <div className="flex flex-col gap-6 rounded-[24px] bg-[#edf4f9] p-[15px] pt-[28px] lg:hidden">
        <h2 className="text-center font-display text-[22px] font-normal leading-[1.25] text-ink">
          Что вас ждет на курсе
        </h2>
        {/* До 3 строк на ~390px: flex-wrap в одном контейнере; разрывы — basis-full. Desktop — выше. */}
        <div className="flex w-full flex-wrap items-center justify-center gap-1.5">
          {mobileChipRows(
            [...chipsRow1, ...chipsRow2].filter((chip) => !chip.hideOnMobile),
          ).flatMap((row, rowIndex) => [
            ...(rowIndex > 0
              ? [
                  <span
                    key={`break-${rowIndex}`}
                    className="h-0 basis-full"
                    aria-hidden
                  />,
                ]
              : []),
            ...row.map((chip) => (
              <span key={chip.text} className="inline-flex w-auto max-w-full">
                {expectChipNode(chip, true)}
              </span>
            )),
          ])}
        </div>

        {/* Белая карточка: заголовок → шаги → мокап → CTA (как desktop: кнопка под мокапом) */}
        <div
          data-expect="start-card"
          className="relative flex flex-col gap-[16px] rounded-[20px] bg-white p-[15px]"
        >
          <h3 className="font-display text-[20px] font-normal leading-[1.25] text-[#4b4d57]">
            Как начать?
          </h3>
          <div className="flex flex-col gap-2">
            {steps.map((step, i) => (
              <article
                key={step.title}
                className="flex flex-col items-start gap-2 rounded-[16px] border border-solid border-[#efefef] bg-white p-[15px]"
              >
                <div className="flex w-full items-start justify-between gap-3">
                  <p className="text-[16px] font-semibold leading-[normal] text-[#4b4d57]">
                    {step.title}
                  </p>
                  <StepDots active={i} className="shrink-0" />
                </div>
                <p className="w-full text-[12px] font-normal leading-[1.35] text-[#999ca8]">
                  {step.text}
                </p>
              </article>
            ))}
          </div>

          {/* Phone + CTA: кнопка поверх низа мокапа; ширина — на всю карточку (как раньше) */}
          <div className="relative">
            <div
              aria-hidden
              data-expect="phone"
              className="pointer-events-none relative mx-auto h-[312px] w-[210px] overflow-hidden"
            >
              <div
                className={`absolute left-0 top-0 h-[522px] w-[352px] origin-top-left scale-[0.5977] ${courseScreenAlignClass}`}
              >
                <PhoneMockup
                  img={img}
                  figmaNode="2031:2594"
                  screenFigmaNode="2031:2602"
                  useScreenMask
                  responsive
                />
              </div>
              {/* Аналог дымки 2031:2604 (desktop PhoneBottomFade): низ корпуса растворяется в белой карточке */}
              <span
                data-figma-node="2031:2604"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[28%] bg-gradient-to-t from-white from-45% to-transparent"
              />
            </div>

            <a
              href={TARIFFS_HASH}
              className="absolute bottom-[18px] left-0 right-0 z-30 flex min-h-[44px] w-full items-center justify-center rounded-[12px] font-semibold px-10 py-[12px]"
              style={{
                backgroundImage:
                  "var(--gradient-primary)",
              }}
            >
              <span className="whitespace-nowrap text-center font-display text-[14px] font-semibold leading-[1.2] text-white">
                Купить курс сейчас
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
