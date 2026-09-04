"use client";

import { ObstetricProgramModal } from "@/components/pregnancy/ObstetricProgramModal";
import { LcpPreload } from "@/components/site/LcpPreload";
import { CardArrowCta } from "@/components/ui/CardArrowCta";
import { routes } from "@/content/routes";
import { assetPath } from "@/lib/asset-path";
import Link from "next/link";
import { useCallback, useState, type CSSProperties, type ReactNode } from "react";

const img = (name: string) => assetPath(`/images/pregnancy/${name}`);

type ChipCtx = {
  openObstetricProgram: () => void;
};

type Card = {
  node: string;
  image: string;
  imageClass: string;
  gradient: string;
  /** Серая плашка темы; синий CTA — отдельно в `cta` */
  chips: (ctx: ChipCtx) => ReactNode;
  /** Desktop 1200+: текстовый chip рядом с chips */
  cta?: (ctx: ChipCtx) => ReactNode;
  /** Mobile-only круг со стрелкой справа внизу */
  mobileCta?:
    | { label: string; href: string }
    | { label: string; openObstetric: true };
  name: string;
  bullets: string[];
  activeDot: number;
};

/** Плашки: на мобилке чуть выше (py-5), от 1200 как в Figma (py-6). */
const chipClass =
  "inline-flex min-h-0 max-w-full shrink-0 items-center justify-center whitespace-nowrap rounded-[7px] px-[10px] py-[5px] text-center text-[12px] font-semibold leading-none min-[1200px]:py-[6px]";

const grayChip = (text: string) => (
  <span className={`${chipClass} bg-[#f8f8f8] text-[#676971]`}>{text}</span>
);

/** Desktop CTA chip — Figma soft gradient + accent text (не btn-primary). */
const softCtaClass = `${chipClass} text-accent`;
const softCtaStyle = { backgroundImage: "var(--gradient-soft)" } as CSSProperties;

const blueChip = (
  text: string,
  opts?: { href?: string; onClick?: () => void },
) => {
  if (opts?.href) {
    return (
      <Link href={opts.href} className={softCtaClass} style={softCtaStyle}>
        {text}
      </Link>
    );
  }
  if (opts?.onClick) {
    return (
      <button
        type="button"
        onClick={opts.onClick}
        className={softCtaClass}
        style={softCtaStyle}
      >
        {text}
      </button>
    );
  }
  return (
    <span className={softCtaClass} style={softCtaStyle}>
      {text}
    </span>
  );
};

const cards: Card[] = [
  {
    node: "2351:10847",
    image: "imgHf202604291330522E949F7AB5Bd41DdB9FdF7Ecf1D6D7B92.webp",
    imageClass: "absolute inset-0 size-full object-cover",
    gradient: "linear-gradient(to left, rgb(255,255,255) 2.96%, rgba(255,255,255,0) 19.89%)",
    chips: () => grayChip("Тренировки и лекции"),
    cta: () => blueChip("Подробнее ➔", { href: routes.person }),
    mobileCta: { label: "Подробнее", href: routes.person },
    name: "Юлия Кочкина",
    bullets: [
      "Комплексы тренировок для беременных, разные форматы и уровни",
      "Лекции о дыхании и мышцах тазового дна",
      "Доступ к чату с Юлей и другими участницами",
    ],
    activeDot: 0,
  },
  {
    node: "2351:10866",
    image: "imgRectangle2936.png",
    imageClass: "h-[102.33%] w-[163.62%] max-w-none left-[-31.79%] top-[-2.43%] absolute",
    gradient: "linear-gradient(267deg, rgb(255,255,255) 3.85%, rgba(255,255,255,0) 18.02%)",
    chips: () => grayChip("Блок нутрициологии"),
    name: "Дарья Степанова",
    bullets: [
      "Лекция: питание и состояние после родов",
      "Контроль анализов, основные причины проблем",
      "Что принимать маме и малышу, главные добавки",
    ],
    activeDot: 1,
  },
  {
    node: "2351:10882",
    image: "imgRectangle2937.png",
    imageClass: "h-[105.63%] w-[179.89%] max-w-none left-[-26.02%] top-[-4.7%] absolute",
    gradient: "linear-gradient(268deg, rgb(255,255,255) 2.72%, rgba(255,255,255,0) 25.15%)",
    chips: () => grayChip("Блок специалиста по ГВ и сну"),
    name: "Ольга Ермаченко",
    bullets: [
      "Лекции: грудное вскармливание и сон ребёнка",
      "Как понять, достаточно ли молока",
      "Сон ребёнка от рождения до года",
    ],
    activeDot: 2,
  },
  {
    node: "2351:10898",
    image: "imgRectangle2938.webp",
    imageClass: "h-[144.46%] w-[112.46%] max-w-none left-[-9.31%] top-[-22.26%] absolute",
    gradient: "linear-gradient(-90deg, rgb(255,255,255) 0%, rgba(255,255,255,0) 13.98%)",
    chips: () => grayChip("Блок акушера"),
    cta: ({ openObstetricProgram }) =>
      blueChip("Смотреть программу ➔", { onClick: openObstetricProgram }),
    mobileCta: { label: "Смотреть программу", openObstetric: true },
    name: "Мила Войт",
    bullets: [
      "Беременность: изменения, сроки, схватки, когда в роддом",
      "Роды: периоды, облегчение, вмешательства",
      "Послеродовой период: «золотой час», импринтинг, восстановление до 8 недель",
    ],
    activeDot: 3,
  },
  {
    node: "2351:10917",
    image: "imgRectangle2939.png",
    imageClass: "h-[102.84%] w-[131.2%] max-w-none left-[-17.93%] top-[-2.84%] absolute",
    gradient: "linear-gradient(268deg, rgb(255,255,255) 2.23%, rgba(255,255,255,0) 27.14%)",
    chips: () => grayChip("Блок психолога"),
    name: "Юлия Жарова",
    bullets: ["Вебинар: еда, эмоции, стресс"],
    activeDot: 4,
  },
];

