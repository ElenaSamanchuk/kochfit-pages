"use client";

import { assetPath } from "@/lib/asset-path";
import { Modal } from "@/components/ui/Modal";
import { Typo } from "@/components/ui/TypoText";
import { subscriptionPricing } from "@/content/courses";

const img = (name: string) => assetPath(`/images/subscription-popup/${name}`);
const { standard, premium } = subscriptionPricing;

type Step = {
  title: string;
  text: React.ReactNode;
  width: number;
  left: number;
};

const steps: Step[] = [
  {
    title: "Выбери тариф",
    // Spaces live in the text nodes (not only next to desktop-only <br>),
    // so mobile never glues words when the break is hidden.
    text: (
      <>
        <span className="font-medium text-[#676971]">
          Стандарт {standard.price.toLocaleString("ru-RU")} ₽/мес
        </span>
        {" или "}
        <span className="font-semibold text-[#676971]">Премиум </span>
        <br className="hidden xl:block" aria-hidden />
        <span className="font-semibold text-[#676971] xl:whitespace-nowrap">
          {premium.price.toLocaleString("ru-RU")} ₽/мес. Или фиксированный период,{" "}
        </span>
        <br className="hidden xl:block" aria-hidden />
        {"3 или 6 месяцев без автопродления"}
      </>
    ),
    width: 272,
    left: 40,
  },
  {
    title: "Оформи подписку",
    // Always-on breaks + spaces on both sides: mid-sentence period after
    // «месяц»; never glued when <br> is ignored (copy/a11y/mobile).
    text: (
      <>
        {"Привязываешь карту, списывается "}
        <br aria-hidden />
        {"первый месяц. "}
        <span className="font-medium text-[#676971]">Доступ к курсу </span>
        <br aria-hidden />
        <span className="font-medium text-[#676971]">открывается сразу</span>
      </>
    ),
    width: 232,
    left: 324,
  },
  {
    title: "Продление подписки",
    // Always 3 lines (mobile + desktop); nbsp keeps «за 3 дня» together.
    // Mid-sentence period after «месяц»; no trailing period at end of block.
    text: (
      <>
        {"Подписка продлевается"}
        <span className="font-medium text-[#676971]"> автоматически </span>
        <br aria-hidden />
        <span className="font-medium text-[#676971]">каждый месяц. </span>
        {"Списание происходит "}
        <br aria-hidden />
        {"за\u00a03\u00a0дня до окончания текущего периода"}
      </>
    ),
    width: 270,
    left: 572,
  },
  {
    title: "Отмена подписки",
    // Always-on breaks + spaces: period after «кабинет»; no trailing period.
    text: (
      <>
        <span className="font-semibold text-[#676971] xl:whitespace-nowrap">
          {"В любой момент через личный кабинет. "}
        </span>
        <br aria-hidden />
        {"Доступ сохраняется до конца "}
        <br aria-hidden />
        {"оплаченного периода"}
      </>
    ),
    width: 262,
    left: 858,
  },
];

/** Карточка «Ваш доступ к курсу» поверх телефона — Figma 2052:3156 */
function PromoAccessCard() {
  return (
    <div className="relative h-[126.752px] w-[324.541px] overflow-hidden rounded-[12.258px] border-[2.529px] border-solid border-[#84b0d2] bg-white shadow-[0px_3.772px_18.859px_0px_rgba(103,105,113,0.05)]">
      <p className="absolute left-[9.43px] top-[9.43px] whitespace-nowrap font-display text-[9.429px] font-bold leading-[1.2] text-[#84b0d2]">
        Ваш доступ к курсу:
      </p>
      <p className="absolute right-[7.64px] top-[9.75px] whitespace-nowrap text-right font-display text-[9.429px] font-bold leading-[1.2] text-[#84b0d2]">
        Доступ до конца периода
      </p>
      <span
        className="absolute left-[9.43px] top-[30.17px] block size-[22.63px] rounded-[5.658px]"
        style={{
          backgroundImage:
            "var(--gradient-primary)",
        }}
      />
      <img
        loading="lazy"
        alt=""
        className="absolute left-[13.2px] top-[33.94px] block size-[15.087px]"
        src={img("imgClarityAvatarSolid.svg")}
      />
      <p className="absolute left-[37.72px] top-[35.83px] w-[236.676px] font-display text-[9.429px] font-bold uppercase leading-[1.2] text-ink">
        Красота и здоровье
      </p>
      <p className="absolute left-[9.43px] top-[62.23px] whitespace-nowrap text-[9.429px] font-semibold leading-[1.1] text-[#676971]">
        Мой прогресс
      </p>
      <p className="absolute left-[79.21px] top-[62.23px] w-[26.402px] text-center text-[9.429px] font-semibold leading-[1.1] text-[#84b0d2]">
        48%
      </p>
      <span className="absolute left-[109.38px] top-[66.01px] block h-[2.829px] w-[206.803px] rounded-[11.315px] bg-[#676971] opacity-10" />
      <span
        className="absolute left-[109.38px] top-[66.01px] block h-[2.829px] w-[112.546px] rounded-[9.429px]"
        style={{
          backgroundImage:
            "var(--gradient-primary)",
        }}
      />
      <span
        className="absolute bottom-[8.36px] left-[9.75px] flex w-[306.433px] items-center justify-center rounded-[7.543px] px-[18.859px] py-[12.258px]"
        style={{
          backgroundImage:
            "var(--gradient-primary)",
        }}
      >
        <span className="whitespace-nowrap text-center font-display text-[9.429px] font-bold leading-[1.2] text-white">
          Подключить подписку
        </span>
      </span>
    </div>
  );
}

