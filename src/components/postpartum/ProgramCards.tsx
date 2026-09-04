import { CardArrowCta } from "@/components/ui/CardArrowCta";
import { LcpPreload } from "@/components/site/LcpPreload";
import { routes } from "@/content/routes";
import { assetPath } from "@/lib/asset-path";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

const img = (name: string) => assetPath(`/images/postpartum/${name}`);

/** Плашки: на мобилке чуть выше (py-5), xl как в Figma (py-6). */
const chipClass =
  "inline-flex min-h-0 items-center justify-center whitespace-nowrap rounded-[7px] px-[10px] py-[5px] text-center text-[12px] font-semibold leading-none xl:py-[6px]";

type Card = {
  node: string;
  image: string;
  /** Стили кропа исходного фото внутри рамки 180×180 */
  imageClass: string;
  gradient: string;
  /** Серая плашка темы; синий CTA — отдельно в `cta` */
  chips: ReactNode;
  /** «Подробнее»: desktop xl — рядом с chips; mobile — круг со стрелкой справа внизу */
  cta?: () => ReactNode;
  /** Mobile-only circle CTA (не трогает desktop) */
  mobileCta?: { label: string; href: string };
  name: string;
  bullets: string[];
  activeDot: number;
};

const cards: Card[] = [
  {
    node: "2042:9251",
    image: "imgHf202604291330522E949F7AB5Bd41DdB9FdF7Ecf1D6D7B92.webp",
    imageClass: "size-full object-cover",
    gradient:
      "linear-gradient(to left, rgb(255,255,255) 2.96%, rgba(255,255,255,0) 19.89%)",
    chips: (
      <span className={`${chipClass} bg-[#f8f8f8] text-[#676971]`}>
        Тренировки и лекции
      </span>
    ),
    cta: () => (
      <Link
        href={routes.person}
        className={`${chipClass} text-accent`}
        style={{ backgroundImage: "var(--gradient-soft)" } as CSSProperties}
      >
        Подробнее ➔
      </Link>
    ),
    mobileCta: { label: "Подробнее", href: routes.person },
    name: "Юлия Кочкина",
    bullets: [
      "Тренировки и комплексы для послеродового восстановления",
      "Лекции о дыхании и мышцах тазового дна",
      "Работа с диастазом, осанкой, рубцами",
      "Доступ к чату с Юлей и другими участницами",
    ],
    activeDot: 0,
  },
  {
    node: "2042:9269",
    image: "imgHeroImage.png",
    imageClass: "h-[102.33%] w-[163.62%] max-w-none left-[-31.79%] top-[-2.43%] absolute",
    gradient:
      "linear-gradient(267deg, rgb(255,255,255) 3.85%, rgba(255,255,255,0) 18.02%)",
    chips: (
      <span className={`${chipClass} bg-[#f8f8f8] text-[#676971]`}>
        Блок нутрициологии
      </span>
    ),
    name: "Дарья Степанова",
    bullets: [
      "Лекция: питание и состояние после родов",
      "Состояние мамы в послеродовом периоде, контроль анализов",
      "Основные добавки для мамы и малыша, что реально нужно",
    ],
    activeDot: 1,
  },
  {
    node: "2042:9283",
    image: "imgHeroImage1.png",
    imageClass: "h-[105.63%] w-[179.89%] max-w-none left-[-26.02%] top-[-4.7%] absolute",
    gradient:
      "linear-gradient(268deg, rgb(255,255,255) 2.72%, rgba(255,255,255,0) 25.15%)",
    chips: (
      <span className={`${chipClass} bg-[#f8f8f8] text-[#676971]`}>
        Блок специалиста по ГВ и сну
      </span>
    ),
    name: "Ольга Ермаченко",
    bullets: [
      "Лекции: грудное вскармливание и сон ребёнка",
      "Как понять, достаточно ли молока",
      "Сон ребёнка от рождения до года",
    ],
    activeDot: 2,
  },
];

function programImageLoading(index: number): "eager" | "lazy" {
  return index < 2 ? "eager" : "lazy";
}

