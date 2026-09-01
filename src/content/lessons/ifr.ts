import type { ArticleBlock, ProseDoc } from "@/content/tilda-dynamic";

const img = (name: string) => `/images/lessons/ifr/${name}`;
const video = (id: string) => `https://kinescope.io/embed/${id}`;

/** Контент с живой Тильды kochfit.ru/ifr (page23285224): ряд карточек + видео. */
const blocks: ArticleBlock[] = [
  {
    t: "cards",
    items: [
      {
        href: "/ifrtheory",
        src: img("02.jpg"),
        alt: "МФР теория",
        title: "МФР теория",
        label: "Перейти",
      },
      {
        href: "",
        src: img("01.jpg"),
        alt: "Миофасциальный релиз, комплекс на все тело",
        title: "Миофасциальный релиз, комплекс на все тело",
        label: "Смотреть",
      },
      {
        href: "",
        src: img("03.jpg"),
        alt: "МФР практика",
        title: "МФР практика",
        label: "Смотреть",
      },
    ],
  },
  { t: "h2", text: "Миофасциальный релиз, комплекс на все тело" },
  { t: "kinescope", src: video("uuqkSF1k9pcYoTGhj8Snb3") },
  { t: "h2", text: "МФР практика" },
  { t: "kinescope", src: video("fd7eKNnMvg5MU2rw1psxa6") },
];

export const ifrLesson = {
  path: "ifr",
  slug: "ifr",
  title: "2. МФР",
  description: "Миофасциальный релиз: теория, комплекс на всё тело и практика",
  paragraphs: [],
  blocks,
  lesson: true,
} satisfies ProseDoc;