function programImageLoading(index: number): "eager" | "lazy" {
  return index < 2 ? "eager" : "lazy";
}

function ProgramCardView({
  card,
  chipCtx,
  index,
}: {
  card: Card;
  chipCtx: ChipCtx;
  index: number;
}) {
  const loading = programImageLoading(index);
  const imgCommon = {
    loading,
    alt: "",
    draggable: false as const,
    src: img(card.image),
    ...(index === 0 ? { fetchPriority: "high" as const } : {}),
  };
  const mobileHref =
    card.mobileCta && "href" in card.mobileCta ? card.mobileCta.href : undefined;
  const mobileOpenObstetric =
    card.mobileCta && "openObstetric" in card.mobileCta
      ? card.mobileCta.openObstetric
      : false;

  return (
    <article
      data-figma-node={card.node}
      className="relative w-[min(300px,85vw)] shrink-0 overflow-visible rounded-[20px] bg-white p-[12px] shadow-[2px_2px_8px_0px_rgba(224,224,224,0.25)] flow-root min-[640px]:max-[1199px]:w-[420px] min-[1200px]:flex min-[1200px]:h-[188px] min-[1200px]:w-[489px] min-[1200px]:flex-row min-[1200px]:items-start min-[1200px]:p-0"
    >
      {/* Mobile ONLY: вся карточка = кликабельная поверхность (десктоп не трогаем). */}
      {mobileHref ? (
        <Link
          href={mobileHref}
          aria-label={card.mobileCta!.label}
          className="absolute inset-0 z-10 rounded-[20px] min-[1200px]:hidden"
        />
      ) : null}
      {mobileOpenObstetric ? (
        <button
          type="button"
          aria-label={card.mobileCta!.label}
          onClick={chipCtx.openObstetricProgram}
          className="absolute inset-0 z-10 cursor-pointer rounded-[20px] min-[1200px]:hidden"
        />
      ) : null}
      {/* Mobile: квадрат float-right — чипы/имя/список обтекают (как InsideCourse). */}
      <span className="relative float-right mb-[6px] ml-[10px] block size-[60px] overflow-hidden rounded-[10px] bg-[#edf4f9] min-[1200px]:hidden">
        <img
          {...imgCommon}
          className="absolute inset-0 size-full max-w-none object-cover object-[50%_20%] [-webkit-user-drag:none]"
        />
      </span>
      {/* Desktop 1200+: квадрат 180×180 слева — Figma top/left 4px */}
      <span className="relative m-[4px] hidden size-[180px] shrink-0 overflow-hidden rounded-l-[16px] min-[1200px]:block">
        <img
          {...imgCommon}
          className={`[-webkit-user-drag:none] ${card.imageClass}`}
        />
        <span
          className="absolute inset-0 rounded-l-[16px]"
          style={{ backgroundImage: card.gradient } as CSSProperties}
        />
      </span>
      <span className="absolute left-[68px] top-[165px] hidden items-start gap-[4px] min-[1200px]:flex">
        {Array.from({ length: 5 }, (_, d) => (
          <span
            key={d}
            className={`block size-[7px] rounded-[100px] bg-white ${
              d === card.activeDot ? "" : "opacity-25"
            }`}
          />
        ))}
      </span>
      {/* Mobile: contents — дети обтекают float. Desktop 1200+: колонка w-277, pt-12
          (Figma chips y:12, left:196). Без pr — иначе chip-ряд сжимается и CTA у Войт переносится. */}
      <div className="max-[1199px]:contents min-[1200px]:ml-[8px] min-[1200px]:flex min-[1200px]:w-[277px] min-[1200px]:flex-none min-[1200px]:flex-col min-[1200px]:items-start min-[1200px]:gap-[2px] min-[1200px]:self-start min-[1200px]:overflow-visible min-[1200px]:pt-[12px]">
        <div className="mb-[6px] flex min-w-0 flex-wrap items-center gap-[6px] min-[1200px]:flex-nowrap">
          {card.chips(chipCtx)}
          {/* Desktop ONLY: текстовый CTA рядом с chips — как в Figma */}
          {card.cta ? (
            <span className="hidden min-[1200px]:contents">{card.cta(chipCtx)}</span>
          ) : null}
        </div>
        <p className="mb-[10px] min-w-0 [text-wrap:wrap] text-[14px] font-semibold leading-[18px] text-[#4b4d57] min-[1200px]:mb-[8px]">
          {card.name}
        </p>
        <ul className="list-disc space-y-[8px] break-words pl-[18px] text-[12px] font-normal leading-[16px] text-[#676971] [text-wrap:wrap] min-[1200px]:space-y-0 min-[1200px]:leading-[18px]">
          {card.bullets.map((bullet) => (
            <li key={bullet} className="break-words leading-[16px] min-[1200px]:leading-[18px]">
              {bullet}
            </li>
          ))}
        </ul>
        {/* Mobile ONLY: запас под абсолютный круг */}
        {card.mobileCta ? (
          <div className="mt-2 h-[28px] clear-both min-[1200px]:hidden" aria-hidden />
        ) : null}
      </div>
      {/* Mobile ONLY: круг со стрелкой — декоративный, клик ловит overlay выше */}
      {card.mobileCta ? (
        <CardArrowCta
          label={card.mobileCta.label}
          decorative
          className="pointer-events-none z-[11] min-[1200px]:hidden"
        />
      ) : null}
    </article>
  );
}

