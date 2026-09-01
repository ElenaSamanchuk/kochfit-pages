/**
 * iPhone 16 Pro mockup stack — shadow + frame + screen.
 * Эталон: Figma 2262:2664 (PlatformSection).
 * Экран 267×478: imgMask.png (home) или imgChangeThis1 + SVG-маска (курсы).
 */

type PhoneFadeVariant = "platform" | "course";

/** Проценты от контейнера 352×522 (Figma), чтобы дымка масштабировалась вместе с мокапом */
const fadeByVariant: Record<PhoneFadeVariant, string> = {
  /** Figma 2262:2674 — 398×131, bottom −61; поднято выше, чтобы дымка прикрывала низ экрана */
  platform: "bottom-[-6.5%] h-[30%] w-[113.07%]",
  /** Figma 2031:2604 — 398×156, bottom −52 */
  course: "bottom-[-9.96%] h-[29.89%] w-[113.07%]",
};

/** Белая дымка под chin телефона — Figma 2262:2674 / 2031:2604 */
export function PhoneBottomFade({
  figmaNode,
  variant = "platform",
  className,
}: {
  figmaNode?: string;
  variant?: PhoneFadeVariant;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      data-figma-node={figmaNode}
      className={`pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 bg-white blur-[13.15px] ${fadeByVariant[variant]}${className ? ` ${className}` : ""}`}
    />
  );
}

/** Телефон + дымка: дымка поверх телефона (z-20), растворяет его низ — как в Figma (2262:2674 после 2262:2664) */
export function PhoneStack({
  img,
  phoneFigmaNode,
  fadeFigmaNode,
  useScreenMask = false,
  screenImage,
  responsive = false,
  className,
  fadeClassName,
  fadeVariant = "platform",
  screenFigmaNode,
}: {
  img: (name: string) => string;
  phoneFigmaNode?: string;
  fadeFigmaNode?: string;
  useScreenMask?: boolean;
  screenImage?: string;
  responsive?: boolean;
  className?: string;
  fadeClassName?: string;
  fadeVariant?: PhoneFadeVariant;
  /** Figma node экрана: 2262:2668 (home imgMask) или 2031:2602 (course Change-This) */
  screenFigmaNode?: string;
}) {
  return (
    <div className={`relative${className ? ` ${className}` : ""}`}>
      <PhoneMockup
        img={img}
        figmaNode={phoneFigmaNode}
        useScreenMask={useScreenMask}
        screenImage={screenImage}
        screenFigmaNode={screenFigmaNode}
        responsive={responsive}
        className="relative z-10 size-full"
      />
      {fadeFigmaNode ? (
        <PhoneBottomFade figmaNode={fadeFigmaNode} variant={fadeVariant} className={fadeClassName} />
      ) : null}
    </div>
  );
}

export function PhoneMockup({
  img,
  className,
  screenImage = "imgMask.png",
  useScreenMask = false,
  figmaNode,
  screenFigmaNode,
  responsive = false,
}: {
  /** assetPath helper, scoped to папке ассетов страницы */
  img: (name: string) => string;
  className?: string;
  screenImage?: string;
  /** Курсовые ассеты: экран через imgChangeThis1 + svg-маска */
  useScreenMask?: boolean;
  figmaNode?: string;
  screenFigmaNode?: string;
  /** Процентные позиции внутри aspect-[352/522] (PlatformSection mobile) */
  responsive?: boolean;
}) {
  /* Проценты от контейнера 352×522 = точные координаты Figma (frame 46/13, screen 57/22),
     одинаковые на всех брейкпоинтах — телефон не центрируется, он смещён вправо как в макете. */
  const frameClass =
    "absolute left-[13.07%] top-[2.49%] h-[97.51%] w-[82.1%] overflow-hidden";

  /* Радиус экрана задан в процентах (12.7% ширины / 7.1% высоты ≈ 34px при 267×478),
     чтобы скругление масштабировалось вместе с мокапом и углы не просвечивали белым */
  const screenClass =
    "absolute left-[16.19%] top-[4.21%] h-[91.57%] w-[75.85%] overflow-hidden bg-white";

  /* Скругление только верхних углов, в процентах — масштабируется вместе с мокапом */
  const screenRadius = {
    borderTopLeftRadius: "12.7% 7.1%",
    borderTopRightRadius: "12.7% 7.1%",
  } as const;

  return (
    <div
      aria-hidden
      className={`relative size-full${className ? ` ${className}` : ""}`}
      data-figma-node={figmaNode}
    >
      <span className="absolute inset-0 block mix-blend-multiply opacity-[0.62]">
        <span className="absolute inset-0 block overflow-hidden pointer-events-none">
          <img
            loading="lazy"
            alt=""
            className="absolute left-0 top-0 block h-[132.08%] w-full max-w-none"
            src={img("imgShadow.webp")}
          />
        </span>
      </span>
      <span className={frameClass}>
        <img
          loading="lazy"
          alt=""
          className="absolute left-[0.07%] top-[-0.04%] h-[123.35%] w-[99.96%] max-w-none"
          src={img("imgIPhone16Pro.webp")}
        />
      </span>
      {useScreenMask ? (
        <span
          data-figma-node={screenFigmaNode ?? "2031:2602"}
          className={screenClass}
          style={
            responsive
              ? {
                  ...screenRadius,
                  maskImage: `url("${img("imgChangeThis.svg")}")`,
                  maskRepeat: "no-repeat",
                  maskSize: "100% 100%",
                  maskPosition: "0 0",
                }
              : {
                  ...screenRadius,
                  maskImage: `url("${img("imgChangeThis.svg")}")`,
                  maskRepeat: "no-repeat",
                  maskSize: "267.254px 609.126px",
                  maskPosition: "0.051px 0.186px",
                }
          }
        >
          <img
            loading="lazy"
            alt=""
            className={
              responsive
                ? "absolute inset-0 block size-full object-cover object-top"
                : "absolute left-0 top-0 block h-[609.339px] w-[267px] max-w-none"
            }
            src={img("imgChangeThis1.webp")}
          />
        </span>
      ) : (
        <img
          loading="lazy"
          alt=""
          data-figma-node={screenFigmaNode ?? "2262:2668"}
          className={`${screenClass} object-cover object-top`}
          style={screenRadius}
          src={img(screenImage)}
        />
      )}
      {/* Dynamic Island: home — h 3.74%/19.5px, w чуть уже Figma (22%); курсы — ~23px (4.4%) */}
      <span
        aria-hidden
        className={
          useScreenMask
            ? "pointer-events-none absolute left-[42.33%] top-[5.74%] z-[1] block h-[4.4%] w-[23.44%] rounded-full bg-[#0b0b0d]"
            : "pointer-events-none absolute left-[43.05%] top-[5.74%] block h-[3.74%] w-[22%] rounded-full bg-[#0b0b0d]"
        }
      />
    </div>
  );
}
