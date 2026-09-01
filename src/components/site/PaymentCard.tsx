import type { PaymentOffer } from "@/content/payments";
import { externalLinks } from "@/content/links";
import { AppLink } from "@/components/ui/AppLink";

/** Карточка оплаты (страница или попап) */
export function PaymentCard({
  offer,
  titleAs: Title = "h2",
}: {
  offer: PaymentOffer;
  titleAs?: "h1" | "h2";
}) {
  const href = offer.checkoutUrl ?? externalLinks.platform;

  return (
    <section className="overflow-hidden rounded-[24px] bg-white shadow-[var(--shadow-card)]">
      <div
        className="px-[28px] py-[36px] text-white lg:px-[48px]"
        style={{ backgroundImage: "var(--gradient-primary)" }}
      >
        <p className="text-[13px] font-semibold uppercase tracking-[0.04em] opacity-80">
          Оплата
        </p>
        <Title className="mt-[12px] font-display text-[28px] font-normal leading-[1.2] lg:text-[34px]">
          {offer.title}
        </Title>
        {offer.note && (
          <p className="mt-[12px] max-w-[520px] text-[15px] leading-[1.5] text-white/90">
            {offer.note}
          </p>
        )}
      </div>
      <div className="px-[28px] py-[32px] lg:px-[48px]">
        <p className="text-[14px] text-ink-muted">{offer.productName}</p>
        <p className="mt-[8px] font-display text-[40px] font-bold text-ink">
          {offer.priceLabel}
        </p>
        <AppLink
          href={href}
          className="mt-[28px] inline-flex rounded-[12px] px-[32px] py-[16px] font-display text-[15px] font-bold text-white"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          {offer.ctaLabel}
        </AppLink>
        {offer.giftForm && (
          <div className="mt-[32px] rounded-[16px] bg-surface-blue p-[20px]">
            <p className="font-display text-[16px] font-bold text-ink">
              Оформление в подарок
            </p>
            <p className="mt-[8px] text-[14px] leading-[1.5] text-ink-secondary">
              После перехода к оплате укажите данные получателя подарка или
              напишите на{" "}
              <a className="text-accent underline" href={externalLinks.email}>
                info@kochfit.ru
              </a>
              .
            </p>
          </div>
        )}
        <p className="mt-[24px] text-[13px] text-ink-muted">
          Нажимая кнопку, вы соглашаетесь с{" "}
          <AppLink href={externalLinks.legal.oferta} className="underline">
            договором-офертой
          </AppLink>{" "}
          и{" "}
          <AppLink href={externalLinks.legal.privacy} className="underline">
            политикой обработки персональных данных
          </AppLink>
          .
        </p>
      </div>
    </section>
  );
}
