import type { ArticleBlock, ProseDoc } from "@/content/tilda-dynamic";

/** Контент с живой Тильды kochfit.ru/food (page39436744), без хрома шапки/подвала. */
const blocks: ArticleBlock[] = [
  {
    "t": "cards",
    "items": [
      {
        "href": "/fbasket",
        "src": "/images/lessons/food/01.png",
        "alt": "Продуктовая корзина",
        "title": "Продуктовая корзина",
        "label": "Перейти"
      },
      {
        "href": "/recipes",
        "src": "/images/lessons/food/02.png",
        "alt": "Примеры приемов пищи",
        "title": "Примеры приемов пищи",
        "label": "Перейти"
      },
      {
        "href": "/fooddop",
        "src": "/images/lessons/food/03.png",
        "alt": "Дополнительные материалы",
        "title": "Дополнительные материалы",
        "label": "Перейти"
      }
    ]
  }
];

export const foodLesson = {
  path: "food",
  slug: "food",
  title: "Питание",
  description: "Питание",
  paragraphs: [],
  blocks,
  lesson: true,
} satisfies ProseDoc;
