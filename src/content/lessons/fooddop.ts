import type { ArticleBlock, ProseDoc } from "@/content/tilda-dynamic";

/** Контент с живой Тильды kochfit.ru/fooddop (page39497957), без хрома шапки/подвала. */
const blocks: ArticleBlock[] = [
  {
    "t": "cards",
    "items": [
      {
        "href": "/fbasket",
        "src": "",
        "alt": "Продуктовая корзина",
        "title": "Продуктовая корзина",
        "label": "Открыть"
      },
      {
        "href": "/blog/1",
        "src": "",
        "alt": "Расчет КБЖУ",
        "title": "Расчет КБЖУ",
        "label": "Открыть"
      },
      {
        "href": "/blog/2",
        "src": "",
        "alt": "Расчет ИМТ",
        "title": "Расчет ИМТ",
        "label": "Открыть"
      },
      {
        "href": "/blog/3",
        "src": "",
        "alt": "БЖУ функции и нормы",
        "title": "БЖУ функции и нормы",
        "label": "Открыть"
      },
      {
        "href": "/blog/7",
        "src": "",
        "alt": "Как использовать Fat Secret",
        "title": "Как использовать Fat Secret",
        "label": "Открыть"
      },
      {
        "href": "/blog/5",
        "src": "",
        "alt": "Питание и метаболизм",
        "title": "Питание и метаболизм",
        "label": "Открыть"
      },
      {
        "href": "/blog/10",
        "src": "",
        "alt": "Как считать и варить крупу",
        "title": "Как считать и варить крупу",
        "label": "Открыть"
      },
      {
        "href": "/blog/8",
        "src": "",
        "alt": "Сахарозаменители",
        "title": "Сахарозаменители",
        "label": "Открыть"
      },
      {
        "href": "/pitweb",
        "src": "",
        "alt": "Психолог Юлия Жарова",
        "title": "Психолог Юлия Жарова",
        "label": "Открыть"
      }
    ]
  }
];

export const fooddopLesson = {
  path: "fooddop",
  slug: "fooddop",
  title: "Дополнительные материалы - питание",
  description: "Дополнительные материалы - питание",
  paragraphs: [],
  blocks,
  lesson: true,
} satisfies ProseDoc;
