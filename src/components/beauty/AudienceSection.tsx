import { assetPath } from "@/lib/asset-path";
const img = (name: string) => assetPath(`/images/beauty-health/${name}`);

type Card =
  | { text: React.ReactNode; textWidth: number; icon: string }
  | {
      text: React.ReactNode;
      textWidth: number;
      image: string;
      /** Desktop lg+ right inset (Figma 4–5px). Mobile uses symmetric 8px. */
      imageRightDesktop?: number;
      objectPosition?: string;
    };

const cards: Card[] = [
  {
    text: "Если устала от хаотичных тренировок без регулярности",
    textWidth: 206,
    icon: "imgHugeiconsBodyPartMuscle.svg",
  },
  {
    text: "Если хочешь улучшить осанку и укрепить мышцы",
    textWidth: 209,
    image: "imgImage3.webp?v=240l",
  },
  {
    text: (
      <>
        {"Если планируешь беременность "}
        <br aria-hidden />и хочешь укрепить женское здоровье
      </>
    ),
    textWidth: 262,
    icon: "imgMdiBabyCarriage.svg",
  },
  {
    text: "Если важно не только «выглядеть», но и чувствовать тело",
    textWidth: 247,
    image: "imgImage4.webp?v=240l",
    imageRightDesktop: 5,
  },
  {
    text: "Если хочешь, чтобы тренировки снижали тревогу, а не добавляли стресс",
    textWidth: 294,
    icon: "imgGroup.svg",
  },
  {
    text: (
      <>
        {"Если хочешь заниматься без"}
        <br className="hidden xl:block" aria-hidden />
        <span className="xl:hidden"> </span>
        {"перегруза и жестких ограничений"}
      </>
    ),
    textWidth: 244,
    image: "imgImage6.webp?v=1",
    imageRightDesktop: 5,
  },
];

const photoClass =
  "absolute inset-0 size-full max-w-none rounded-[10px] object-cover object-center lg:rounded-[15px]";

const photoDesktopRight = (right?: number) =>
  right === 5 ? "lg:right-[5px]" : "lg:right-[4px]";

/** «Кому подойдет курс» — Figma 2031:2314 */
export function AudienceSection() {
  return (
    <section
      data-figma-node="2031:2314"
      className="mx-auto flex w-full max-w-[1160px] flex-col items-start gap-6 sm:gap-[40px]"
    >
      <h2 className="w-full font-display text-[24px] font-normal leading-[1.2] text-[#4b4d57]">
        Кому подойдет курс
      </h2>
      <div className="flex w-full flex-wrap gap-[12px]">
        {cards.map((card, i) => (
          <article
            key={i}
            className="fit-card basis-full sm:basis-[calc(50%-6px)] xl:basis-[calc(33.333%-8px)]"
          >
            <p
              className="absolute left-[15px] top-1/2 -translate-y-1/2 text-[12px] font-medium leading-[normal] text-[#676971] xl:left-[27px] xl:text-[14px]"
              style={{
                maxWidth: `min(${card.textWidth}px, calc(100% - ${"icon" in card ? 90 : 88}px))`,
              }}
            >
              {card.text}
            </p>
            {"icon" in card ? (
              <span className="absolute right-[18px] top-[18px] flex size-[36px] items-center justify-center rounded-[8px] bg-[#f8f8f8] xl:right-[27px] xl:top-[27px]">
                <img
                  loading="lazy"
                  alt=""
                  className="size-[24px] shrink-0 object-contain"
                  src={img(card.icon)}
                />
              </span>
            ) : (
              <span
                className={`absolute right-[8px] top-[8px] block size-[56px] shrink-0 overflow-hidden rounded-[10px] lg:top-[5px] lg:size-[80px] lg:rounded-[15px] ${photoDesktopRight("imageRightDesktop" in card ? card.imageRightDesktop : undefined)}`}
              >
                <img
                  loading="lazy"
                  alt=""
                  className={photoClass}
                  style={card.objectPosition ? { objectPosition: card.objectPosition } : undefined}
                  src={img(card.image)}
                />
              </span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
