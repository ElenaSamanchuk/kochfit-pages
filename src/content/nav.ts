import { externalLinks } from "@/content/links";
import { routes } from "@/content/routes";

/**
 * Пункты выезжающего меню — как t450 на старом kochfit.ru (#menuopen).
 * Цвета в UI — голубая схема, не оливковая.
 */
export const menuLinks = [
  { href: routes.home, label: "Главная" },
  { href: routes.beautyHealth, label: "Красота и здоровье" },
  { href: routes.postpartum, label: "Восстановление после родов" },
  { href: routes.activePregnancy, label: "Активная беременность" },
  { href: routes.pelvicFloor, label: "МТД" },
  { href: routes.journal, label: "Полезный блог" },
  { href: routes.result, label: "Отзывы и результаты участниц" },
  { href: routes.equipment, label: "Оборудование для тренировок" },
  { href: "/info_referral", label: "Реферальная программа" },
] as const;

export const menuSocials = [
  { href: externalLinks.instagram, label: "Instagram" },
  { href: externalLinks.telegramChannel, label: "Telegram" },
  { href: externalLinks.youtube, label: "YouTube" },
  { href: externalLinks.vk, label: "ВКонтакте" },
] as const;

export const menuLogin = {
  href: externalLinks.login,
  label: "Личный кабинет",
} as const;
