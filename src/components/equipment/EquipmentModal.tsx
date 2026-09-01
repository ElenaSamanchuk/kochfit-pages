"use client";

import { Modal } from "@/components/ui/Modal";
import { Typo } from "@/components/ui/TypoText";
import { assetPath } from "@/lib/asset-path";
import {
  equipmentShops,
  showEquipmentShops,
  type EquipmentItem,
} from "@/content/equipment";

const arrowLink = assetPath("/images/equipment/arrow-link.svg");
const arrowShop = assetPath("/images/equipment/arrow-shop.svg");

const productLinkClass =
  "group/link flex items-center gap-3 rounded-[8px] border border-surface-blue bg-white py-2 pl-3 pr-2 text-[12px] font-medium text-ink-secondary transition hover:border-accent hover:text-accent";

/** Попап «Ссылки» / «Ссылки, рекомендации» — Figma 2351:10404 */
export function EquipmentModal({
  item,
  open,
  onClose,
}: {
  item: EquipmentItem | null;
  open: boolean;
  onClose: () => void;
}) {
  const hasLinks =
    item !== null && (item.best.length > 0 || item.other.length > 0);

  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabel={item?.name ?? "Рекомендации по оборудованию"}
      overlayClassName="bg-black/45"
      panelClassName="max-w-[420px] rounded-t-[20px] bg-white p-[15px] shadow-[var(--shadow-card)] sm:rounded-[20px] sm:p-5"
      align="bottom"
      zIndexClass="z-[200]"
    >
      {item ? (
        <Typo>
        <div data-figma-node="2351:10404">
          <div className="mb-4 flex items-start justify-between gap-3">
            <h2
              id="equipment-modal-title"
              className="font-display text-[18px] font-normal leading-[1.2] text-ink"
            >
              {item.name}
            </h2>
            <button
              type="button"
              aria-label="Закрыть"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-blue text-ink-secondary transition hover:bg-accent/20"
              onClick={onClose}
            >
              ×
            </button>
          </div>

          {item.advice.text ? (
            <div className="mb-4">
              <p className="text-[12px] font-semibold tracking-[-0.12px] text-ink-muted">
                {item.advice.label}
              </p>
              <p className="mt-1 text-[12px] font-medium leading-normal text-ink-secondary">
                {item.advice.text}
              </p>
            </div>
          ) : null}

          {item.best.length > 0 ? (
            <div className="mb-4">
              <p className="text-[12px] font-semibold tracking-[-0.12px] text-ink-muted">
                Лучшие варианты:
              </p>
              <ul className="mt-2 flex flex-col gap-2">
                {item.best.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={productLinkClass}
                    >
                      <span className="min-w-0 flex-1">{link.label}</span>
                      <img
                        alt=""
                        aria-hidden
                        className="size-6 shrink-0"
                        src={arrowLink}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {item.other.length > 0 ? (
            <div className="mb-4">
              <p className="text-[12px] font-semibold tracking-[-0.12px] text-ink-muted">
                Другие варианты:
              </p>
              <ul className="mt-2 flex flex-col gap-2">
                {item.other.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={productLinkClass}
                    >
                      <span className="min-w-0 flex-1">{link.label}</span>
                      <img
                        alt=""
                        aria-hidden
                        className="size-6 shrink-0"
                        src={arrowLink}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {showEquipmentShops && equipmentShops.length > 0 ? (
            <div className="border-t border-line pt-4">
              <p className="text-[12px] font-semibold tracking-[-0.12px] text-ink-muted">
                Все оборудование в одном месте:
              </p>
              <ul className="mt-2 flex flex-col gap-2">
                {equipmentShops.map((shop) => (
                  <li key={shop.shop}>
                    <a
                      href={shop.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center gap-x-2 rounded-[8px] border border-surface-blue bg-surface-blue py-2 pl-3 pr-2 text-[12px] font-medium leading-none transition hover:border-accent sm:gap-x-[29px]"
                    >
                      <span className="flex min-w-0 flex-1 items-center gap-x-2 sm:gap-x-[29px]">
                        <span className="shrink-0 text-ink-secondary">
                          Магазин:{" "}
                          <span className="text-accent">{shop.shop}</span>
                        </span>
                        <span className="min-w-0 truncate text-ink-secondary">
                          Промокод:{" "}
                          <span className="text-accent">{shop.code}</span>
                        </span>
                      </span>
                      <img
                        alt=""
                        aria-hidden
                        className="size-6 shrink-0"
                        src={arrowShop}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {!hasLinks && !item.advice.text ? (
            <p className="text-[12px] font-medium text-ink-secondary">
              Рекомендации скоро появятся
            </p>
          ) : null}
        </div>
        </Typo>
      ) : null}
    </Modal>
  );
}
