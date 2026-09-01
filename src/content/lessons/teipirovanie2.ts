import type { ArticleBlock, ProseDoc } from "@/content/tilda-dynamic";

/** Контент с живой Тильды kochfit.ru/teipirovanie2 (page18422733), без хрома шапки/подвала. */
const blocks: ArticleBlock[] = [
  {
    "t": "list",
    "ordered": false,
    "items": [
      "‼️ Всегда перед нанесением тейпов протираем кожу спиртовыми салфетками",
      "‼️ Сам тейп не натягиваем, снимаем защитную плёнку и клеим центр на надутый живот, концы на сдутый живот",
      "‼️ Тейпы носим 5 дней, затем 5 дней отдыха<br/>Таких 4-5 циклов . То есть полный цикл тейпирования составит 40-50 дней",
      "‼️Если диастаз совсем небольшой (1-2 см вверх/вниз от пупка) делаем тейпирование пупочного кольца , а не диастаз",
      "‼️Параллельно выполняем упражнения"
    ]
  },
  {
    "t": "p",
    "html": "Тейпы лишь инструмент , но хороший инструмент для достижения результата, они не сделают чуда без вашего дополнительного участия , не забываем про регулярные упражнения"
  },
  {
    "t": "gallery",
    "images": [
      {
        "src": "/images/lessons/teipirovanie2/01.png",
        "alt": "Тейпирование диастаза"
      },
      {
        "src": "/images/lessons/teipirovanie2/02.png",
        "alt": "Тейпирование диастаза"
      },
      {
        "src": "/images/lessons/teipirovanie2/03.png",
        "alt": "Тейпирование диастаза"
      }
    ]
  },
  {
    "t": "img",
    "src": "/images/lessons/teipirovanie2/07.jpg",
    "alt": "Тейпирование диастаза"
  },
  {
    "t": "img",
    "src": "/images/lessons/teipirovanie2/08.png",
    "alt": "Тейпирование диастаза"
  },
  {
    "t": "img",
    "src": "/images/lessons/teipirovanie2/09.png",
    "alt": "Тейпирование диастаза"
  },
  {
    "t": "img",
    "src": "/images/lessons/teipirovanie2/10.jpg",
    "alt": "Тейпирование диастаза"
  },
  {
    "t": "kinescope",
    "src": "https://kinescope.io/embed/wfBxLU2zhLAHxvdrYgjwFL"
  },
  {
    "t": "img",
    "src": "/images/lessons/teipirovanie2/11.jpg",
    "alt": "Тейпирование диастаза"
  },
  {
    "t": "kinescope",
    "src": "https://kinescope.io/embed/hLsHGJhBVRBF21sVXH3fm4"
  }
];

export const teipirovanie2Lesson = {
  path: "teipirovanie2",
  slug: "teipirovanie2",
  title: "Тейпирование диастаза",
  description: "Тейпы лишь инструмент , но хороший инструмент для достижения результата, они не сделают чуда без вашего дополнительного участия , не забываем про регулярные уп",
  paragraphs: [],
  blocks,
  lesson: true,
} satisfies ProseDoc;
