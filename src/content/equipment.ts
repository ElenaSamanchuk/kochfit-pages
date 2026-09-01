/** Данные страницы /equipment — Figma 2351:10228 (август 2025, голубая схема) */

export type EquipmentCategory =
  | "Для всех тренировок"
  | "Коррекция"
  | "Силовая"
  | "Новое";

export type EquipmentLink = {
  label: string;
  url: string;
};

export type EquipmentItem = {
  id: string;
  /** Figma frame node id карточки */
  figmaNode: string;
  name: string;
  category: EquipmentCategory;
  /** 0–100, для шкалы «важность» */
  importance: number;
  image: string;
  /** Figma cover crop — absolute positioning inside 94px cover (xl+) */
  imageClass?: string;
  description: string;
  replace: string | null;
  /** Подпись кнопки на карточке — Figma: mat = «Ссылки, рекомендации», остальные = «Ссылки» */
  buttonLabel: string;
  advice: { label: string; text: string };
  best: EquipmentLink[];
  other: EquipmentLink[];
};

export type EquipmentShop = {
  shop: string;
  code: string;
  url: string;
};

export const equipmentIntro = {
  title: "Необходимое оборудование для тренировок на курсе",
  hint: "Нажмите «Подробнее», чтобы увидеть рекомендации и ссылки на проверенные варианты оборудования",
};

/** Блок «Все оборудование в одном месте» в модалке инвентаря */
export const showEquipmentShops = false;

const hiddenEquipmentShopHost = "structura.shop";

/** Ссылки на structura.shop скрыты в UI, данные в массивах сохраняются. */
export function isHiddenEquipmentShopUrl(url: string): boolean {
  try {
    return (
      new URL(url).hostname.replace(/^www\./, "") === hiddenEquipmentShopHost
    );
  } catch {
    return url.includes(hiddenEquipmentShopHost);
  }
}

export function visibleEquipmentLinks(links: EquipmentLink[]): EquipmentLink[] {
  return links.filter((link) => !isHiddenEquipmentShopUrl(link.url));
}

export function visibleEquipmentShops(
  shops: EquipmentShop[] = equipmentShops,
): EquipmentShop[] {
  return shops.filter((shop) => !isHiddenEquipmentShopUrl(shop.url));
}

export function visibleEquipmentItem(item: EquipmentItem): EquipmentItem {
  return {
    ...item,
    best: visibleEquipmentLinks(item.best),
    other: visibleEquipmentLinks(item.other),
  };
}

export const equipmentShops: EquipmentShop[] = [
  { shop: "restore_roller", code: "Кочкина", url: "https://fitnessroller.ru/" },
  { shop: "structura.shop", code: "Kochkina", url: "https://structura.shop/" },
];

