import type { ArticleBlock, ProseDoc } from "@/content/tilda-dynamic";

/** Контент с живой Тильды kochfit.ru/breathtest (page23936424), без хрома шапки/подвала. */
const blocks: ArticleBlock[] = [
  {
    "t": "kinescope",
    "src": "https://kinescope.io/embed/kKFKzwvYmdN2aTGLnDBiPS"
  },
  {
    "t": "gallery",
    "images": [
      {
        "src": "/images/lessons/breathtest/01.jpg",
        "alt": "Тестирование дыхание"
      },
      {
        "src": "/images/lessons/breathtest/02.jpg",
        "alt": "Тестирование дыхание"
      }
    ]
  }
];

export const breathtestLesson = {
  path: "breathtest",
  slug: "breathtest",
  title: "Тестирование дыхание",
  description: "Тестирование дыхание",
  paragraphs: [],
  blocks,
  lesson: true,
} satisfies ProseDoc;
