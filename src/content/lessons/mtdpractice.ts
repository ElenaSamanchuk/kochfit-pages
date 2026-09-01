import type { ArticleBlock, ProseDoc } from "@/content/tilda-dynamic";

/** Контент с живой Тильды kochfit.ru/mtdpractice (page25778439), без хрома шапки/подвала. */
const blocks: ArticleBlock[] = [
  {
    "t": "h2",
    "text": "Согласование тазовой и грудобрюшной диафрагмы"
  },
  {
    "t": "kinescope",
    "src": "https://kinescope.io/embed/w9bavEkWh8TvFHY7SmQt4n"
  },
  {
    "t": "h2",
    "text": "Дыхание и МТД"
  },
  {
    "t": "kinescope",
    "src": "https://kinescope.io/embed/ijqfy4TfDp7fAd5tMk1Fmb"
  },
  {
    "t": "h2",
    "text": "Дыхание с полотенцем"
  },
  {
    "t": "kinescope",
    "src": "https://kinescope.io/embed/s57ne19cYUBEZeKGRBE5sZ"
  },
  {
    "t": "h2",
    "text": "Высвобождение ТБС через МТД"
  },
  {
    "t": "kinescope",
    "src": "https://kinescope.io/embed/uQZXx36B5q2KKsTTBWYKzG"
  },
  {
    "t": "h2",
    "text": "Учимся подключать МТД и нижнюю часть живота на выдохе"
  },
  {
    "t": "kinescope",
    "src": "https://kinescope.io/embed/87gzB4y4CuPcQrqPiZ9uGd"
  },
  {
    "t": "h2",
    "text": "Дыхание в задние ребра. Стабилизация поясницы через дыхание"
  },
  {
    "t": "kinescope",
    "src": "https://kinescope.io/embed/5dQGedqLBJG3UqLDctoqV3"
  }
];

export const mtdpracticeLesson = {
  path: "mtdpractice",
  slug: "mtdpractice",
  title: "МТД/Дыхание/Живот практика",
  description: "МТД/Дыхание/Живот практика",
  paragraphs: [],
  blocks,
  lesson: true,
} satisfies ProseDoc;
