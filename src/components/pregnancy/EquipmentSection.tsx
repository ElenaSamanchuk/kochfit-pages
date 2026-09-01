"use client";

import { useCallback, useState, type ReactNode } from "react";
import { EquipmentImportance } from "@/components/equipment/EquipmentImportance";
import { EquipmentModal } from "@/components/equipment/EquipmentModal";
import { equipmentItems, type EquipmentItem } from "@/content/equipment";
import { assetPath } from "@/lib/asset-path";
import { Typo } from "@/components/ui/TypoText";

const img = (name: string) => assetPath(`/images/equipment/${name}`);

type EquipmentCard = {
  id: string;
  image: string;
  imageClass?: string;
  chip: "all" | "correction";
  chipText: string;
  title: ReactNode;
  importance: number;
  description: string;
  replacement: string;
  buttonText: string;
};

const cards: EquipmentCard[] = [
  {
    id: "mat",
    image: "mat.webp",
    imageClass:
      "size-full rounded-[8px] object-cover max-xl:scale-[1.12] max-xl:origin-[78%_center] xl:scale-100 xl:origin-center",
    chip: "all",
    chipText: "Для всех тренировок",
    title: "Коврик для фитнеса",
    importance: 98,
    description:
      "Создаёт комфорт и устойчивость во время занятий, снижает нагрузку на суставы и предотвращает скольжение, обеспечивая безопасное и эффективное выполнение упражнений",
    replacement: "Можно заниматься на ковре без спортивного коврика",
    buttonText: "Ссылки, рекомендации",
  },
  {
    id: "balls",
    image: "balls.webp",
    imageClass:
      "absolute h-[133.89%] left-[-0.01%] max-w-none top-[-16.65%] w-[115.43%] object-cover max-xl:inset-0 max-xl:h-full max-xl:w-full max-xl:left-0 max-xl:top-0 max-xl:scale-[1.3] max-xl:origin-[102%_center] max-xl:translate-x-[24%] max-xl:object-[100%_center] xl:scale-100 xl:translate-x-0 xl:origin-center xl:object-center",
    chip: "correction",
    chipText: "Коррекция",
    title: "Мягкие массажные мячи (мячи Франклина), 2 шт.",
    importance: 85,
    description:
      "Для выполнения упражнения вам потребуются два массажных мяча одинакового размера, диаметром примерно 10–12 см",
    /** Перенос как в макете (lg 376px): «…мягкие» → «мячи» */
    replacement: "Мяч для большого тенниса / детские шипованные мягкие\nмячи",
    buttonText: "Ссылки",
  },
  {
    id: "band",
    image: "band.webp",
    imageClass:
      "absolute h-[150.91%] left-[0.04%] max-w-none top-[-25.44%] w-[117.52%] object-cover max-xl:inset-0 max-xl:h-full max-xl:w-full max-xl:left-0 max-xl:top-0 max-xl:scale-[1.3] max-xl:origin-[102%_center] max-xl:translate-x-[24%] max-xl:object-[100%_center] xl:scale-100 xl:translate-x-0 xl:origin-center xl:object-center",
    chip: "all",
    chipText: "Для всех тренировок",
    title: "Пилатес-лента от 180 см",
    importance: 60,
    description:
      "Оптимальная длина, от 180 до 200 см, что обеспечивает комфорт и удобство в использовании",
    replacement:
      "Шарф или пояс. Но наиболее удобным и эффективным решением всё же остаётся специальная лента",
    buttonText: "Ссылки",
  },
  {
    id: "pilates-ball",
    image: "pilates-ball.webp",
    imageClass:
      "absolute h-[174.77%] left-[0.03%] max-w-none top-[-40.57%] w-[114.53%] object-cover max-xl:inset-0 max-xl:h-full max-xl:w-full max-xl:left-0 max-xl:top-0 max-xl:scale-[1.15] max-xl:origin-[84%_center] xl:scale-100 xl:origin-center",
    chip: "correction",
    chipText: "Коррекция",
    title: "Мяч для пилатеса, d - 25/50 см",
    importance: 20,
    description:
      "Мяч для пилатеса диаметром около 25 см предназначен для упражнений на развитие координации и проработку мышечного корсета",
    replacement: "Надувной детский мяч",
    buttonText: "Ссылки",
  },
];

function itemById(id: string): EquipmentItem | null {
  return equipmentItems.find((item) => item.id === id) ?? null;
}

