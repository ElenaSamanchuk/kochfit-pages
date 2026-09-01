"use client";

import { assetPath } from "@/lib/asset-path";
import { useState } from "react";
import { SubscriptionPopup } from "@/components/site/SubscriptionPopup";
import { AppLink } from "@/components/ui/AppLink";
import { Typo } from "@/components/ui/TypoText";
import { coursePricing } from "@/content/courses";
import { externalLinks } from "@/content/links";

const img = (name: string) => assetPath(`/images/beauty-health/${name}`);
const { beautyHealth: pricing } = coursePricing;
/** Все фиксированные периоды, включая 1 месяц — как на kochfit.ru/community */
const standardFixed = pricing.standard.fixedPeriods;
const premiumFixed = pricing.premium.fixedPeriods;

/** Миниатюра тарифа — Figma 2031:2495/2031:2374: 80×80, border 14px, inner 72×72 rounded 10px */
function TariffAvatar({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="relative block size-[64px] shrink-0 rounded-[14px] border border-solid border-[#efefef] p-[4px] lg:size-[80px]">
      <span className="relative block size-full overflow-hidden rounded-[10px]">
        {/* Figma 2031:2496 — кадр крупнее: 115.79% со сдвигом -4.45% / -0.17% */}
        <img
          loading="lazy"
          alt={alt}
          className="absolute left-[-4.45%] top-[-0.17%] block size-[115.79%] max-w-none object-cover"
          src={src}
        />
      </span>
    </span>
  );
}

function PriceCard({
  price,
  period,
  href,
}: {
  price: string;
  period: string;
  href: string;
}) {
  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-[12px] rounded-[16px] border border-solid border-[#efefef] bg-[#f8f8f8] p-[12px] sm:items-start sm:p-[10px]">
      <div className="flex w-full flex-row items-center justify-between sm:items-start">
        <span className="flex items-center gap-2 font-bold leading-[normal] sm:flex-col sm:items-start sm:gap-[4px]">
          <span className="whitespace-nowrap text-[16px] text-[#4b4d57] sm:text-[15px]">{price}</span>
        </span>
        <span className="flex h-fit shrink-0 items-center justify-center whitespace-nowrap rounded-[7px] bg-white px-[6px] py-[4px] text-center text-[10px] font-semibold leading-none text-[#4b4d57] sm:text-[9px]">
          {period}
        </span>
      </div>
      <AppLink
        href={href}
        className="flex min-h-[44px] w-full items-center justify-center rounded-[8px] px-[12px] py-[12px] font-semibold sm:min-h-[38px]"
        style={{
          backgroundImage:
            "var(--gradient-primary)",
        }}
      >
        <span className="whitespace-nowrap text-center font-display text-[12px] font-semibold leading-[1.2] text-white">
          Купить
        </span>
      </AppLink>
    </div>
  );
}

const subDiscountBadge =
  "flex shrink-0 items-center justify-center rounded-[6px] bg-coral px-[6px] py-[4px] text-center text-[10px] font-semibold leading-none text-white";

/** «2 490 ₽ / месяц» → основная сумма + приглушённый «/ месяц» (как в каталоге) */
function splitSubscriptionPricePeriod(label: string): { main: string; periodSuffix: string | null } {
  const match = label.match(/^(.+?)(\s*\/\s*(?:месяц|мес\.?))$/u);
  if (match) {
    return { main: match[1]!, periodSuffix: match[2]! };
  }
  return { main: label, periodSuffix: null };
}

/** Цена сверху; на <sm "-25%" в строке выгоды; на sm+ бейдж "-25%" у цены */
function SubscriptionBannerCopy({ price }: { price: string }) {
  const { main, periodSuffix } = splitSubscriptionPricePeriod(price);

  return (
    <div className="flex flex-col items-start gap-[4px]">
      <div data-sub-price className="flex flex-row items-center gap-[8px]">
        <span className="whitespace-nowrap text-[16px] font-bold leading-[normal] text-white">
          {main}
          {periodSuffix ? (
            <span className="text-[12px] font-normal text-white/70">{periodSuffix}</span>
          ) : null}
        </span>
        <span className="hidden items-center gap-[8px] sm:flex">
          <span className={subDiscountBadge}>-25%</span>
        </span>
      </div>
      <div data-sub-benefit className="flex items-center gap-[8px]">
        <span className="whitespace-nowrap text-[12px] font-semibold leading-[normal] text-white">
          Выгоднее с подпиской
        </span>
        <span className={`${subDiscountBadge} sm:hidden`}>-25%</span>
      </div>
    </div>
  );
}

