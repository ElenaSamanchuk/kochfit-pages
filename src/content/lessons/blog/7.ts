import type { ArticleBlock, ProseDoc } from "@/content/tilda-dynamic";

/** Контент с живой Тильды kochfit.ru/blog/7 (page7699345), без хрома шапки/подвала. */
const blocks: ArticleBlock[] = [
  {
    "t": "p",
    "html": "Питание"
  },
  {
    "t": "kinescope",
    "src": "https://kinescope.io/embed/mH4cTyZFPun8ZDHDEnRcDy"
  }
];

export const blog7Lesson = {
  path: "blog/7",
  slug: "7",
  title: "Как пользоваться Fat Secret",
  description: "Питание",
  paragraphs: [],
  blocks,
  lesson: true,
} satisfies ProseDoc;