/** Карточка оборудования — потоковая вёрстка, одинаковая для мобилы и десктопа */
function EquipmentCardView({
  card,
  onOpen,
}: {
  card: EquipmentCard;
  onOpen: (item: EquipmentItem) => void;
}) {
  const imageIsFramed = Boolean(card.imageClass?.includes("absolute"));
  const item = itemById(card.id);
  const canOpen = item !== null;

  return (
    <article className="flex w-[min(85vw,320px)] shrink-0 flex-col overflow-hidden rounded-[12px] border border-line bg-white shadow-[var(--shadow-card)] lg:h-[375px] lg:w-[376px]">
      {/* Figma 2351:11342 / 11366: обложка inset 4px, radius 8px; бейдж+title 12px от края cover */}
      <span className="relative m-[4px] block h-[94px] shrink-0 rounded-[8px]">
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[8px]">
          {imageIsFramed ? (
            <img
              loading="lazy"
              alt=""
              className={card.imageClass}
              src={img(card.image)}
            />
          ) : (
            <img
              loading="lazy"
              alt=""
              className={card.imageClass ?? "size-full rounded-[8px] object-cover"}
              src={img(card.image)}
            />
          )}
        </span>
        <span className="pointer-events-none absolute left-[12px] top-[12px] z-[1] flex w-[188px] flex-col items-start gap-[8px]">
          {card.chip === "all" ? (
            <span className="equipment-chip equipment-chip--all">{card.chipText}</span>
          ) : (
            <span className="equipment-chip equipment-chip--soft">{card.chipText}</span>
          )}
          <span className="block w-[188px] text-[14px] font-semibold leading-[normal] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
            {card.title}
          </span>
        </span>
      </span>

      <div className="flex w-full flex-1 flex-col items-start gap-[12px] px-[15px] pt-[12px]">
        <EquipmentImportance value={card.importance} />

        <div className="flex w-full flex-col gap-[4px] text-[12px] leading-[normal]">
          <p className="w-full font-semibold tracking-[-0.12px] text-ink-muted">Описание:</p>
          <p className="w-full font-medium text-ink-secondary">{card.description}</p>
        </div>
        <div className="flex w-full flex-col gap-[4px] text-[12px] leading-[normal]">
          <p className="w-full font-semibold tracking-[-0.12px] text-ink-muted">Замена:</p>
          <p className="w-full font-medium text-ink-secondary lg:whitespace-pre-line">
            {card.replacement}
          </p>
        </div>
      </div>

      {canOpen ? (
        <button
          type="button"
          className="mx-[15px] mb-[15px] mt-[16px] flex min-h-[44px] items-center justify-center rounded-[12px] px-[32px] py-[16px] transition hover:brightness-105 active:brightness-95"
          style={{ backgroundImage: "var(--gradient-primary)" }}
          onClick={() => onOpen(item)}
        >
          <span className="whitespace-nowrap text-center font-display text-[14px] font-bold leading-[1.2] text-white">
            {card.buttonText}
          </span>
        </button>
      ) : null}
    </article>
  );
}

/** «Необходимое оборудование для тренировок на курсе» — Figma 2351:11432–11434 */
export function EquipmentSection() {
  const [modalItem, setModalItem] = useState<EquipmentItem | null>(null);

  const openModal = useCallback((item: EquipmentItem) => {
    setModalItem(item);
  }, []);

  const closeModal = useCallback(() => {
    setModalItem(null);
  }, []);

  return (
    <Typo>
    <section
      data-figma-node="2351:11432"
      className="mx-auto w-full max-w-[1160px] overflow-x-visible"
    >
      <div className="flex flex-col gap-[12px] lg:relative lg:block">
        <h2 className="max-w-[368px] font-display text-[22px] font-normal leading-[1.25] text-ink lg:text-[24px] lg:leading-[1.2]">
          Необходимое оборудование для тренировок на курсе
        </h2>
        <p className="text-[12px] font-normal leading-[normal] text-ink-secondary lg:absolute lg:right-0 lg:top-[26px] lg:w-[311px] lg:text-right">
          Нажмите «Подробнее», чтобы увидеть рекомендации и ссылки на проверенные варианты
          оборудования
        </p>
      </div>

      {/* Одна лента: hscroll-bleed до xl, на xl+ до правого края viewport — 4-я карточка подглядывает */}
      <div
        id="course-equipment-scroller"
        data-drag-scroll
        data-figma-node="2351:11434"
        className="mt-6 flex min-w-0 items-stretch gap-3 overflow-x-auto overflow-y-visible pb-1 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [touch-action:pan-x_pan-y] max-xl:hscroll-bleed sm:mt-[40px] lg:gap-4 xl:hscroll-end xl:w-[calc(50%+50vw)] xl:max-w-none [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card) => (
          <EquipmentCardView key={card.id} card={card} onOpen={openModal} />
        ))}
      </div>

      <EquipmentModal
        item={modalItem}
        open={modalItem !== null}
        onClose={closeModal}
      />
    </section>
    </Typo>
  );
}
