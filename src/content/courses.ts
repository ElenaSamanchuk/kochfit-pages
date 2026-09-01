/**
 * Цены, checkout-ссылки и даты курсов — синхронизированы с kochfit.ru (актуальные цены).
 */

export const checkout = (tariffId: string) =>
  `https://v2.kochfit.ru/payments/tariff_${tariffId}/checkout`;

export function formatRub(amount: number): string {
  return `${amount.toLocaleString("ru-RU")} ₽`;
}

export type CatalogPriceDisplay = {
  oldPriceLabel: string;
  currentPriceLabel: string;
};

export type FixedPeriodTariff = {
  period: string;
  price: number;
  priceLabel: string;
  oldPriceLabel: string;
  checkoutUrl: string;
};

export type SubscriptionTariff = {
  price: number;
  priceLabel: string;
  pricePerMonthLabel: string;
  checkoutUrl: string;
};

export type MultiMonthCourseTariff = {
  tab: string;
  months: string;
  price: number;
  priceLabel: string;
  oldPriceLabel: string;
  checkoutUrl: string;
  xlLeft: string;
  xlWidth: string;
};

export const coursePricing = {
  beautyHealth: {
    /** Каталог на главной — Figma 2261:1785 */
    catalogPrices: {
      oldPriceLabel: "",
      currentPriceLabel: "от 2 490 ₽ / месяц",
    } satisfies CatalogPriceDisplay,
    /** Каталог на главной — kochfit.ru */
    catalogLabel: "от 2 490 ₽ / месяц",
    /** Hero курса — kochfit.ru/community */
    heroLabel: "от 2 490 ₽ / месяц",
    startBadge: "Старт с момента покупки",
    /** CTA по умолчанию — подписка «Стандарт» */
    defaultCheckout: checkout("lwNM9A"),
    standard: {
      subscription: {
        price: 2490,
        priceLabel: formatRub(2490),
        pricePerMonthLabel: "2 490 ₽ / месяц",
        checkoutUrl: checkout("lwNM9A"),
      } satisfies SubscriptionTariff,
      fixedPeriods: [
        {
          period: "1 месяц",
          price: 4790,
          priceLabel: formatRub(4790),
          oldPriceLabel: formatRub(7490),
          /** kochfit.ru/community — tariff_lwNM9A */
          checkoutUrl: checkout("lwNM9A"),
        },
        {
          period: "3 месяца",
          price: 12590,
          priceLabel: formatRub(12590),
          oldPriceLabel: formatRub(7490),
          /** kochfit.ru/community — tariff_yAl4rA */
          checkoutUrl: checkout("yAl4rA"),
        },
        {
          period: "6 месяцев",
          price: 25390,
          priceLabel: formatRub(25390),
          oldPriceLabel: formatRub(7490),
          /** kochfit.ru/community — tariff_RjQmLj */
          checkoutUrl: checkout("RjQmLj"),
        },
      ] satisfies FixedPeriodTariff[],
    },
    premium: {
      subscription: {
        price: 3990,
        priceLabel: formatRub(3990),
        pricePerMonthLabel: "3 990 ₽ / месяц",
        checkoutUrl: checkout("OPDMEA"),
      } satisfies SubscriptionTariff,
      fixedPeriods: [
        {
          period: "1 месяц",
          price: 7490,
          priceLabel: formatRub(7490),
          oldPriceLabel: "",
          /** kochfit.ru/community — tariff_OPDMEA */
          checkoutUrl: checkout("OPDMEA"),
        },
        {
          period: "3 месяца",
          price: 20590,
          priceLabel: formatRub(20590),
          oldPriceLabel: formatRub(7490),
          /** kochfit.ru/community — tariff_bPWm3w */
          checkoutUrl: checkout("bPWm3w"),
        },
        {
          period: "6 месяцев",
          price: 41190,
          priceLabel: formatRub(41190),
          oldPriceLabel: formatRub(7490),
          /** kochfit.ru/community — tariff_5j16VP */
          checkoutUrl: checkout("5j16VP"),
        },
      ] satisfies FixedPeriodTariff[],
    },
    /** kochfit.ru/sale — акционные цены (старая цена зачёркнута), скидочные чекауты v2 */
    sale: {
      standardFixedPeriods: [
        {
          period: "1 месяц",
          price: 3590,
          priceLabel: formatRub(3590),
          oldPriceLabel: formatRub(4790),
          checkoutUrl: checkout("4AOXwN"),
        },
        {
          period: "3 месяца",
          price: 8990,
          priceLabel: formatRub(8990),
          oldPriceLabel: formatRub(12590),
          checkoutUrl: checkout("1wV7jM"),
        },
        {
          period: "6 месяцев",
          price: 15990,
          priceLabel: formatRub(15990),
          oldPriceLabel: formatRub(25390),
          checkoutUrl: checkout("gPK2jY"),
        },
      ] satisfies FixedPeriodTariff[],
      premiumFixedPeriods: [
        {
          period: "1 месяц",
          price: 6290,
          priceLabel: formatRub(6290),
          oldPriceLabel: formatRub(7490),
          checkoutUrl: checkout("gPopA7"),
        },
        {
          period: "3 месяца",
          price: 14990,
          priceLabel: formatRub(14990),
          oldPriceLabel: formatRub(20590),
          checkoutUrl: checkout("aPzdwJ"),
        },
        {
          period: "6 месяцев",
          price: 26190,
          priceLabel: formatRub(26190),
          oldPriceLabel: formatRub(41190),
          checkoutUrl: checkout("4w7ZA6"),
        },
      ] satisfies FixedPeriodTariff[],
    },
  },
  pelvicFloor: {
    catalogPrices: {
      oldPriceLabel: "",
      currentPriceLabel: "от 10 490 ₽",
    } satisfies CatalogPriceDisplay,
    catalogLabel: "от 10 490 ₽",
    heroLabel: "10 490 ₽",
    startBadge: "Старт с момента покупки",
    accessLabel: "Доступ 3 месяца",
    defaultCheckout: checkout("5j1VPm"),
    tariff: {
      period: "3 месяца",
      price: 10490,
      priceLabel: formatRub(10490),
      oldPriceLabel: "",
      checkoutUrl: checkout("5j1VPm"),
    },
  },
  activePregnancy: {
    catalogPrices: {
      oldPriceLabel: "",
      currentPriceLabel: "от 10 490 ₽",
    } satisfies CatalogPriceDisplay,
    catalogLabel: "от 10 490 ₽",
    heroLabel: "от 10 490 ₽",
    startBadge: "Старт с момента покупки",
    defaultCheckout: checkout("RPeYPr"),
    tariffs: [
      {
        tab: "1 тариф",
        months: "3 месяца",
        price: 10490,
        priceLabel: formatRub(10490),
        oldPriceLabel: "",
        checkoutUrl: checkout("RPeYPr"),
        xlLeft: "xl:left-[30px]",
        xlWidth: "xl:w-[353px]",
      },
      {
        tab: "2 тариф",
        months: "5 месяцев",
        price: 12590,
        priceLabel: formatRub(12590),
        oldPriceLabel: formatRub(10490),
        checkoutUrl: checkout("nwnaAB"),
        xlLeft: "xl:left-[403px]",
        xlWidth: "xl:w-[355px]",
      },
      {
        tab: "3 тариф",
        months: "7 месяцев",
        price: 14690,
        priceLabel: formatRub(14690),
        oldPriceLabel: formatRub(10490),
        checkoutUrl: checkout("njR9wE"),
        xlLeft: "xl:left-[777px]",
        xlWidth: "xl:w-[353px]",
      },
    ] satisfies MultiMonthCourseTariff[],
  },
  postpartum: {
    catalogPrices: {
      oldPriceLabel: "",
      currentPriceLabel: "от 10 490 ₽",
    } satisfies CatalogPriceDisplay,
    catalogLabel: "от 10 490 ₽",
    heroLabel: "от 10 490 ₽",
    startBadge: "Старт с момента покупки",
    /** old-site/page26016408.html — pill «С первых дней после родов» */
    heroStartPill: "С первых дней после родов",
    defaultCheckout: checkout("5P63Av"),
    tariffs: [
      {
        tab: "1 тариф",
        months: "3 месяца",
        price: 10490,
        priceLabel: formatRub(10490),
        oldPriceLabel: "",
        checkoutUrl: checkout("5P63Av"),
        xlLeft: "xl:left-[30px]",
        xlWidth: "xl:w-[353px]",
      },
      {
        tab: "2 тариф",
        months: "5 месяцев",
        price: 12590,
        priceLabel: formatRub(12590),
        oldPriceLabel: formatRub(10490),
        checkoutUrl: checkout("0P5pjn"),
        xlLeft: "xl:left-[403px]",
        xlWidth: "xl:w-[355px]",
      },
      {
        tab: "3 тариф",
        months: "7 месяцев",
        price: 14690,
        priceLabel: formatRub(14690),
        oldPriceLabel: formatRub(10490),
        checkoutUrl: checkout("RPXbwE"),
        xlLeft: "xl:left-[777px]",
        xlWidth: "xl:w-[353px]",
      },
    ] satisfies MultiMonthCourseTariff[],
  },
} as const;

