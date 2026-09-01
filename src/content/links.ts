import { coursePricing, subscriptionPricing } from "@/content/courses";

/** Внешние ссылки и относительные пути нового проекта */
export const externalLinks = {
  site: "/",
  login: "https://v2.kochfit.ru/login",
  platform: "https://v2.kochfit.ru/",
  blog: "/journal",
  results: "/result",
  trainer: "/person",
  telegramBot: "tg://resolve?domain=Predkoch_bot",
  telegramChannel: "tg://resolve?domain=kochfitofficial",
  vk: "https://vk.com/kochfit",
  youtube: "https://www.youtube.com/channel/UCtmQXxlgEX7WIOQo_sSybMA",
  instagram: "https://www.instagram.com/kochkina_yulia/",
  email: "mailto:info@kochfit.ru",
  supportEmail: "mailto:info@kochfit.ru",
  equipment: "/equipment",
  personalWork: "/basket",
  faq: "/faq",
  /** Бланк тестов ОДА со страницы /testoda (Тильда page23936452) */
  testOdaBlank: "https://disk.yandex.ru/d/FRI5pt8v9SbHNQ",
  support: "/suport",
  work: "/work",
  yearResults: "/year-results",
  legal: {
    oferta: "/oferta",
    partOferta: "/part_oferta",
    privacy: "/privacy",
    dataConsent: "/data-consent",
    consent: "/consent",
    deleteAccount: "/del",
  },
  /**
   * Бесплатная тренировка «Высвобождение шейного региона через движение таза
   * и позвоночника» — Kinescope-видео из попапа старого сайта (page27478399,
   * #popup:youtubevideo_free). Заголовок ролика совпадает с текстом карточки hero.
   */
  freeWorkoutVideo: "https://kinescope.io/embed/wynkLFkeELGnkoocmdAMVE",
  appStore: "https://apps.apple.com/ru/app/kochfit/id6503430105",
  googlePlay:
    "https://play.google.com/store/apps/details?id=com.kochfit.twopcs&hl=ru",
  /** CTA «купить» — checkout v2.kochfit.ru (тариф по умолчанию для каждого курса) */
  buy: {
    beautyHealth: coursePricing.beautyHealth.defaultCheckout,
    pelvicFloor: coursePricing.pelvicFloor.defaultCheckout,
    postpartum: coursePricing.postpartum.defaultCheckout,
    activePregnancy: coursePricing.activePregnancy.defaultCheckout,
  },
  /**
   * CTA «Оформить подписку» на тарифах «Красота и здоровье»
   * (Stepan, 28.08.2026 — tariff_4AOXwN / tariff_gPopA7 + ?subscription=1)
   */
  subscription: {
    standard: subscriptionPricing.standardAltCheckout,
    premium: subscriptionPricing.premiumAltCheckout,
  },
} as const;
