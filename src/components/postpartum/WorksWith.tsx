import { assetPath } from "@/lib/asset-path";

const img = (name: string) => assetPath(`/images/postpartum/${name}`);
/** Native webp: 1440@dpr2 не должен взять 80px PNG/экспорт Figma. */
const PHOTO_BUST = "v=workswith-native";
const photoWebp = (stem: string, width: number) =>
  `${assetPath(`/images/postpartum/${stem}-${width}.webp`)}?${PHOTO_BUST}`;
const photoSrcSet = (stem: string, width: number) =>
  `${photoWebp(stem, width)} ${width}w`;

type Card =
  | { text: string; textWidth: number; icon: string }
  | {
      text: string;
      textWidth: number;
      imageStem: string;
      /** Native pixel width of the Figma raw fill (srcset + sizes). */
      imageWidth: number;
      imageRight: number;
      /** Figma image-fill crop (absolute left/top/size). Omit for object-cover. */
      imageClass?: string;
    };

const cards: Card[] = [
  {
    text: "Диастаз, расхождение прямой мышцы живота",
    textWidth: 206,
    icon: "imgGroup.svg",
  },
  {
    text: "Слабость мышц тазового дна, подтекания, дискомфорт",
    textWidth: 209,
    imageStem: "imgImage",
    imageWidth: 956,
    imageRight: 4,
  },
  {
    text: "Низкое либидо и боли при половом акте",
    textWidth: 160,
    icon: "imgGroup1.svg",
  },
  {
    text: "Рубцы: снимаем напряжение, восстанавливаем чувствительность",
    textWidth: 254,
    imageStem: "imgImage1",
    imageWidth: 1200,
    imageRight: 5,
  },
  {
    text: "Опущение внутренних органов",
    textWidth: 196,
    icon: "imgStreamlineUltimatePregnancyVagina.svg",
  },
  {
    text: "Боли в пояснице, спине, шее",
    textWidth: 127,
    imageStem: "imgImage2",
    imageWidth: 1680,
    imageRight: 5,
    // Figma 2042:9248 — fill crop, not object-cover of the square source
    imageClass:
      "absolute left-[-12.13%] top-[-6.28%] size-[123.45%] max-w-none",
  },
];

const photoClass =
  "absolute inset-0 size-full max-w-none object-cover object-center rounded-[10px] lg:rounded-[15px]";

/** «С чем работает курс» — Figma 2042:9209 */
export function WorksWith() {
  return (
    <section
      data-figma-node="2042:9209"
      className="mx-auto flex w-full max-w-[1160px] flex-col items-start gap-[30px]"
    >
      <div className="flex w-full max-w-[869px] flex-col items-start gap-[12px]">
        <h2 className="w-full font-display text-[22px] font-normal leading-[1.25] text-[#4b4d57] lg:text-[24px] lg:leading-[1.2]">
          С чем работает курс
        </h2>
        <p className="w-full text-[14px] font-medium leading-[1.4] text-[#676971] lg:text-[18px] lg:leading-[normal]">
          {"После родов: "}
          <span className="text-[#999ca8]">
            естественных и кесарева, мышцы, дыхание и осанка работают иначе.
          </span>{" "}
          <span className="font-semibold text-[#6d8da6]">Это нормально.</span>{" "}
          Но без правильного восстановления эти изменения остаются надолго
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-[12px] md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <article
            key={i}
            className="fit-card"
          >
            <p
              className="absolute left-[15px] top-1/2 -translate-y-1/2 text-[14px] font-medium leading-[normal] text-[#676971] lg:left-[27px]"
              style={{
                maxWidth: `min(${card.textWidth}px, calc(100% - ${"icon" in card ? 68 : 88}px))`,
              }}
            >
              {card.text}
            </p>
            {"icon" in card ? (
              <span className="absolute right-[15px] top-1/2 flex size-[36px] -translate-y-1/2 items-center justify-center rounded-[8px] bg-[#f8f8f8] lg:right-[27px]">
                <img
                  loading="lazy"
                  alt=""
                  className="size-[24px] shrink-0 object-contain"
                  src={img(card.icon)}
                />
              </span>
            ) : (
              <span
                className="absolute top-1/2 block size-[60px] shrink-0 -translate-y-1/2 overflow-hidden rounded-[10px] lg:top-[5px] lg:size-[80px] lg:translate-y-0 lg:rounded-[15px]"
                style={{ right: card.imageRight }}
              >
                <img
                  loading="lazy"
                  alt=""
                  className={card.imageClass ?? photoClass}
                  src={photoWebp(card.imageStem, card.imageWidth)}
                  srcSet={photoSrcSet(card.imageStem, card.imageWidth)}
                  sizes={`${card.imageWidth}px`}
                />
              </span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
