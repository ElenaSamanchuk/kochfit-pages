import type { ArticleBlock, ProseDoc } from "@/content/tilda-dynamic";

/** Контент с живой Тильды kochfit.ru/teipirovaniehalusvalgus (page22238273), без хрома шапки/подвала. */
const blocks: ArticleBlock[] = [
  {
    "t": "kinescope",
    "src": "https://kinescope.io/embed/0hRkZwhMq1j2r1hfA9XsNd"
  },
  {
    "t": "kinescope",
    "src": "https://kinescope.io/embed/w5b9iZEEZoneU6xJbydCLx"
  }
];

export const teipirovaniehalusvalgusLesson = {
  path: "teipirovaniehalusvalgus",
  slug: "teipirovaniehalusvalgus",
  title: "ТЕЙПИРОВАНИЕ ХАЛЮС ВАЛЬГУС И ГОЛЕНОСТОПА",
  description: "ТЕЙПИРОВАНИЕ ХАЛЮС ВАЛЬГУС И ГОЛЕНОСТОПА",
  paragraphs: [],
  blocks,
  lesson: true,
} satisfies ProseDoc;
