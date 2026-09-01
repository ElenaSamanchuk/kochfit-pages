import type { ArticleBlock, ProseDoc } from "@/content/tilda-dynamic";

/** Контент с живой Тильды kochfit.ru/mtd (page23287193), без хрома шапки/подвала. */
const blocks: ArticleBlock[] = [
  {
    "t": "cards",
    "items": [
      {
        "href": "/mtdbreath",
        "src": "",
        "alt": "Теория. МТД, дыхание",
        "title": "Теория. МТД, дыхание",
        "label": "Открыть"
      },
      {
        "href": "/breathtest",
        "src": "",
        "alt": "Тестирование дыхания",
        "title": "Тестирование дыхания",
        "label": "Открыть"
      },
      {
        "href": "",
        "src": "",
        "alt": "Вебинар. Дыхание и грудобрюшная диафрагма",
        "title": "Вебинар. Дыхание и грудобрюшная диафрагма",
        "label": "Смотреть"
      },
      {
        "href": "",
        "src": "",
        "alt": "Вебинар. Мышцы тазового дна",
        "title": "Вебинар. Мышцы тазового дна",
        "label": "Смотреть"
      },
      {
        "href": "/massage",
        "src": "",
        "alt": "Улучшаем работу ЖКТ через массаж живота",
        "title": "Улучшаем работу ЖКТ через массаж живота",
        "label": "Открыть"
      },
      {
        "href": "/mtdpractice",
        "src": "",
        "alt": "Практика",
        "title": "Практика",
        "label": "Открыть"
      }
    ]
  },
  {
    "t": "h2",
    "text": "Вебинар. Дыхание и грудобрюшная диафрагма"
  },
  {
    "t": "kinescope",
    "src": "https://kinescope.io/embed/5wp2AvRvDh8aNcMJC4pzc4"
  },
  {
    "t": "h2",
    "text": "Вебинар. Мышцы тазового дна"
  },
  {
    "t": "kinescope",
    "src": "https://kinescope.io/embed/m9g21CUHgQT8PqQXLmkR9a"
  }
];

export const mtdLesson = {
  path: "mtd",
  slug: "mtd",
  title: "МТД /ДЫХАНИЕ/ЖИВОТ",
  description: "МТД /ДЫХАНИЕ/ЖИВОТ",
  paragraphs: [],
  blocks,
  lesson: true,
} satisfies ProseDoc;
