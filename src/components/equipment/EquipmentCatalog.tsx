"use client";

import { useCallback, useState } from "react";
import { EquipmentImportance } from "@/components/equipment/EquipmentImportance";
import { EquipmentModal } from "@/components/equipment/EquipmentModal";
import { Typo } from "@/components/ui/TypoText";
import { assetPath } from "@/lib/asset-path";
import type { EquipmentCategory, EquipmentItem } from "@/content/equipment";
import {
  equipmentIntro,
  equipmentItems,
  visibleEquipmentItem,
} from "@/content/equipment";

const img = (name: string) => assetPath(`/images/equipment/${name}`);

const categoryChipClass: Record<EquipmentCategory, string> = {
  "Для всех тренировок": "equipment-chip equipment-chip--all",
  Коррекция: "equipment-chip equipment-chip--soft",
  Силовая: "equipment-chip equipment-chip--soft",
  Новое: "equipment-chip equipment-chip--new",
};

/** Каталог инвентаря — Figma 2351:10229 (сетка 2351:10228), голубая схема */
export function EquipmentCatalog() {
  const [modalItem, setModalItem] = useState<EquipmentItem | null>(null);

  const openModal = useCallback((item: EquipmentItem) => {
    setModalItem(item);
  }, []);

  const closeModal = useCallback(() => {
    setModalItem(null);
  }, []);

  return (
    <Typo>
      <header
        data-figma-node="2351:10229"
        className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"
      >
        <h1 className="max-w-[368px] font-display text-[25px] font-normal leading-[1.2] text-ink xl:text-[24px] xl:leading-[1.2]">
          <span className="xl:block">Необходимое оборудование</span>
          <span className="xl:block">для тренировок на курсе</span>
        </h1>
        <p className="max-w-[311px] text-[12px] leading-normal text-ink-muted lg:text-right">
          {equipmentIntro.hint}
        </p>
      </header>

      <div
        data-figma-node="2351:10228"
        /* Мобилка — вертикальный стек (каталог = основной контент, карусель прячет позиции).
           Figma 2351:10229 — 3 колонки по 376px с gap 16px при контенте 1160. */
        className="mt-8 flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-4 xl:grid-cols-3"
      >
        {equipmentItems.map((item) => {
          const visible = visibleEquipmentItem(item);
          const hasModal =
            visible.best.length > 0 ||
            visible.other.length > 0 ||
            Boolean(visible.advice.text);

          return (
            <article
              key={item.id}
              data-figma-node={item.figmaNode}
              className="relative flex w-full flex-col overflow-hidden rounded-[12px] border border-line bg-white shadow-[var(--shadow-card)] lg:h-[375px] lg:w-auto"
            >
              {/* Figma cover: mobile in-flow stack; lg+ absolute inset (376×375 card) */}
              <span className="relative m-1 block h-[94px] shrink-0 overflow-hidden rounded-[8px] lg:absolute lg:left-1 lg:top-1 lg:m-0 lg:w-[calc(100%-8px)]">
                {item.imageClass ? (
                  <img
                    loading="lazy"
                    alt={item.name}
                    className={item.imageClass}
                    src={img(item.image)}
                  />
                ) : (
                  <img
                    loading="lazy"
                    alt={item.name}
                    className="size-full object-cover"
                    src={img(item.image)}
                  />
                )}
                <span className="pointer-events-none absolute left-[12px] top-[12px] z-[1] flex w-[min(188px,calc(100%-24px))] flex-col gap-2">
                  <span className={categoryChipClass[item.category]}>
                    {item.category}
                  </span>
                  <p className="text-[14px] font-semibold leading-[1.25] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
                    {item.name}
                  </p>
                </span>
              </span>

              <div className="flex w-full flex-col gap-[12px] px-[15px] pt-[12px] max-lg:static lg:absolute lg:inset-x-5 lg:top-[110px] lg:w-auto lg:p-0">
                <EquipmentImportance value={item.importance} />

                <div className="flex flex-col gap-1">
                  <p className="text-[12px] font-semibold tracking-[-0.12px] text-ink-muted">
                    Описание:
                  </p>
                  <p className="text-[12px] font-medium leading-normal text-ink-secondary lg:line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {item.replace ? (
                  <div className="flex flex-col gap-1">
                    <p className="text-[12px] font-semibold tracking-[-0.12px] text-ink-muted">
                      Замена:
                    </p>
                    <p className="text-[12px] font-medium leading-normal text-ink-secondary lg:line-clamp-2 xl:whitespace-pre-line">
                      {item.replace}
                    </p>
                  </div>
                ) : null}
              </div>

              {hasModal ? (
                <button
                  type="button"
                  className="mx-[15px] mb-[15px] mt-[16px] flex min-h-[44px] items-center justify-center rounded-[12px] px-8 py-4 font-display text-[14px] font-bold leading-[1.2] text-white transition hover:brightness-105 active:brightness-95 lg:absolute lg:bottom-[15px] lg:left-[15px] lg:right-[15px] lg:m-0"
                  style={{ backgroundImage: "var(--gradient-primary)" }}
                  onClick={() => openModal(item)}
                >
                  {item.buttonLabel}
                </button>
              ) : null}
            </article>
          );
        })}
      </div>

      <EquipmentModal
        item={modalItem}
        open={modalItem !== null}
        onClose={closeModal}
      />
    </Typo>
  );
}