/** Блок «Подписка Kochfit»: заголовок + кнопка попапа + баннер с CTA */
function SubscriptionBlock({
  openPopup,
  banner,
  checkoutHref,
}: {
  openPopup: () => void;
  banner: React.ReactNode;
  checkoutHref: string;
}) {
  return (
    <div className="flex w-full flex-col gap-[13px]">
      <div className="flex flex-row flex-nowrap items-center justify-between gap-[4px] xl:gap-[8px]">
        <div className="flex shrink-0 items-center gap-[6px]">
          <p className="whitespace-nowrap text-[14px] font-bold leading-[normal] text-[#4b4d57] xl:text-[16px]">
            Подписка Kochfit
          </p>
          {/* Бейдж «новинка» на блоке подписки */}
          <span className="flex h-fit items-center justify-center rounded-[6px] bg-coral px-[6px] py-[3px] text-center text-[9px] font-semibold uppercase leading-none tracking-[0.04em] text-white xl:text-[10px]">
            new
          </span>
        </div>
        <button
          type="button"
          onClick={openPopup}
          className="flex shrink-0 cursor-pointer items-center justify-center gap-[4px] rounded-[6px] border border-solid border-[#efefef] bg-white px-[6px] py-[4px] xl:min-h-[29px] xl:gap-[8px] xl:rounded-[8px] xl:px-[12px] xl:py-[5px]"
        >
          <span className="whitespace-nowrap text-center text-[10px] font-semibold leading-[12px] text-[#4b4d57] xl:text-[12px] xl:leading-[normal]">
            Как работает подписка
          </span>
          <span className="flex size-[12px] shrink-0 items-center justify-center rounded-[100px] bg-[#efefef] text-center text-[9px] font-semibold leading-[normal] text-[#4b4d57] xl:size-[16px] xl:text-[12px]">
            ?
          </span>
        </button>
      </div>
      {/* Баннер подписки — Figma 2031:2519/2031:2398: h 82px на десктопе; на мобилке высота по контенту, фон 853×175 top -16px, flip X; <sm бегущая вправо (left 80%) */}
      <div className="relative h-auto w-full shrink-0 overflow-hidden rounded-[12px] sm:h-[82px]">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-16px] flex h-[175px] w-[853px] max-w-none -translate-x-1/2 items-center justify-center max-sm:left-[80%] sm:-ml-[9.5px]"
        >
          <img
            loading="lazy"
            alt=""
            className="size-full max-w-none -scale-x-100 object-cover object-bottom"
            src={img("imgImage9.webp")}
          />
        </div>
        <div className="relative z-[1] flex h-auto flex-col items-start justify-between gap-[14px] p-[15px] sm:h-full sm:flex-row sm:items-center sm:p-[20px]">
          {banner}
          <AppLink
            href={checkoutHref}
            className="flex min-h-[44px] w-full shrink-0 items-center justify-center rounded-[8px] px-[30px] py-[12px] font-semibold sm:min-h-[38px] sm:w-auto"
            style={{
              backgroundImage:
                "var(--gradient-primary)",
            }}
          >
            <span className="whitespace-nowrap text-center font-display text-[12px] font-semibold leading-[1.2] text-white">
              Оформить подписку
            </span>
          </AppLink>
        </div>
      </div>
    </div>
  );
}

/** «Галочка/крестик» чата с обратной связью */
function ChatNote({
  icon,
  children,
  centerIcon,
}: {
  icon: string;
  children: React.ReactNode;
  /** Вертикально центрировать иконку относительно текстового блока (двухстрочный пункт Премиум) */
  centerIcon?: boolean;
}) {
  return (
    <div
      className={`flex w-full items-start gap-[6px] max-xl:items-center${centerIcon ? " lg:items-center" : ""}`}
    >
      <span className="relative block size-[23px] shrink-0">
        <img loading="lazy" alt="" className="block size-full object-cover" src={img("imgImage7.webp")} />
        <span className="absolute left-[18px] top-[15px] block size-[8px]">
          <img loading="lazy"
            alt=""
            className="absolute inset-[-12.5%] block h-[125%] w-[125%] max-w-none"
            src={img(icon)}
          />
        </span>
      </span>
      <p
        className={`min-w-0 flex-1 text-[12px] font-semibold leading-[normal] text-[#4b4d57]${centerIcon ? "" : " lg:mt-[5px]"}`}
      >
        {children}
      </p>
    </div>
  );
}

