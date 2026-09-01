import { assetPath } from "@/lib/asset-path";
import type { ReactNode } from "react";
import { externalLinks } from "@/content/links";
import { AppLink } from "@/components/ui/AppLink";

const img = (name: string) => assetPath(`/images/pregnancy/${name}`);

const b = (text: ReactNode) => (
  <span className="font-semibold text-[#4b4d57]">{text}</span>
);

type ReviewCard = {
  node: string;
  /** Фото слева */
  photo: ReactNode;
  /** Отступ сверху для «пузыря» с текстом отзыва */
  bubbleTop: number;
  bubbleShape: string;
  bubbleHeight: number;
  avatar: ReactNode;
  emoji: string;
  text: ReactNode;
  /** Скриншот справа: блюрный фон + белая рамка с картинкой */
  blur: ReactNode;
  shotBox: { width: number; height: number };
  shot: ReactNode;
};

const cards: ReviewCard[] = [
  {
    node: "2351:11195",
    photo: (
      <img loading="lazy"
        alt=""
        className="absolute inset-0 size-full max-w-none object-cover object-center"
        src={img("imgImage2421.png")}
      />
    ),
    bubbleTop: 213,
    bubbleShape: "imgCombinedShape1.svg",
    bubbleHeight: 84,
    avatar: (
      <img loading="lazy"
        alt=""
        className="absolute inset-0 size-full max-w-none object-cover object-[center_20%]"
        src={img("imgRectangle29012.jpg")}
      />
    ),
    emoji: "🍼 🌸",
    text: (
      <>
        {"Но это вауууу, "}
        {b(
          <>
            {"так быстро "}
            <br aria-hidden />я не рассчитывала
          </>,
        )}
        , просто делала каждый день без ожидания быстрого результата
      </>
    ),
    blur: (
      <span className="absolute left-1/2 top-0 block h-[310px] w-[304px] -translate-x-1/2 blur-[2px]">
        <img loading="lazy" alt="" className="block size-full max-w-none object-cover" src={img("imgImage2421.png")} />
      </span>
    ),
    shotBox: { width: 202, height: 266 },
    shot: (
      <span className="absolute left-1/2 top-1/2 block h-[239px] w-[192px] -translate-x-1/2 -translate-y-1/2 overflow-hidden">
        <img loading="lazy"
          alt=""
          className="absolute inset-0 size-full max-w-none object-cover object-center"
          src={img("imgTelegramCloudDocument251953956619142188441.png")}
        />
      </span>
    ),
  },
  {
    node: "2351:11246",
    photo: (
      <>
        <span className="absolute inset-[-1.3%] block">
          <img loading="lazy"
            alt=""
            className="block size-full max-w-none object-cover object-center"
            src={img("imgTelegramCloudDocument251953956619142188472.png")}
          />
        </span>
        <img loading="lazy"
          alt=""
          className="absolute left-0 top-0 h-[234px] w-[302px] max-w-none object-cover object-center"
          src={img("imgTelegramCloudDocument251953956619142188473.png")}
        />
      </>
    ),
    bubbleTop: 197,
    bubbleShape: "imgCombinedShape3.svg",
    bubbleHeight: 100,
    avatar: (
      <img loading="lazy"
        alt=""
        className="absolute inset-0 size-full max-w-none rounded-[20px] object-cover"
        src={img("imgAvatar4.png")}
      />
    ),
    emoji: "🏋🏼‍♀️ 💪",
    text: (
      <>
        {"Меня спрашивают: "}
        {b("ты когда в зал?")}
        {" Мне так комфортно дома заниматься, я делаю хорошо себе, "}
        {b("результат просто офигенный. ")}
        {"Так, собственно, "}
        {b("зачем мне в зал?")}
        {" 😂"}
      </>
    ),
    blur: (
      <span className="absolute left-1/2 top-0 block h-[310px] w-[302px] -translate-x-1/2 blur-[2px]">
        <img loading="lazy"
          alt=""
          className="block size-full max-w-none object-cover"
          src={img("imgTelegramCloudDocument251953956619142188472.png")}
        />
      </span>
    ),
    shotBox: { width: 202, height: 182 },
    shot: (
      <span className="absolute left-1/2 top-1/2 block h-[151px] w-[202px] -translate-x-1/2 -translate-y-1/2 overflow-hidden">
        <img loading="lazy"
          alt=""
          className="absolute inset-0 size-full max-w-none object-cover object-left"
          src={img("imgImg65731.jpg")}
        />
      </span>
    ),
  },
  {
    node: "2351:11229",
    photo: (
      <img loading="lazy"
        alt=""
        className="absolute inset-0 size-full max-w-none object-cover object-center"
        src={img("imgTelegramCloudDocument251953956619142188471.jpg")}
      />
    ),
    bubbleTop: 197,
    bubbleShape: "imgCombinedShape3.svg",
    bubbleHeight: 100,
    avatar: (
      <img loading="lazy"
        alt=""
        className="absolute inset-0 size-full max-w-none rounded-[20px] object-cover"
        src={img("imgAvatar3.png")}
      />
    ),
    emoji: "🏋🏼‍♀️ 💪",
    text: (
      <>
        {"Прошёл всего месяц работы над собой, "}
        {b("самочувствие просто огонь. 🔥 Сейчас сил полно,")}
        {" могу тренироваться даже вечером. "}
        <br aria-hidden />
        {"Ну и "}
        {b("бонусом получилось минус 1,6 кг. ")}
      </>
    ),
    blur: (
      <span className="absolute left-1/2 top-0 block h-[310px] w-[302px] -translate-x-1/2 overflow-hidden blur-[2px]">
        <img loading="lazy"
          alt=""
          className="absolute inset-0 size-full max-w-none object-cover object-center"
          src={img("imgTelegramCloudDocument251953956619142188471.jpg")}
        />
      </span>
    ),
    shotBox: { width: 202, height: 215 },
    shot: (
      <span className="absolute left-1/2 top-[10px] block h-[211px] w-[195px] -translate-x-1/2 overflow-hidden">
        <img loading="lazy"
          alt=""
          className="absolute inset-0 size-full max-w-none object-cover object-center"
          src={img("imgTelegramCloudDocument251953956619142200000.jpg")}
        />
      </span>
    ),
  },
];

