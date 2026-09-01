import type { ArticleBlock, ProseDoc } from "@/content/tilda-dynamic";

/** Контент с живой Тильды kochfit.ru/pitweb (page39500136), без хрома шапки/подвала. */
const blocks: ArticleBlock[] = [
  {
    "t": "cards",
    "items": [
      {
        "href": "",
        "src": "/images/lessons/pitweb/01.jpg",
        "alt": "Еда, эмоции, стресс",
        "title": "Еда, эмоции, стресс",
        "label": "Смотреть"
      },
      {
        "href": "",
        "src": "",
        "alt": "Юлия Жарова",
        "title": "Юлия Жарова",
        "label": "Смотреть"
      },
      {
        "href": "",
        "src": "/images/lessons/pitweb/02.jpg",
        "alt": "1 ч 30 м",
        "title": "1 ч 30 м",
        "label": "Смотреть"
      },
      {
        "href": "",
        "src": "",
        "alt": "Упражнение «Изюминка»: как не переесть и получить больше удовольствия от еды",
        "title": "Упражнение «Изюминка»: как не переесть и получить больше удовольствия от еды",
        "label": "Смотреть"
      },
      {
        "href": "",
        "src": "/images/lessons/pitweb/03.jpg",
        "alt": "Упражнение «Сёрфинг» для проживания эмоций и тяги к еде и не физиологического голода",
        "title": "Упражнение «Сёрфинг» для проживания эмоций и тяги к еде и не физиологического голода",
        "label": "Смотреть"
      },
      {
        "href": "https://drive.google.com/file/d/1pqmIpe3Qzdc9Ng3KoUbYQ8yza8mEjYQ_/view",
        "src": "/images/lessons/pitweb/04.jpg",
        "alt": "Чек-лист триггеров переедания",
        "title": "Чек-лист триггеров переедания",
        "label": "Перейти"
      }
    ]
  }
];

export const pitwebLesson = {
  path: "pitweb",
  slug: "pitweb",
  title: "Психолог Юлия Жарова",
  description: "Психолог Юлия Жарова",
  paragraphs: [],
  blocks,
  lesson: true,
} satisfies ProseDoc;