/** Мокап iPhone + карточка доступа — Figma 2052:3147. Координаты от группы 398×689. */
function SubscriptionPhoneVisual() {
  return (
    <div
      data-subscription-visual
      className="relative h-[689.462px] w-[398px]"
    >
      <span
        aria-hidden
        className="absolute left-[18px] top-0 block h-[689.462px] w-[352px] overflow-hidden opacity-60 mix-blend-multiply"
      >
        <img alt="" className="block size-full max-w-none" src={img("imgShadow.png")} />
      </span>
      <span aria-hidden className="absolute left-[64.2px] top-[12.79px] block h-[627.829px] w-[288.897px]">
        <img alt="" className="block size-full max-w-none" src={img("imgIPhone16Pro.png")} />
      </span>
      <span aria-hidden className="absolute left-[75.21px] top-[22.14px] block h-[609.132px] w-[267.257px]">
        <img alt="" className="block size-full max-w-none" src={img("imgMockup.svg")} />
      </span>
      <div className="absolute left-[9px] top-[121.07px]">
        <PromoAccessCard />
      </div>
      <span
        aria-hidden
        className="absolute left-0 top-[478.07px] block h-[105px] w-[398px] bg-white blur-[13.15px]"
      />
    </div>
  );
}

/** Поп-ап «Как работает подписка» — Figma 2052:3141 (desktop pixel-perfect, mobile — стек) */
export function SubscriptionPopup({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabel="Как работает подписка"
      overlayClassName="bg-[rgba(60,60,66,0.4)]"
      panelClassName="w-full max-w-[1160px]"
    >
      <Typo>
      {/* ── Мобайл/планшет: шапка с мокапом + стек шагов ── */}
      <div className="relative mx-auto flex w-full max-w-[520px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_20px_60px_rgba(75,77,87,0.18)] xl:hidden">
        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          className="absolute right-[14px] top-[14px] z-10 flex size-[36px] items-center justify-center rounded-full bg-white text-[#4b4d57] shadow-[2px_2px_8px_0px_rgba(224,224,224,0.25)] transition hover:bg-surface-blue"
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
        <div
          data-subscription-hero
          className="relative h-[180px] overflow-hidden bg-[#edf4f9]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[6px] origin-top -translate-x-1/2 scale-[0.55]"
          >
            <SubscriptionPhoneVisual />
          </div>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[40px] bg-gradient-to-b from-transparent to-white"
          />
        </div>
        <div className="px-[20px] pb-[20px] pt-[4px]">
          <h2 className="pr-[40px] font-display text-[20px] font-normal leading-[1.2] text-ink sm:text-[24px]">
            Как работает подписка
          </h2>
          <div className="mt-[16px] flex flex-col gap-[12px]">
            {steps.map((step, i) => (
              <article
                key={step.title}
                className="flex flex-col gap-[10px] rounded-[16px] border border-solid border-[#efefef] bg-white p-[15px] shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-semibold text-[#4b4d57]">{i + 1} шаг</p>
                  <span className="flex items-start gap-[4px]">
                    {Array.from({ length: 4 }, (_, d) => (
                      <span
                        key={d}
                        className={`block size-[7px] rounded-[100px] bg-[#999ca8] ${d === i ? "" : "opacity-25"}`}
                      />
                    ))}
                  </span>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <p className="text-[14px] font-semibold leading-[normal] text-[#676971]">
                    {step.title}
                  </p>
                  <p className="text-[13px] font-normal leading-[1.4] text-[#999ca8]">{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* ── Desktop (xl): пиксель-в-пиксель макет Figma ── */}
      <div
        data-figma-node="2052:3144"
        className="relative mx-auto hidden h-[524px] w-full overflow-hidden rounded-[32px] bg-[#edf4f9] shadow-[0_20px_60px_rgba(75,77,87,0.18)] xl:block"
      >
        <span className="absolute inset-x-0 top-[214px] block h-[310px] rounded-[28px] bg-white" />

        <div className="absolute left-[381px] top-[30.93px]">
          <SubscriptionPhoneVisual />
        </div>

        <h2 className="absolute left-[44px] top-[262px] whitespace-nowrap font-display text-[24px] font-normal leading-[1.2] text-ink">
          Как работает подписка
        </h2>

        {steps.map((step, i) => (
          <article
            key={step.title}
            className="absolute top-[339px] flex flex-col items-start gap-[20px] rounded-[16px] border border-solid border-[#efefef] bg-white p-[15px]"
            style={{ left: step.left, width: step.width }}
          >
            <div className="flex w-full items-center justify-between">
              <p className="whitespace-nowrap text-[16px] font-semibold leading-[normal] text-[#4b4d57]">
                {i + 1} шаг
              </p>
              <span className="flex items-start gap-[4px]">
                {Array.from({ length: 4 }, (_, d) => (
                  <span
                    key={d}
                    className={`block size-[7px] rounded-[100px] bg-[#999ca8] ${d === i ? "" : "opacity-25"}`}
                  />
                ))}
              </span>
            </div>
            <div className="flex w-full flex-col items-start gap-[4px]">
              <p className="w-full text-[14px] font-semibold leading-[normal] text-[#676971]">
                {step.title}
              </p>
              <p className="w-full text-[12px] font-normal leading-[normal] text-[#999ca8]">
                {step.text}
              </p>
            </div>
          </article>
        ))}

        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          className="absolute right-[20px] top-[20px] flex size-[38px] cursor-pointer items-center justify-center rounded-[1000px] bg-white text-[18px] leading-none text-[#4b4d57] shadow-[2px_2px_8px_0px_rgba(224,224,224,0.25)]"
        >
          ✕
        </button>
      </div>
      </Typo>
    </Modal>
  );
}
