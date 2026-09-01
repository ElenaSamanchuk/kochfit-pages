import type { ArticleBlock, ProseDoc } from "@/content/tilda-dynamic";

const img = (name: string) => `/images/lessons/tmj/${name}`;
const video = (id: string) => `https://kinescope.io/embed/${id}`;

/** Контент с живой Тильды kochfit.ru/tmj (page25017522). Видео видны сразу, не только в попапах. */
const blocks: ArticleBlock[] = [
  { t: "h2", text: "Височно-нижнечелюстной сустав (ВНЧС)" },
  { t: "img", src: img("01.jpg"), alt: "Височно-нижнечелюстной сустав (ВНЧС)" },
  { t: "kinescope", src: video("tUz4M63rRgbeMxBmzMaKAT") },

  { t: "h2", text: "Массаж лица, шеи и грудного отдела" },
  { t: "img", src: img("02.jpg"), alt: "Массаж лица, шеи и грудного отдела" },
  { t: "kinescope", src: video("4qAzatL7qY6HLrhjJBLT3k") },

  { t: "h2", text: "Убираем отеки с лица и шейно-воротниковой зоны" },
  { t: "img", src: img("03.jpg"), alt: "Убираем отеки с лица и шейно-воротниковой зоны" },
  { t: "kinescope", src: video("irtxbNirnbsYnyQu4Xw85C") },

  { t: "h2", text: "Убираем напряжение с шейного региона" },
  { t: "img", src: img("04.jpg"), alt: "Убираем напряжение с шейного региона" },
  { t: "kinescope", src: video("5HSBe9Bj4bZ7ojwtfWgmc3") },

  {
    t: "h2",
    text: "Высвобождение шейного региона через движение таза и позвоночника",
  },
  {
    t: "img",
    src: img("05.png"),
    alt: "Высвобождение шейного региона через движение таза и позвоночника",
  },
  { t: "kinescope", src: video("wynkLFkeELGnkoocmdAMVE") },

  { t: "h2", text: "Височно-нижнечелюстной сустав. Теория" },
  { t: "img", src: img("06.jpg"), alt: "Височно-нижнечелюстной сустав. Теория" },
  { t: "cta", href: "/tmjjoint", label: "Височно-нижнечелюстной сустав. Теория" },

  { t: "h2", text: "Массаж лица. Часть 2" },
  { t: "img", src: img("07.png"), alt: "Массаж лица. Часть 2" },
  { t: "kinescope", src: video("8M46akMji8nic5F5tyAs7m") },
];

export const tmjLesson = {
  path: "tmj",
  slug: "tmj",
  title: "Язык, лицо и работа с ВНЧС",
  description:
    "Уроки по языку, лицу, шее и височно-нижнечелюстному суставу: практика, массаж, снятие отёков и теория ВНЧС",
  paragraphs: [],
  blocks,
  lesson: true,
} satisfies ProseDoc;
