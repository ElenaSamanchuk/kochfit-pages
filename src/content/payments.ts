import {
  checkout,
  coursePricing,
  formatRub,
  subscriptionPricing,
} from "@/content/courses";

export type PaymentOffer = {
  slug: string;
  title: string;
  productName: string;
  price: number;
  priceLabel: string;
  ctaLabel: string;
  /** Канонический path на kochfit.ru (если slug ≠ URL) */
  path?: string;
  note?: string;
  /** Tilda-style hash checkout — работает на старой корзине; на новом сайте ведём на v2 или mailto */
  orderHash?: string;
  checkoutUrl?: string;
  giftForm?: boolean;
};

export const paymentOffers: PaymentOffer[] = [
  {
    slug: "special_gift_for_pregnant7",
    title: "Активная беременность 7 мес. в подарок",
    productName: "Онлайн курс Активная беременность 7 подарок",
    price: 11190,
    priceLabel: formatRub(11190),
    ctaLabel: "Купить",
    checkoutUrl: "https://v2.kochfit.ru/",
    giftForm: true,
    note: "Специальное предложение: курс в подарок",
  },
  {
    slug: "special_gift_pack1",
    title: "Пакет №1: Активная беременность + Восстановление после родов",
    productName: "Пакет 1 Активная беременность + Восстановление после родов",
    price: 15390,
    priceLabel: formatRub(15390),
    ctaLabel: "Купить",
    checkoutUrl: "https://v2.kochfit.ru/",
    giftForm: true,
  },
  {
    slug: "special_gift_pack2",
    title: "Пакет №2: Восстановление после родов + МТД и дыхание",
    productName: "Пакет 2 Восстановление + МТД",
    price: 13990,
    priceLabel: formatRub(13990),
    ctaLabel: "Купить",
    checkoutUrl: "https://v2.kochfit.ru/",
    giftForm: true,
  },
  {
    slug: "special_gift_pack3",
    title: "Пакет №3: МТД и дыхание + Красота и здоровье стандарт",
    productName: "Пакет 3 МТД + Красота и здоровье",
    price: 12790,
    priceLabel: formatRub(12790),
    ctaLabel: "Купить",
    checkoutUrl: "https://v2.kochfit.ru/",
    giftForm: true,
  },
  {
    slug: "special_gift_recovery3",
    title: "Восстановление после родов 3 мес. в подарок",
    productName: "Восстановление после родов 3 подарок",
    price: 7990,
    priceLabel: formatRub(7990),
    ctaLabel: "Купить",
    checkoutUrl: "https://v2.kochfit.ru/",
    giftForm: true,
  },
  {
    slug: "special_gift_recovery5",
    title: "Восстановление после родов 5 мес. в подарок",
    productName: "Восстановление после родов 5 подарок",
    price: 9590,
    priceLabel: formatRub(9590),
    ctaLabel: "Купить",
    checkoutUrl: "https://v2.kochfit.ru/",
    giftForm: true,
  },
  {
    slug: "special_gift_recovery7",
    title: "Восстановление после родов 7 мес. в подарок",
    productName: "Восстановление после родов 7 подарок",
    price: 11190,
    priceLabel: formatRub(11190),
    ctaLabel: "Купить",
    checkoutUrl: "https://v2.kochfit.ru/",
    giftForm: true,
  },
  {
    slug: "special_recovery3",
    title: "Восстановление после родов 3 мес.",
    productName: "Восстановление после родов 3",
    price: 7990,
    priceLabel: formatRub(7990),
    ctaLabel: "Купить",
    checkoutUrl: "https://v2.kochfit.ru/",
  },
  {
    slug: "special_recovery5",
    title: "Восстановление после родов 5 мес.",
    productName: "Восстановление после родов 5",
    price: 9590,
    priceLabel: formatRub(9590),
    ctaLabel: "Купить",
    checkoutUrl: "https://v2.kochfit.ru/",
  },
  {
    slug: "special_recovery7",
    title: "Восстановление после родов 7 мес.",
    productName: "Восстановление после родов 7",
    price: 11190,
    priceLabel: formatRub(11190),
    ctaLabel: "Купить",
    checkoutUrl: "https://v2.kochfit.ru/",
  },
  {
    slug: "standartsub",
    title: "Подписка «Красота и здоровье» Стандарт",
    productName: "Красота и здоровье Стандарт подписка",
    price: 2490,
    priceLabel: formatRub(2490),
    ctaLabel: "Оформить подписку",
    checkoutUrl: subscriptionPricing.standardAltCheckout,
  },
  {
    slug: "premiumsub",
    title: "Подписка «Красота и здоровье» Премиум",
    productName: "Красота и здоровье Премиум подписка",
    price: 3990,
    priceLabel: formatRub(3990),
    ctaLabel: "Оформить подписку",
    checkoutUrl: subscriptionPricing.premiumAltCheckout,
  },
  {
    slug: "basket",
    title: "Персональная работа",
    productName: "ПЕРСОНАЛЬНО",
    price: 7000,
    priceLabel: formatRub(7000),
    ctaLabel: "Участвую!",
    checkoutUrl: "https://v2.kochfit.ru/",
    note: "Индивидуальное сопровождение с Юлией Кочкиной",
  },
  {
    slug: "testpay",
    title: "Тестовая неделя «Красота и здоровье»",
    productName: "Тестовая неделя",
    price: 990,
    priceLabel: formatRub(990),
    ctaLabel: "Купить за 990 ₽",
    /** kochfit.ru/test7 — tariff_LwpWAM */
    checkoutUrl: checkout("LwpWAM"),
  },
  {
    slug: "diastasisstart",
    title: "Диастаз",
    productName: "Диастаз",
    price: 0,
    priceLabel: "По запросу",
    ctaLabel: "Купить",
    checkoutUrl: "https://v2.kochfit.ru/",
  },
  {
    slug: "specialr",
    title: "Восстановление после родов, спецпредложение",
    productName: "Восстановление после родов спецпредложение",
    price: 7990,
    priceLabel: formatRub(7990),
    ctaLabel: "Купить",
    checkoutUrl: "https://v2.kochfit.ru/",
  },
  {
    slug: "test7",
    title: "Оплата тестовой недели",
    productName: "Тестовая неделя",
    price: 990,
    priceLabel: formatRub(990),
    ctaLabel: "Купить",
    checkoutUrl: checkout("LwpWAM"),
  },
  {
    slug: "actberemenost",
    title: "Активная беременность",
    productName: "Активная беременность",
    /** kochfit.ru/actberemenost — спецлендинг, не основной /for_pregnant */
    price: 7900,
    priceLabel: formatRub(7900),
    ctaLabel: "Купить",
    checkoutUrl: coursePricing.activePregnancy.defaultCheckout,
  },
  {
    slug: "activation_pack",
    title: "Активация пакета",
    productName: "Активация пакета",
    price: 0,
    priceLabel: "По запросу",
    ctaLabel: "Купить",
    checkoutUrl: "https://v2.kochfit.ru/",
  },
];

export const saleTariffs = [
  {
    name: "Стандарт (подписка)",
    checkoutUrl: coursePricing.beautyHealth.standard.subscription.checkoutUrl,
  },
  {
    name: "Премиум (подписка)",
    checkoutUrl: coursePricing.beautyHealth.premium.subscription.checkoutUrl,
  },
  {
    name: "Стандарт (alt checkout)",
    checkoutUrl: subscriptionPricing.standardAltCheckout,
  },
  {
    name: "Премиум (alt checkout)",
    checkoutUrl: subscriptionPricing.premiumAltCheckout,
  },
  {
    name: "Тариф 3",
    checkoutUrl: "https://v2.kochfit.ru/payments/tariff_gPK2jY/checkout",
  },
  {
    name: "Тариф 4",
    checkoutUrl: "https://v2.kochfit.ru/payments/tariff_gPopA7/checkout",
  },
  {
    name: "Тариф 5",
    checkoutUrl: "https://v2.kochfit.ru/payments/tariff_aPzdwJ/checkout",
  },
] as const;

export function getPaymentOffer(slug: string) {
  return paymentOffers.find((p) => p.slug === slug);
}