/** «Программа курса» — лента из 5 карточек экспертов, Figma 2351:10844 */
export function PregnancyProgram() {
  const [obstetricOpen, setObstetricOpen] = useState(false);
  const openObstetricProgram = useCallback(() => setObstetricOpen(true), []);
  const closeObstetricProgram = useCallback(() => setObstetricOpen(false), []);
  const chipCtx: ChipCtx = { openObstetricProgram };
  const firstImage = cards[0]!.image;

  return (
    <section id="program" className="mx-auto w-full max-w-[1160px] overflow-x-visible">
      <LcpPreload
        href={`/images/pregnancy/${firstImage}`}
        type={firstImage.endsWith(".png") ? "image/png" : "image/webp"}
      />
      <h2 className="font-display text-[22px] font-normal leading-[1.25] text-ink lg:text-[25px] lg:leading-[1.2]">
        Программа курса
      </h2>
      <div
        data-drag-scroll
        className="mt-6 flex min-w-0 items-stretch gap-5 overflow-x-auto overflow-y-visible pb-1 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [touch-action:pan-x_pan-y] max-[1199px]:hscroll-bleed sm:mt-[41px] min-[1200px]:hscroll-end min-[1200px]:w-[calc(50%+50vw)] min-[1200px]:max-w-none [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card, index) => (
          <ProgramCardView key={card.node} card={card} chipCtx={chipCtx} index={index} />
        ))}
      </div>
      <ObstetricProgramModal open={obstetricOpen} onClose={closeObstetricProgram} />
    </section>
  );
}
