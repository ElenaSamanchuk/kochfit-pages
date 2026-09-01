import { assetPath } from "@/lib/asset-path";
import type { ReactNode } from "react";

const img = (name: string) => assetPath(`/images/postpartum/${name}`);

type BannerCard = {
  image: string;
  /** Кроп фото: для «высоких» карточек — фон целиком, для «низких» — квадрат 190 */
  imageClass?: string;
  tall: boolean;
  /** Отступ белой плашки на высоких карточках */
  textTop?: number;
  text: ReactNode;
};

const cards: BannerCard[] = [
  {
    image: "imgBannerImage.webp",
    tall: true,
    textTop: 190,
    text: "Не было регулярного восстановления и хочется начать правильно",
  },
  {
    image: "imgBannerImage1.webp",
    imageClass: "absolute left-0 top-[-11.13%] h-[133.93%] w-full max-w-none",
    tall: false,
    text: "Ты недавно родила и не знаешь, с чего начать",
  },
  {
    image: "imgBannerImage2.webp",
    imageClass: "absolute left-0 top-[-11.86%] h-[111.83%] w-full max-w-none",
    tall: true,
    textTop: 206,
    text: "Ты хочешь восстановить тело, но боишься навредить",
  },
  {
    image: "imgBannerImage3.webp",
    tall: false,
    text: "Были роды с кесаревым сечением или эпизиотомией",
  },
  {
    image: "imgBannerImage4.webp",
    tall: true,
    textTop: 190,
    text: "Ребёнок требует постоянного внимания и не остаётся времени на себя",
  },
  {
    image: "imgBannerImage5.webp",
    imageClass: "absolute left-[-3.68%] top-[-29.41%] h-[138.85%] w-[103.67%] max-w-none",
    tall: false,
    text: (
      <>
        {"Хочешь заниматься спортом, "}
        <br aria-hidden />
        но не с кем оставить ребёнка
      </>
    ),
  },
  {
    image: "imgBannerImage6.webp",
    imageClass: "absolute left-0 top-[-4.83%] h-[104.82%] w-full max-w-none",
    tall: true,
    textTop: 190,
    text: (
      <>
        {"Прошло время, а такие проблемы как диастаз "}
        <br aria-hidden />
        {"или подтекания не прошли"}
      </>
    ),
  },
  {
    image: "imgBannerImage7.webp",
    imageClass: "absolute left-0 top-[-25.82%] h-[133.93%] w-full max-w-none",
    tall: false,
    text: (
      <>
        {"Боишься, что мало времени "}
        <br aria-hidden />
        на тренировки с малышом
      </>
    ),
  },
];

function BannerCardView({ card }: { card: BannerCard }) {
  if (card.tall) {
    return (
      <article className="relative h-[264px] w-[202px] shrink-0 overflow-hidden rounded-[12px] bg-white shadow-[2px_2px_8px_0px_rgba(224,224,224,0.25)]">
        <span className="absolute inset-0 block overflow-hidden">
          <img loading="lazy"
            alt=""
            className={card.imageClass ?? "absolute inset-0 size-full max-w-none object-cover"}
            src={img(card.image)}
          />
        </span>
        <span
          className="absolute left-[6px] flex items-center justify-center rounded-[8px] bg-white p-[10px]"
          style={{ top: card.textTop }}
        >
          <span className="w-[170px] text-[12px] font-normal leading-[normal] text-[#676971]">
            {card.text}
          </span>
        </span>
      </article>
    );
  }
  return (
    <article className="relative mt-0 h-[248px] w-[202px] shrink-0 overflow-hidden rounded-[12px] bg-white shadow-[2px_2px_8px_0px_rgba(224,224,224,0.25)] lg:mt-[40px]">
      <span className="absolute left-[6px] top-[6px] block size-[190px] overflow-hidden rounded-[8px]">
        <img loading="lazy"
          alt=""
          className={card.imageClass ?? "absolute inset-0 size-full max-w-none object-cover"}
          src={img(card.image)}
        />
      </span>
      <p className="absolute left-[10px] top-[206px] w-[182px] text-[12px] font-normal leading-[normal] text-[#676971]">
        {card.text}
      </p>
    </article>
  );
}

function BannerCards({ idPrefix }: { idPrefix: string }) {
  return cards.map((card, i) => <BannerCardView key={`${idPrefix}-${i}`} card={card} />);
}

/** «Программа вам подойдёт, если» — лента карточек, Figma 2042:9297 */
export function SuitableBanner() {
  return (
    <section data-figma-node="2042:9297" className="mx-auto w-full max-w-[1160px]">
      <h2 className="mx-auto w-full max-w-[482px] text-center font-display text-[22px] font-normal leading-[1.25] text-[#4b4d57] lg:text-[24px] lg:leading-[1.2]">
        {"Программа вам "}
        <br aria-hidden />
        подойдёт, если
      </h2>

      {/* Бесконечная авто-лента на всех ширинах. На мобилке overflow-x-auto
          (свайп), на десктопе overflow-x-hidden + drag. Пауза: hover / drag / touch.
          hscroll-bleed: 100vw + исключение из max-width:100%; без padding на
          скроллере — иначе при свайпе карточка режется по 20px-inset. */}
      <div
        data-drag-scroll
        data-marquee="30"
        className="mt-[24px] flex h-[264px] min-w-0 items-start gap-3 overflow-x-auto hscroll-bleed [scrollbar-width:none] lg:mt-[41px] lg:h-[288px] lg:gap-[20px] lg:overflow-x-hidden [&::-webkit-scrollbar]:hidden"
      >
        <BannerCards idPrefix="a" />
        <div aria-hidden data-marquee-copy className="flex shrink-0 items-start gap-3 lg:gap-[20px]">
          <BannerCards idPrefix="b" />
        </div>
        {/* Третья копия: на широких экранах period > maxScroll без неё — ping-pong вместо loop */}
        <div aria-hidden className="flex shrink-0 items-start gap-3 lg:gap-[20px]">
          <BannerCards idPrefix="c" />
        </div>
      </div>
    </section>
  );
}
