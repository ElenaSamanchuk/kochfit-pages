"use client";

import { PaymentCard } from "@/components/site/PaymentCard";
import type { PaymentOffer } from "@/content/payments";
import { Modal } from "@/components/ui/Modal";

/** Попап оплаты «Персональная работа» — аналог Tilda #order:ПЕРСОНАЛЬНО=7000 */
export function PersonalWorkPaymentModal({
  open,
  onClose,
  offer,
}: {
  open: boolean;
  onClose: () => void;
  offer: PaymentOffer;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabel={`Оплата: ${offer.title}`}
      panelClassName="w-full max-w-[560px]"
    >
      <div className="relative">
        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          className="absolute right-[14px] top-[14px] z-10 flex size-[36px] items-center justify-center rounded-full bg-white/90 text-[#4b4d57] shadow-[var(--shadow-card)] transition hover:bg-white"
        >
          <svg aria-hidden viewBox="0 0 14 14" className="size-[12px]">
            <path
              d="M1.5 1.5l11 11M12.5 1.5l-11 11"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <PaymentCard offer={offer} />
      </div>
    </Modal>
  );
}