export const equipmentItems: EquipmentItem[] = [
  {
    id: "mat",
    figmaNode: "2351:10232",
    name: "Коврик для фитнеса",
    category: "Для всех тренировок",
    importance: 98,
    image: "mat.webp",
    description:
      "Создаёт комфорт и устойчивость во время занятий, снижает нагрузку на суставы и предотвращает скольжение, обеспечивая безопасное и эффективное выполнение упражнений",
    replace: "Можно заниматься на ковре без спортивного коврика",
    buttonLabel: "Ссылки, рекомендации",
    advice: {
      label: "Рекомендации:",
      text: "Выбирайте нескользящий коврик удобного размера и достаточной толщины для защиты суставов, который легко чистится и держит форму",
    },
    best: [
      {
        label: "Коврик для фитнеса двусторонний",
        url: "https://structura.shop/mats",
      },
      {
        label: "Коврик для йоги фитнеса нескользящий",
        url: "https://www.wildberries.ru/catalog/294774245/detail.aspx",
      },
    ],
    other: [
      {
        label: "Коврик для йоги и фитнеса нескользящий универсальный",
        url: "https://www.ozon.ru/product/kovrik-dlya-yogi-i-fitnesa-neskolzyashchiy-universalnyy-3020925841/?at=MZtvmvX5RCXzZ3A0sZ7Y39BhORYN8XhKD0o4YSBDJyNj",
      },
    ],
  },
  {
    id: "balls",
    figmaNode: "2351:10256",
    name: "Мягкие массажные мячи (мячи Франклина), 2 шт.",
    category: "Коррекция",
    importance: 85,
    image: "balls.webp",
    imageClass:
      "absolute h-[133.89%] left-[-0.01%] max-w-none top-[-16.65%] w-[115.43%] object-cover max-xl:inset-0 max-xl:h-full max-xl:w-full max-xl:left-0 max-xl:top-0 max-xl:object-cover",
    description:
      "Для выполнения упражнения вам потребуются два массажных мяча одинакового размера, диаметром примерно 10–12 см.",
    /** Перенос как в макете (xl / 376px): «…мягкие» → «мячи» */
    replace: "Мяч для большого тенниса / детские шипованные мягкие\nмячи",
    buttonLabel: "Ссылки",
    advice: {
      label: "Рекомендации:",
      text: "Начинающим рекомендуется использовать более мягкие мячи. Если возникает боль или выраженный дискомфорт, мячи можно и следует слегка сдуть",
    },
    best: [
      {
        label: "Мячи FRANKLIN 12 см",
        url: "https://fitnessroller.ru/massajnoe-oborudovanie/massajnie-myachi/igolchatie-myachi/myachi-dlya-relaksatsii-franklin-method-easy-grip-set/",
      },
      {
        label: "Мячи массажные мягкие, 10 см, 2 шт",
        url: "https://www.wildberries.ru/catalog/114201663/detail.aspx?targetUrl=MS&size=205259798",
      },
    ],
    other: [
      { label: "Массажные мячи 11 см", url: "https://ozon.ru/t/V0EVQYQ" },
    ],
  },
  {
    id: "weights",
    figmaNode: "2351:10278",
    name: "Гантели/ гири / набор разборных гантелей",
    category: "Силовая",
    importance: 70,
    image: "weights.webp",
    imageClass:
      "absolute h-[139.24%] left-[0.06%] max-w-none top-[-11.16%] w-[102.01%] object-cover max-xl:inset-0 max-xl:h-full max-xl:w-full max-xl:left-0 max-xl:top-0 max-xl:object-cover",
    description:
      "Разборные гантели универсальны для дома: они позволяют регулировать вес и постепенно увеличивать нагрузку. Альтернатива, гири или обычные гантели",
    replace: "Тренироваться с собственным весом / 5 л бутыли с водой / книги в пакете",
    buttonLabel: "Ссылки",
    advice: {
      label: "Рекомендации:",
      text: "Начинайте с гирь от 4 кг или гантелей по 2 кг. Увеличивайте вес постепенно, соблюдая технику. Для прогресса удобны разборные гантели",
    },
    best: [
      {
        label: "Гантели разборные кейс 20 кг",
        url: "https://www.wildberries.ru/catalog/13631109/detail.aspx?targetUrl=MS&size=41181482",
      },
    ],
    other: [
      {
        label: "Гиря 4 кг чугунная спортивная для фитнеса",
        url: "https://www.ozon.ru/product/girya-4-kg-1611448288/",
      },
      {
        label: "Гиря 4 кг",
        url: "https://www.wildberries.ru/catalog/208633824/detail.aspx?targetUrl=EX",
      },
    ],
  },
  {
    id: "band",
    figmaNode: "2351:10300",
    name: "Пилатес-лента от 180 см",
    category: "Для всех тренировок",
    importance: 60,
    image: "band.webp",
    imageClass:
      "absolute h-[150.91%] left-[0.04%] max-w-none top-[-25.44%] w-[117.52%] object-cover max-xl:inset-0 max-xl:h-full max-xl:w-full max-xl:left-0 max-xl:top-0 max-xl:object-cover",
    description:
      "Оптимальная длина, от 180 до 200 см, что обеспечивает комфорт и удобство в использовании",
    replace:
      "Шарф или пояс. Но наиболее удобным и эффективным решением всё же остаётся специальная лента",
    buttonLabel: "Ссылки",
    advice: {
      label: "Рекомендации:",
      text: "Натяжение рекомендуется выбирать лёгкое или среднее, такой уровень подходит для безопасной и эффективной работы",
    },
    best: [
      {
        label: "Эспандер ленточный 2 м",
        url: "https://structura.shop/elastic",
      },
      {
        label: "Эспандер ленточный широкий 1,8 м INDIGO Sport",
        url: "https://www.wildberries.ru/catalog/25780059/detail.aspx",
      },
    ],
    other: [
      {
        label: "Лента эластичная для фитнеса 180 см",
        url: "https://www.ozon.ru/product/lenta-elastichnaya-dlya-fitnesa-180sm-espander-lentochnyy-fitnes-rezinka-indigo-medium-goluboy-1-250100804/?at=6WtZvMWOJT5kXygnUK7zBm1TkkKwAXSv5gr4OU5R95V6",
      },
    ],
  },
  {
    id: "roller",
    figmaNode: "2351:10322",
    name: "Роллер для МФР",
    category: "Коррекция",
    importance: 30,
    image: "roller.webp",
    imageClass:
      "absolute h-[146.81%] left-[0.06%] max-w-none top-[-18.59%] w-[99.93%] object-cover max-xl:inset-0 max-xl:h-full max-xl:w-full max-xl:left-0 max-xl:top-0 max-xl:object-cover",
    description: "Важно взять мягкий роллер, без рёбер",
    replace: "Можно заменить свернутым полотенцем, но ролл всё же предпочтительнее",
    buttonLabel: "Ссылки",
    advice: {
      label: "Рекомендации:",
      text: "Нужен мягкий роллер, диаметр ~13-15 см, длина, от 30 см",
    },
    best: [
      {
        label: "Ролик массажный Trigger Point GRID 33 см",
        url: "https://www.ozon.ru/product/rolik-massazhnyy-trigger-point-grid-33-sm-oranzhevyy-150248869/",
      },
      {
        label: "Валик массажный для спины, йоги и МФР EVA 45x15 см",
        url: "https://www.ozon.ru/product/valik-massazhnyy-dlya-spiny-yogi-i-mfr-eva-rolik-45x15-sm-222553020/?from_sku=746039633&oos_search=false",
      },
    ],
    other: [
      {
        label: "Ролик массажный для фитнеса и йоги Bodyboss, МФР валик 60 см",
        url: "https://www.wildberries.ru/catalog/59627557/detail.aspx?targetUrl=MS",
      },
    ],
  },
  {
    id: "pilates-ball",
    figmaNode: "2351:10344",
    name: "Мяч для пилатеса, d - 25/50 см",
    category: "Коррекция",
    importance: 20,
    image: "pilates-ball.webp",
    imageClass:
      "absolute h-[174.77%] left-[0.03%] max-w-none top-[-40.57%] w-[114.53%] object-cover max-xl:inset-0 max-xl:h-full max-xl:w-full max-xl:left-0 max-xl:top-0 max-xl:object-cover",
    description:
      "Мяч для пилатеса диаметром около 25 см предназначен для упражнений на развитие координации и проработку мышечного корсета",
    replace: "Надувной детский мяч",
    buttonLabel: "Ссылки",
    advice: {
      label: "Рекомендации:",
      text: "Рекомендуется использовать пилатес-бол диаметром около 25 см, это оптимальный размер для комфортного и эффективного выполнения упражнений",
    },
    best: [
      {
        label: "Мяч для пилатеса 25 см",
        url: "https://structura.shop/pilatesballs",
      },
      {
        label: "Мяч для пилатеса и фитнеса гимнастический Starfit 25 см",
        url: "https://www.wildberries.ru/catalog/146261624/detail.aspx",
      },
    ],
    other: [
      {
        label: "Мяч для пилатеса и фитнеса 25 см",
        url: "https://www.wildberries.ru/catalog/47364818/detail.aspx?targetUrl=SG&size=1361710492",
      },
    ],
  },
  {
    id: "tape",
    figmaNode: "2351:10366",
    name: "Тейпы для тела груди ног",
    category: "Новое",
    importance: 20,
    image: "tape.webp",
    imageClass:
      "absolute h-[123.24%] left-[0.05%] max-w-none top-[-11.3%] w-[100.01%] object-cover max-xl:inset-0 max-xl:h-full max-xl:w-full max-xl:left-0 max-xl:top-0 max-xl:object-cover",
    description:
      "Тейп, это не волшебное средство, а вспомогательный инструмент. Максимальный эффект достигается в сочетании с упражнениями. Основная ширина, 5 см.",
    replace: null,
    buttonLabel: "Ссылки",
    advice: {
      label: "Рекомендации:",
      text: "Используем лёгкое лимфатическое и неврологическое тейпирование, избегаем сильного натяжения, тейпируем не более 1–2 зон за один раз",
    },
    best: [
      {
        label: "Кинезио тейп Rocktape Classic 5 см х 5 м хлопок",
        url: "https://www.ozon.ru/product/kinezio-teyp-rocktape-classic-5-sm-h-5-m-hlopok-muertape-podhodit-dlya-vseh-uchastkov-tela-215219972/?at=ywtAVAZN0hNZ0gk8I5QRBP6s0MDLGAtOqoLBMhG3rxAv",
      },
    ],
    other: [
      {
        label: "Кинезио тейп Muay Thai",
        url: "https://www.wildberries.ru/catalog/17855570/detail.aspx",
      },
    ],
  },
  {
    id: "yoga-blocks",
    figmaNode: "2351:10385",
    name: "Йога-блоки",
    category: "Новое",
    importance: 15,
    image: "yoga-blocks.webp",
    imageClass:
      "absolute h-[142.7%] left-[0.06%] max-w-none top-[-24.61%] w-[101.57%] object-cover max-xl:inset-0 max-xl:h-full max-xl:w-full max-xl:left-0 max-xl:top-0 max-xl:object-cover",
    description:
      "Йога-блоки, это удобный инвентарь для поддержки тела в упражнениях. Они помогают углубить растяжку, удерживать баланс и выполнять движения технически правильно, снижая нагрузку на суставы и спину. Д×Ш×В: 230×150×80 мм",
    replace: null,
    buttonLabel: "Ссылки",
    advice: {
      label: "Замена:",
      text: "Плотные, устойчивые книги одинаковой высоты. Они помогут поддержать тело в правильном положении и безопасно выполнить упражнение",
    },
    best: [
      {
        label: "Блоки для йоги (2 шт)",
        url: "https://structura.shop/blocks",
      },
    ],
    other: [
      {
        label: "Блок для йоги STARFIT, синий, 2 шт",
        url: "https://www.ozon.ru/product/blok-dlya-yogi-starfit-siniy-2-sht-1318992570/?at=RltyZyErRupBNxD7C4yGzJBsMQOV6AfBpn6pyFvog93K",
      },
    ],
  },
];