/** Плашка в шапке тарифа: mobile py выше; с sm — px/py/font как раньше, leading-none */
const tariffHeaderBadge =
  "flex h-fit w-fit items-center justify-center rounded-[7px] px-[6px] py-[8px] text-center text-[10px] font-semibold leading-none sm:px-[10px] sm:py-[6px] sm:text-[12px]";

/** «Тарифы курса» — Figma 2031:2351 (Стандарт 2031:2470, Премиум 2031:2352) */
export function TariffsSection() {
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <Typo>
    <section
      id="tariffs"
      data-figma-node="2031:2351"
      className="mx-auto flex w-full max-w-[1160px] scroll-mt-[20px] flex-col items-start gap-[24px] lg:gap-[40px]"
    >
      <h2 className="font-display text-[22px] font-normal leading-[1.25] text-[#4b4d57] lg:text-[24px] lg:leading-[1.2]">
        Тарифы курса
      </h2>

      <div className="flex w-full flex-col gap-[16px] lg:flex-row lg:gap-[20px]">
        {/* Тариф «Стандарт» — 2031:2470 */}
        <article className="flex min-w-0 flex-1 flex-col gap-[12px] rounded-[20px] bg-white p-[15px] shadow-[2px_2px_8px_0px_rgba(224,224,224,0.25)] lg:p-[20px]">
          <div className="flex items-start justify-between gap-[2px] xl:gap-[12px]">
            <div className="flex min-w-0 flex-col gap-[16px]">
              <span className={`${tariffHeaderBadge} bg-[#f8f8f8] text-[#4b4d57]`}>
                Самостоятельное прохождение по видео
              </span>
              <div className="flex flex-col gap-[4px] font-semibold leading-[normal]">
                <p className="text-[20px] text-[#4b4d57]">Тариф «Стандарт»</p>
                <p className="text-[12px] text-[#676971]">
                  <span className="xl:hidden">
                    Юлия ведёт каждую тренировку
                    <br aria-hidden />
                    {" голосом от первой до последней минуты"}
                  </span>
                  <span className="hidden xl:inline">
                    Юлия ведёт каждую тренировку голосом от первой до последней минуты
                  </span>
                </p>
              </div>
            </div>
            {/* Figma 2031:2495 — фото в светлой форме, object-bottom */}
            <TariffAvatar src={img("imgTariffStandard.webp")} alt="Юлия Кочкина" />
          </div>
          <span className="block h-px w-full bg-[#efefef]" />

          <div className="flex w-full flex-col items-start gap-[12px]">
            <div className="flex w-full flex-col gap-[8px] text-[12px]">
              <p className="font-semibold leading-[normal] text-[#4b4d57]">Программа курса:</p>
              <ul className="flex list-disc flex-col gap-[8px] pl-[18px] font-normal leading-[1.4] text-[#676971]">
                <li>5 дней в неделю зарядки и коррекционные тренировки</li>
                <li>3 силовые тренировки в неделю</li>
                <li>Более 100 дополнительных тренировок вне основной программы</li>
                <li>
                  Вебинары психологов, гинеколога, нутрициологов, лекции Юлии, тейпирование,
                  примеры рационов
                </li>
              </ul>
            </div>
            <ChatNote icon="imgGroup1.svg">
              <span className="text-[#676971]">Чат общения с обратной связью</span>
              {" не предусмотрен"}
            </ChatNote>
            <div className="flex w-full flex-col gap-[8px]">
              <p className="w-full text-[12px] font-semibold leading-[normal] text-[#4b4d57]">
                Бонусы:
              </p>
              <ul className="w-full list-disc pl-[18px] text-[12px] font-normal leading-[1.4] text-[#676971]">
                <li>
                  {"Каждый месяц, розыгрыш одежды от "}
                  <span className="font-bold">Wearmann</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-[16px]">
            <SubscriptionBlock
              openPopup={() => setPopupOpen(true)}
              checkoutHref={externalLinks.subscription.standard}
              banner={
                <SubscriptionBannerCopy
                  price={pricing.standard.subscription.pricePerMonthLabel}
                />
              }
            />

            <div className="grid w-full grid-cols-1 gap-[12px] sm:grid-cols-3 sm:gap-[12px]">
              {standardFixed.map((tariff) => (
                <PriceCard
                  key={tariff.period}
                  price={tariff.priceLabel}
                  period={tariff.period}
                  href={tariff.checkoutUrl}
                />
              ))}
            </div>
          </div>
        </article>

        {/* Тариф «Премиум» — 2031:2352 */}
        <article className="flex min-w-0 flex-1 flex-col gap-[16px] rounded-[20px] border-2 border-solid border-[#84b0d2] bg-white p-[15px] shadow-[2px_2px_8px_0px_rgba(224,224,224,0.25)] lg:p-[23px]">
          <div className="flex items-start justify-between gap-[12px]">
            <div className="flex min-w-0 flex-col gap-[16px]">
              <span className={`${tariffHeaderBadge} bg-coral text-white`}>
                Количество мест ограничено
              </span>
              <div className="flex flex-col gap-[4px] font-semibold leading-[normal]">
                <p className="text-[20px] text-[#4b4d57]">Тариф «Премиум»</p>
                <p className="text-[12px] text-[#676971]">
                  с кураторами Полиной Рожковой и Юлией Кочкиной
                </p>
              </div>
            </div>
            <TariffAvatar src={img("imgImage8.webp")} alt="Кураторы курса" />
          </div>
          <span className="block h-px w-full bg-[#efefef]" />

          <div className="flex w-full flex-col items-start gap-[12px]">
            <div className="flex w-full flex-col gap-[8px] text-[12px]">
              <p className="font-semibold leading-[normal] text-[#4b4d57]">
                {"Всё, что есть на тарифе "}
                <span className="text-[#84b0d2]">«Стандарт»</span>
                {" +"}
              </p>
              <ul className="flex list-disc flex-col gap-[8px] pl-[18px] font-normal leading-[1.4] text-[#676971]">
                <li>
                  Персональная диагностика осанки с ежемесячными отчетами и отслеживанием динамики
                  по фото
                </li>
                <li>Ежедневная проверка техники упражнений в чате от куратора Полины</li>
                <li>Помощь в коррекции рациона (по запросу)</li>
                <li>
                  Еженедельные созвоны в мини-группах с отработкой биомеханики и мышечной поддержки
                  с Юлией
                </li>
              </ul>
            </div>
            <ChatNote icon="imgVector.svg" centerIcon>
              <span className="text-[#676971]">{"Групповой чат с обратной связью с "}</span>
              <span className="text-[#4b4d57]">куратором Полиной и Юлией</span>
            </ChatNote>
            <div className="flex w-full flex-col gap-[8px]">
              <p className="w-full text-[12px] font-semibold leading-[normal] text-[#4b4d57]">
                Бонусы:
              </p>
              <ul className="w-full list-disc pl-[18px] text-[12px] font-normal leading-[1.4] text-[#676971]">
                <li className="mb-[5px]">
                  Ежемесячный розыгрыш косметики Skinprobiotic на 15 000 ₽
                </li>
                <li>Розыгрыш брендовых термосов BORK и KOCHFIT</li>
              </ul>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-[16px]">
            <SubscriptionBlock
              openPopup={() => setPopupOpen(true)}
              checkoutHref={externalLinks.subscription.premium}
              banner={
                <SubscriptionBannerCopy
                  price={pricing.premium.subscription.pricePerMonthLabel}
                />
              }
            />

            <div className="grid w-full grid-cols-1 gap-[12px] sm:grid-cols-3 sm:gap-[12px]">
              {premiumFixed.map((tariff) => (
                <PriceCard
                  key={tariff.period}
                  price={tariff.priceLabel}
                  period={tariff.period}
                  href={tariff.checkoutUrl}
                />
              ))}
            </div>
          </div>
        </article>
      </div>

      <SubscriptionPopup open={popupOpen} onClose={() => setPopupOpen(false)} />
    </section>
    </Typo>
  );
}
