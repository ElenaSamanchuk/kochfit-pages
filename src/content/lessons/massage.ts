import type { ArticleBlock, ProseDoc } from "@/content/tilda-dynamic";

/** Контент с живой Тильды kochfit.ru/massage (page28757455), без хрома шапки/подвала. */
const blocks: ArticleBlock[] = [
  {
    "t": "kinescope",
    "src": "https://kinescope.io/embed/5T8QSkChbS8Qv7Vv9hZYev"
  }
];

export const massageLesson = {
  path: "massage",
  slug: "massage",
  title: "Улучшаем работу ЖКТ через массаж живота",
  description: "Улучшаем работу ЖКТ через массаж живота",
  paragraphs: [],
  blocks,
  lesson: true,
} satisfies ProseDoc;