function ProgramCardView({ card, index }: { card: Card; index: number }) {
  const loading = programImageLoading(index);
  const imgCommon = {
    loading,
    alt: "",
    draggable: false as const,
    src: img(card.image),
    ...(index === 0 ? { fetchPriority: "high" as const } : {}),
  };

  return (
    <article
      data-figma-node={card.node}
      className="relative w-[min(300px,85vw)] shrink-0 overflow-visible rounded-[20px] bg-white p-[12px] shadow-[2px_2px_8px_0px_rgba(224,224,224,0.25)] flow-root sm:w-[420px] xl:flex xl:h-[188px] xl:w-[489px] xl:flex-row xl:items-start xl:p-0"
    >
      {/* Mobile ONLY: вся карточка = кликабельная поверхность (десктоп не трогаем). */}
      {card.mobileCta ? (
        <Link
          href={card.mobileCta.href}
          aria-label={card.mobileCta.label}
          className="absolute inset-0 z-10 rounded-[20px] xl:hidden"
        />
      ) : null}
      {/* Mobile: квадрат float-right — чипы/имя/список обтекают (как InsideCourse). */}
      <span className="relative float-right mb-[6px] ml-[10px] block size-[60px] overflow-hidden rounded-[10px] bg-[#edf4f9] xl:hidden">
        <img
          {...imgCommon}
          className="absolute inset-0 size-full max-w-none object-cover object-[50%_20%] [-webkit-user-drag:none]"
        />
      </span>
      {/* Desktop xl: квадрат 180×180 слева — Figma top/left 4px. Кроп imageClass не трогаем. */}
      <span className="relative m-[4px] hidden size-[180px] shrink-0 overflow-hidden rounded-l-[16px] xl:block">
        <img
          {...imgCommon}
          className={`[-webkit-user-drag:none] ${card.imageClass}`}
        />
        <span
          className="absolute inset-0 rounded-l-[16px]"
          style={{ backgroundImage: card.gradient } as CSSProperties}
        />
      </span>
      <span className="absolute left-[80px] top-[165px] hidden items-start gap-[4px] xl:flex">
        {Array.from({ length: 3 }, (_, d) => (
          <span
            key={d}
            className={`block size-[7px] rounded-[100px] bg-white ${
              d === card.activeDot ? "" : "opacity-25"
            }`}
          />
        ))}
      </span>
      {/* Mobile: contents — дети обтекают float. Desktop xl: колонка w-277, pt-12
          (Figma chips y:12, left:196). Без pr — иначе chip-ряд сжимается и CTA переносится. */}
      <div className="max-xl:contents xl:ml-[8px] xl:flex xl:w-[277px] xl:flex-none xl:flex-col xl:items-start xl:gap-[2px] xl:self-start xl:overflow-visible xl:pt-[12px]">
        <div className="mb-[6px] flex min-w-0 flex-wrap items-center gap-[6px] xl:flex-nowrap">
          {card.chips}
          {/* Desktop ONLY: текстовый CTA рядом с chips — как в Figma */}
          {card.cta ? <span className="hidden xl:contents">{card.cta()}</span> : null}
        </div>
        <p className="min-w-0 text-[14px] font-semibold leading-[18px] text-[#4b4d57] xl:mb-[8px]">
          {card.name}
        </p>
        <ul className="mt-1.5 list-disc space-y-[8px] pl-[18px] text-[12px] font-normal leading-[16px] text-[#676971] xl:mt-0 xl:space-y-0 xl:leading-[18px]">
          {card.bullets.map((bullet) => (
            <li key={bullet} className="leading-[16px] xl:leading-[18px]">
              {bullet}
            </li>
          ))}
        </ul>
        {/* Mobile ONLY: запас под абсолютный круг (не в xl flex-колонке) */}
        {card.mobileCta ? (
          <div className="mt-2 h-[28px] clear-both xl:hidden" aria-hidden />
        ) : null}
      </div>
      {/* Mobile ONLY: круг со стрелкой — декоративный, клик ловит overlay выше */}
      {card.mobileCta ? (
        <CardArrowCta
          label={card.mobileCta.label}
          decorative
          className="pointer-events-none z-[11] xl:hidden"
        />
      ) : null}
    </article>
  );
}

/** «Программа курса» — лента карточек экспертов, Figma 2042:9249 */
export function ProgramCards() {
  const firstImage = cards[0]!.image;

  return (
    <section id="program" className="mx-auto w-full max-w-[1160px] overflow-x-visible">
      <LcpPreload
        href={`/images/postpartum/${firstImage}`}
        type={firstImage.endsWith(".png") ? "image/png" : "image/webp"}
      />
      <h2 className="font-display text-[22px] font-normal leading-[1.25] text-ink lg:text-[24px] lg:leading-[1.2]">
        Программа курса
      </h2>
      {/* Карточки — прямые дети скроллера: hscroll-bleed ставит inset через margin
          first/last, без padding-inline (иначе Chromium режет карточку на свайпе). */}
      <div
        data-drag-scroll
        className="mt-6 flex min-w-0 items-stretch gap-5 overflow-x-auto overflow-y-visible pb-1 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [touch-action:pan-x_pan-y] max-xl:hscroll-bleed sm:mt-[41px] xl:hscroll-end xl:w-[calc(50%+50vw)] xl:max-w-none [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card, index) => (
          <ProgramCardView key={card.node} card={card} index={index} />
        ))}
      </div>
    </section>
  );
}