const topAvatars = [
  "imgRectangle29016.png",
  "imgRectangle29019.png",
  "imgRectangle29018.png",
];

/** Фото с пузырём отзыва — фиксированный блок 302×310 */
function ReviewPhoto({ card }: { card: ReviewCard }) {
  return (
    <div className="relative h-[310px] w-[302px] overflow-hidden rounded-[8px] bg-white">
      {card.photo}
      {/* Пузырь отзыва */}
      <span
        className="absolute left-[13px] flex w-[276px] flex-col items-end"
        style={{ top: card.bubbleTop }}
      >
        <img loading="lazy"
          alt=""
          className="mb-[-3px] block w-[276px] -scale-x-100"
          style={{ height: card.bubbleHeight }}
          src={img(card.bubbleShape)}
        />
        <img loading="lazy"
          alt=""
          className="block h-[6px] w-[9px] -scale-x-100"
          src={img("imgTail1.svg")}
        />
      </span>
      <span
        className="absolute left-[9px] block size-[26px] overflow-hidden rounded-[20px] border-2 border-solid border-white shadow-[-0.454px_1.817px_1.817px_0px_rgba(0,0,0,0.1)]"
        style={{ top: card.bubbleTop - 4 }}
      >
        {card.avatar}
      </span>
      <p
        className="absolute left-[41px] whitespace-nowrap text-[12px] font-semibold leading-[normal] text-[#676971]"
        style={{ top: card.bubbleTop + 8 }}
      >
        {"Отзыв на "}
        <span className="text-ink">«Восстановление после родов»</span>
      </p>
      <p
        className="absolute inset-x-[21px] text-[12px] font-normal leading-[normal] text-[#676971]"
        style={{ top: card.bubbleTop + 28 }}
      >
        {card.text}
      </p>
      <span
        className="absolute left-[237px] flex items-center justify-center gap-[4px] whitespace-nowrap rounded-[21px] border-[0.4px] border-solid border-[#efefef] bg-white px-[8px] py-[4px] text-center text-[12px] font-normal leading-none text-[#676971] drop-shadow-[2px_2px_4px_rgba(128,128,128,0.1)]"
        style={{ top: card.bubbleTop - 16 }}
      >
        {card.emoji}
      </span>
    </div>
  );
}