/** Зачёркнутая цена не должна дублировать текущую */
function validateOldPricePairs(
  location: string,
  priceLabel: string,
  oldPriceLabel: string,
): void {
  if (!oldPriceLabel) return;
  if (oldPriceLabel === priceLabel) {
    throw new Error(
      `${location}: oldPriceLabel must differ from priceLabel (${priceLabel})`,
    );
  }
}

function validateCoursePricing(): void {
  for (const tariff of coursePricing.beautyHealth.standard.fixedPeriods) {
    validateOldPricePairs(
      `beautyHealth.standard.${tariff.period}`,
      tariff.priceLabel,
      tariff.oldPriceLabel,
    );
  }
  for (const tariff of coursePricing.beautyHealth.premium.fixedPeriods) {
    validateOldPricePairs(
      `beautyHealth.premium.${tariff.period}`,
      tariff.priceLabel,
      tariff.oldPriceLabel,
    );
  }
  validateOldPricePairs(
    "pelvicFloor.tariff",
    coursePricing.pelvicFloor.tariff.priceLabel,
    coursePricing.pelvicFloor.tariff.oldPriceLabel,
  );
  validateOldPricePairs(
    "pelvicFloor.catalog",
    coursePricing.pelvicFloor.catalogPrices.currentPriceLabel,
    coursePricing.pelvicFloor.catalogPrices.oldPriceLabel,
  );
  for (const course of [
    coursePricing.activePregnancy,
    coursePricing.postpartum,
  ] as const) {
    for (const tariff of course.tariffs) {
      validateOldPricePairs(
        `${tariff.tab}`,
        tariff.priceLabel,
        tariff.oldPriceLabel,
      );
    }
    validateOldPricePairs(
      "catalog",
      course.catalogPrices.currentPriceLabel,
      course.catalogPrices.oldPriceLabel,
    );
  }
  validateOldPricePairs(
    "beautyHealth.catalog",
    coursePricing.beautyHealth.catalogPrices.currentPriceLabel,
    coursePricing.beautyHealth.catalogPrices.oldPriceLabel,
  );
}

validateCoursePricing();

/** Подписка «Стандарт» / «Премиум» — попап, standartsub/premiumsub, CTA на тарифах */
export const subscriptionPricing = {
  standard: coursePricing.beautyHealth.standard.subscription,
  premium: coursePricing.beautyHealth.premium.subscription,
  /** Checkout с ?subscription=1 (Stepan, 28.08.2026) */
  standardAltCheckout: `${checkout("4AOXwN")}?subscription=1`,
  premiumAltCheckout: `${checkout("gPopA7")}?subscription=1`,
} as const;
