import type { ArticleBlock, ProseDoc } from "@/content/tilda-dynamic";

/** Контент с живой Тильды kochfit.ru/tmtd (page43125711), без хрома шапки/подвала. */
const blocks: ArticleBlock[] = [
  {
    "t": "cards",
    "items": [
      {
        "href": "/teipirovanie2",
        "src": "/images/lessons/teipirovanie2/01.png",
        "alt": "Тейпирование: диастаз",
        "title": "Тейпирование: диастаз",
        "label": "Открыть"
      },
      {
        "href": "/teipirovanie1",
        "src": "/images/lessons/teipirovanie1/01.jpg",
        "alt": "Тейпирование шрамов",
        "title": "Тейпирование шрамов",
        "label": "Открыть"
      },
      {
        "href": "/teipirovanie3",
        "src": "/images/lessons/teipirovanie3/01.jpg",
        "alt": "Тейпирование пупочного кольца",
        "title": "Тейпирование пупочного кольца",
        "label": "Открыть"
      }
    ]
  }
];

export const tmtdLesson = {
  path: "tmtd",
  slug: "tmtd",
  title: "Тейпирование",
  description: "Тейпирование",
  paragraphs: [],
  blocks,
  lesson: true,
} satisfies ProseDoc;