/** Скриншот с блюрным фоном */
function ReviewShot({ card, className }: { card: ReviewCard; className: string }) {
  return (
    <div className={`overflow-hidden rounded-[8px] ${className}`}>
      {card.blur}
      <span
        className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[8px] bg-white"
        style={{ width: card.shotBox.width, height: card.shotBox.height }}
      >
        {card.shot}
      </span>
    </div>
  );
}

const avatarsRow = (
  <div className="flex items-start" data-figma-node="2351:11187">
    {topAvatars.map((image, index) => (
      <span
        key={image}
        className={`relative block aspect-square size-10 shrink-0 overflow-hidden rounded-full border-2 border-solid border-surface-blue shadow-[2px_2px_8px_0px_rgba(224,224,224,0.25)] ${
          index < topAvatars.length - 1 ? "mr-[-5px]" : ""
        }`}
      >
        <img
          loading="lazy"
          alt=""
          className="absolute inset-0 size-full max-w-none object-cover object-center"
          src={img(image)}
        />
      </span>
    ))}
  </div>
);

const reviewsCtaClass =
  "flex min-h-[48px] items-center justify-center rounded-[12px] px-[32px] py-[14px] lg:min-h-0 lg:py-[16px]";
const reviewsCtaGradient = {
  backgroundImage:
    "var(--gradient-primary)",
} as const;

function ReviewsCta({ className }: { className?: string }) {
  return (
    <AppLink
      href={externalLinks.results}
      className={`${reviewsCtaClass} ${className ?? ""}`}
      style={reviewsCtaGradient}
    >
      <span className="whitespace-nowrap text-center font-display text-[14px] font-bold leading-[1.2] text-white">
        Смотреть все отзывы
      </span>
    </AppLink>
  );
}

/** «Что говорят участницы Kochfit» — Figma 2351:11143 */
export function PregnancyReviews() {
  return (
    <section
      data-figma-node="2351:11143"
      className="-mx-(--page-inset-x) overflow-x-visible overflow-y-visible"
      style={{
        backgroundImage:
          "var(--gradient-soft)",
      }}
    >
      <div className="mx-auto w-full max-w-[1160px] px-(--page-inset-x) py-10 lg:px-0 lg:pb-[43px] lg:pt-[60px]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-4">
          <div className="flex flex-col gap-3">
            {avatarsRow}
            <h2 className="font-display text-[22px] font-normal leading-[1.25] text-[#4b4d57] lg:w-[253px] lg:text-[24px] lg:leading-[1.2]">
              Что говорят участницы Kochfit
            </h2>
          </div>
          <ReviewsCta className="hidden w-auto shrink-0 lg:flex" />
        </div>

        {/* Лента: ширина ограничена колонкой/вьюпортом, карточки shrink-0 —
            иначе overflow-hidden + absolute stretch делали scrollWidth === clientWidth. */}
        <div
          data-drag-scroll
          data-figma-node="2351:11143-scroll"
          className="mt-5 flex min-w-0 snap-x snap-mandatory items-start gap-3 overflow-x-auto overflow-y-visible scroll-smooth pb-1 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [touch-action:pan-x_pan-y] max-xl:hscroll-bleed lg:mt-[40px] lg:gap-4 xl:hscroll-end xl:w-[calc(50%+50vw)] xl:max-w-none xl:snap-none [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((card) => (
            <article
              key={card.node}
              data-figma-node={card.node}
              className="relative flex w-[572px] shrink-0 snap-start gap-2 overflow-hidden rounded-[16px] bg-white p-2 shadow-[2px_2px_8px_0px_rgba(224,224,224,0.25)] lg:block lg:h-[326px] lg:gap-0 lg:p-0"
            >
              <div className="shrink-0 lg:absolute lg:left-2 lg:top-2">
                <ReviewPhoto card={card} />
              </div>
              <ReviewShot
                card={card}
                className="relative h-[310px] w-[246px] shrink-0 lg:absolute lg:left-[318px] lg:top-2"
              />
            </article>
          ))}
        </div>

        <ReviewsCta className="mt-5 w-full lg:hidden" />
      </div>
    </section>
  );
}
