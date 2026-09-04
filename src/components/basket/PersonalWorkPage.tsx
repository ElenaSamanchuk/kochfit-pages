"use client";

import { useCallback, useEffect, useState } from "react";
import { ContactForm } from "@/components/site/ContactForm";
import { PersonalWorkPaymentModal } from "@/components/basket/PersonalWorkPaymentModal";
import { Typo } from "@/components/ui/TypoText";
import { personalWorkContent as c } from "@/content/personal-work";
import { getPaymentOffer } from "@/content/payments";
import { assetPath } from "@/lib/asset-path";

const basketOffer = getPaymentOffer("basket");

const ctaClass =
  "inline-flex min-h-[52px] items-center rounded-[14px] px-[32px] font-display text-[15px] font-bold transition hover:opacity-90";

function shouldOpenPaymentFromUrl() {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("pay") === "1" || window.location.hash === "#pay";
}

function clearPaymentUrl() {
  const url = new URL(window.location.href);
  let changed = false;
  if (url.searchParams.has("pay")) {
    url.searchParams.delete("pay");
    changed = true;
  }
  if (url.hash === "#pay") {
    url.hash = "";
    changed = true;
  }
  if (changed) {
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
  }
}

function SectionCard({
  id,
  overline,
  heading,
  children,
  className = "",
}: {
  id?: string;
  overline?: string;
  heading: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      data-figma-node={id}
      className={`scroll-mt-[96px] rounded-[24px] bg-white p-[24px] shadow-[var(--shadow-card)] sm:p-[28px] lg:p-[40px] ${className}`}
    >
      {overline && (
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
          {overline}
        </p>
      )}
      <h2
        className={`font-display text-[22px] font-normal leading-[1.2] text-ink lg:text-[26px] ${overline ? "mt-2" : ""}`}
      >
        {heading}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-[2px] shrink-0 text-accent"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 9.5 7 13.5 15 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Лендинг «Персональная работа» — old-site/page22983826 + блок тренировок с главной */
/** На десктопе эти два пункта не показываем — решение по макету. */
const HIDDEN_ON_DESKTOP = new Set([
  "помощь в коррекции рациона (по запросу)",
  "оценка состояния ОДА",
]);

export function PersonalWorkPage() {
  const [payOpen, setPayOpen] = useState(false);

  const openPayment = useCallback(() => {
    setPayOpen(true);
  }, []);

  const closePayment = useCallback(() => {
    setPayOpen(false);
    clearPaymentUrl();
  }, []);

  useEffect(() => {
    if (shouldOpenPaymentFromUrl()) {
      setPayOpen(true);
    }
  }, []);

  return (
    <Typo>
    <>
      <div className="flex flex-col gap-[20px] lg:gap-[24px]">
        {/* Hero — rec371124823 */}
        <header
          data-figma-node="371124823"
          className="scroll-mt-[96px] rounded-[24px] bg-white p-[24px] shadow-[var(--shadow-card)] sm:p-[28px] lg:p-[48px]"
        >
          <div className="grid items-center gap-[24px] lg:grid-cols-[1.15fr_1fr] lg:gap-[40px]">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
                {c.overline}
              </p>
              <h1 className="mt-2 font-display text-[25px] font-normal leading-[1.2] tracking-[-0.03em] text-ink lg:text-[40px] lg:tracking-normal">
                {c.headline}
              </h1>
              <p className="mt-[14px] max-w-[560px] text-[15px] leading-[1.45] sm:leading-[1.6] text-ink-secondary">
                {c.intro}
              </p>
              <div className="mt-[24px] flex flex-wrap items-center gap-[16px]">
                <button
                  type="button"
                  onClick={openPayment}
                  className={`btn-primary text-white ${ctaClass}`}
                >
                  {c.cta.label}
                </button>
                <button
                  type="button"
                  onClick={openPayment}
                  className="font-display text-[24px] font-bold text-ink transition hover:text-accent"
                >
                  {c.cta.price}
                </button>
              </div>
            </div>
            <img
              src={assetPath(c.photo)}
              alt="Персональная работа с Юлией Кочкиной"
              className="w-full rounded-[20px] object-cover shadow-[var(--shadow-card)] lg:rounded-[24px]"
            />
          </div>
        </header>

        {/* Что будет на курсе */}
        <SectionCard id="course" overline={c.overline} heading={c.course.title}>
          <ol className="grid gap-[12px] sm:grid-cols-2">
            {c.course.items.map((item, i) => (
              <li
                key={item}
                className="flex gap-[14px] rounded-[16px] bg-surface-blue p-[16px] lg:p-[18px]"
              >
                <span
                  className="flex size-[32px] shrink-0 items-center justify-center rounded-full font-display text-[14px] font-bold text-white"
                  style={{ backgroundImage: "var(--gradient-primary)" }}
                >
                  {i + 1}
                </span>
                <span className="text-[14px] leading-[1.45] sm:leading-[1.55] text-ink-secondary">
                  {item}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-[16px] rounded-[14px] bg-surface-blue px-[18px] py-[12px] text-[14px] font-semibold text-ink">
            {c.course.note}
          </p>
        </SectionCard>

        {/* Персональные тренировки — rec1160338831 */}
        <SectionCard
          id="training"
          overline={c.training.subtitle}
          heading={c.training.title}
        >
          <ul className="space-y-[10px]">
            {c.training.features.map((feature) => (
              <li
                key={feature}
                className={`flex gap-[12px] text-[14px] leading-[1.45] sm:leading-[1.55] text-ink-secondary sm:text-[15px] ${
                  HIDDEN_ON_DESKTOP.has(feature) ? "xl:hidden" : ""
                }`}
              >
                <CheckIcon />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-[24px] grid gap-[12px] sm:grid-cols-3">
            {c.training.tariffs.map((tariff) => (
              <article
                key={tariff.label}
                className="rounded-[16px] border border-line bg-surface p-[18px]"
              >
                <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-muted">
                  {tariff.label}
                </p>
                <p className="mt-[8px] font-display text-[22px] font-bold text-accent">
                  {tariff.price}
                </p>
                <p className="mt-[6px] text-[13px] text-ink-secondary">
                  {tariff.note}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-[28px] rounded-[16px] bg-surface-blue p-[20px] lg:p-[24px]">
            <h3 className="font-display text-[18px] font-normal text-ink">
              Лист ожидания
            </h3>
            <p className="mt-[8px] text-[14px] leading-[1.45] sm:leading-[1.55] text-ink-secondary">
              Оставьте заявку на персональные тренировки по Skype, Zoom или
              Telegram, мы свяжемся с вами для согласования расписания
            </p>
            <ContactForm
              subject={c.training.form.subject}
              fields={["name", "phone", "message"]}
              submitLabel={c.training.form.submitLabel}
              note={c.training.form.note}
            />
          </div>
        </SectionCard>

        {/* Продуктовая корзина — rec371125150 */}
        <SectionCard id="basket" overline={c.overline} heading={c.basket.title}>
          <p className="max-w-[640px] text-[15px] leading-[1.45] sm:leading-[1.6] text-ink-secondary">
            {c.basket.intro}
          </p>
          <div className="mt-[20px] grid gap-[16px] md:grid-cols-2">
            {c.basket.groups.map((group) => (
              <article
                key={group.title}
                className="rounded-[16px] border border-line bg-surface p-[20px] lg:p-[24px]"
              >
                <h3 className="font-display text-[18px] font-normal text-accent">
                  {group.title}
                </h3>
                <ul className="mt-[12px] space-y-[8px] pl-[18px] text-[14px] leading-[1.45] sm:leading-[1.55] text-ink-secondary marker:text-accent">
                  {group.items.map((item) => (
                    <li key={item} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
                {"note" in group && group.note && (
                  <p className="mt-[14px] rounded-[12px] bg-white px-[14px] py-[10px] text-[13px] leading-[1.5] text-ink-secondary">
                    {group.note}
                  </p>
                )}
              </article>
            ))}
          </div>
        </SectionCard>

        {/* Правила приёмов пищи — rec371127779 */}
        <SectionCard id="meals" overline={c.overline} heading={c.meals.title}>
          <ul className="space-y-[12px]">
            {c.meals.items.map((item) => (
              <li
                key={item}
                className="flex gap-[12px] rounded-[16px] bg-surface-blue p-[16px] text-[14px] leading-[1.45] sm:leading-[1.55] text-ink-secondary sm:p-[18px] sm:text-[15px]"
              >
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* CTA */}
        <section
          data-figma-node="basket-cta"
          className="rounded-[24px] px-[24px] py-[32px] text-white sm:px-[28px] sm:py-[36px] lg:px-[48px]"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          <h2 className="font-display text-[22px] font-normal leading-[1.25] lg:text-[24px] lg:leading-[1.2]">
            Готовы работать персонально?
          </h2>
          <p className="mt-3 max-w-[520px] text-[15px] leading-[1.45] sm:leading-[1.55] text-white/90">
            Индивидуальное сопровождение с Юлией Кочкиной, {c.cta.price}. После
            оплаты Юлия свяжется с вами в течение 24 часов
          </p>
          <button
            type="button"
            onClick={openPayment}
            className={`btn-on-dark mt-[22px] ${ctaClass}`}
          >
            {c.cta.label}
          </button>
        </section>
      </div>

      {basketOffer && (
        <PersonalWorkPaymentModal
          open={payOpen}
          onClose={closePayment}
          offer={basketOffer}
        />
      )}
    </>
    </Typo>
  );
}
