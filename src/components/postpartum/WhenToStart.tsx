"use client";

import { assetPath } from "@/lib/asset-path";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Typo } from "@/components/ui/TypoText";
import { readCssMs } from "@/components/motion/tokens";

const img = (name: string) => assetPath(`/images/postpartum/${name}`);

type HintItem = {
  label: string;
  arrow: string;
  title: string;
  text: ReactNode;
};

const items: HintItem[] = [
  {
    label: "сразу после родов",
    arrow: "imgPolygon6.svg",
    title: "На 2-й день после родов",
    // Desktop body = 4 lines via \n + lg:whitespace-pre-line (screenshot wraps).
    // No em dash, no trailing end period. \u00A0 only where it won't fight breaks.
    // 4 lines @ 278px. Keep mid periods (практики. / дома. / момент.); no trailing end period.
    text: (
      <>
        {"На 1 неделе курса, дыхательные\nпрактики. "}
        <span className="font-semibold text-[#676971]">
          {"Можно начинать делать\nупражнения прямо в роддоме по 2–4"}
        </span>
        {"\nповтора, без нагрузки на тело"}
      </>
    ),
  },
  {
    label: "первое время после родов",
    arrow: "imgPolygon7.svg",
    title: "В первые месяцы",
    text: (
      <>
        {"Основная программа "}
        <span className="font-semibold text-[#676971]">
          {"стартует с первых\nдней дома"}
        </span>
        {". Тренировки 20–30 минут,\nформаты адаптированы под\nпослеродовое состояние тела"}
      </>
    ),
  },
  {
    label: "в любое время",
    arrow: "imgPolygon7.svg",
    title: "Через 3, 6, 12 месяцев и позже",
    text: (
      <>
        {
          "Если восстановления не было или\nостались проблемы, диастаз, слабость\nтазового дна, курс актуален в любой\nмомент. "
        }
        <span className="font-semibold text-[#676971]">
          {"Специального срока нет"}
        </span>
      </>
    ),
  },
];

type RevealPhase = "idle" | "line" | "markers" | "items";

function itemStyle(index: number): CSSProperties {
  return { "--when-start-index": index } as CSSProperties;
}

function markerClass(phase: RevealPhase) {
  return `when-start-marker z-[2]${phase === "markers" || phase === "items" ? " is-revealed" : ""}`;
}

function itemClass(phase: RevealPhase) {
  return `when-start-item${phase === "items" ? " is-revealed" : ""}`;
}

/** «Когда можно начать курс» — полноширинная лента с таймлайном, Figma 2042:9382 */
export function WhenToStart() {
  const sectionRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<RevealPhase>("idle");
  const animatedRef = useRef(false);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const runAnimation = () => {
      if (animatedRef.current) return;
      animatedRef.current = true;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        setPhase("items");
        return;
      }

      const mobile = window.matchMedia("(max-width: 1023px)").matches;
      const lineMs = mobile
        ? readCssMs("--reveal-dur", 480)
        : readCssMs("--reveal-dur-hero", 720);
      const markerMs = readCssMs("--dur", 280);
      const itemsAfterMs = readCssMs("--reveal-stagger-initial", 80);

      setPhase("line");
      if (mobile) {
        window.setTimeout(() => setPhase("items"), lineMs);
        return;
      }

      window.setTimeout(() => setPhase("markers"), lineMs);
      window.setTimeout(
        () => setPhase("items"),
        lineMs + markerMs + itemsAfterMs,
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          runAnimation();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 },
    );

    io.observe(root);
    return () => io.disconnect();
  }, []);

  const lineRevealed = phase !== "idle";

  return (
    <Typo>
    <section
      ref={sectionRef}
      data-figma-node="2042:9382"
      className="-mx-(--page-inset-x) overflow-hidden bg-[#edf4f9] lg:h-[397px]"
    >
      {/* ——— Mobile (<lg): вертикальный таймлайн ——— */}
      <div className="flex flex-col gap-6 px-(--page-inset-x) py-[40px] lg:hidden">
        <h2 className="font-display text-[22px] font-normal leading-[1.25] text-ink">
          Когда можно начать курс
        </h2>
        <div className="relative flex flex-col gap-[20px] pl-[22px]">
          <span
            aria-hidden
            className={`when-start-line-vertical absolute bottom-[8px] left-[7px] top-[8px] z-0 block w-[3px] rounded-[38px]${lineRevealed ? " is-revealed" : ""}`}
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgb(115, 162, 198) 2.69%, rgba(154, 190, 219, 0.2) 101.81%)",
            }}
          />
          {items.map((item, index) => (
            <div
              key={item.title}
              className={`relative ${itemClass(phase)}`}
              style={itemStyle(index)}
            >
              <span
                aria-hidden
                className="absolute left-[-22px] top-[2px] z-[2] block size-[15px]"
              >
                <img loading="lazy" alt="" className="block size-full max-w-none" src={img("imgEllipse6399.svg")} />
                <img loading="lazy"
                  alt=""
                  className="absolute left-[2px] top-[2px] block size-[11px] max-w-none"
                  src={img("imgEllipse6398.svg")}
                />
              </span>
              <div className="flex flex-col items-start gap-[16px]">
                <span className="plaque-label">
                  {item.label}
                </span>
                <article className="flex w-full flex-col items-start rounded-[16px] bg-white p-[12px] drop-shadow-[2px_2px_4px_rgba(224,224,224,0.25)]">
                  <div className="flex w-full flex-col items-start gap-[8px]">
                    <p className="w-full text-[14px] font-semibold leading-[normal] text-[#4b4d57]">
                      {item.title}
                    </p>
                    <p className="w-full text-[12px] font-normal leading-[1.45] text-[#999ca8]">
                      {item.text}
                    </p>
                  </div>
                </article>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ——— Desktop (lg+): 3-column grid, линия от 1-го до 3-го маркера ——— */}
      <div className="relative mx-auto hidden h-full w-full max-w-[1160px] lg:grid lg:grid-cols-3">
        <h2 className="absolute left-0 top-[60px] z-[1] col-span-3 w-full font-display text-[25px] font-normal leading-[1.2] text-ink">
          Когда можно начать курс
        </h2>

        <span
          aria-hidden
          className={`when-start-line absolute top-[168px] z-0 block h-[3px] rounded-[38px]${lineRevealed ? " is-revealed" : ""}`}
          style={{
            left: "calc(100% / 6)",
            width: "calc(100% * 2 / 3)",
            backgroundImage:
              "linear-gradient(90deg, rgb(115, 162, 198) 2.69%, rgba(154, 190, 219, 0.2) 101.81%)",
          }}
        />

        {items.map((item, index) => (
          <div key={item.title} className="relative">
            <span
              className={`${itemClass(phase)} plaque-label absolute left-1/2 top-[130px] z-[1] -translate-x-1/2`}
              style={itemStyle(index)}
            >
              {item.label}
            </span>
            <span
              className={`${itemClass(phase)} absolute left-1/2 top-[149px] z-[1] flex h-[9px] w-[15px] -translate-x-1/2 rotate-180 items-center justify-center`}
              style={itemStyle(index)}
            >
              <span className="absolute inset-x-[6.7%] bottom-1/4 top-0 block">
                <img loading="lazy" alt="" className="block size-full max-w-none" src={img(item.arrow)} />
              </span>
            </span>
            <span
              className={`${markerClass(phase)} absolute left-1/2 top-[162px] z-[2] block size-[15px] -translate-x-1/2`}
            >
              <img loading="lazy" alt="" className="block size-full max-w-none" src={img("imgEllipse6399.svg")} />
            </span>
            <span
              className={`${markerClass(phase)} absolute left-1/2 top-[164px] z-[2] block size-[11px] -translate-x-1/2`}
            >
              <img loading="lazy" alt="" className="block size-full max-w-none" src={img("imgEllipse6398.svg")} />
            </span>
            <span
              className={`${itemClass(phase)} absolute left-1/2 top-[177px] z-[1] block h-[29px] w-px -translate-x-1/2 bg-surface-blue-3`}
              style={itemStyle(index)}
            />
            <span
              className={`${itemClass(phase)} absolute left-1/2 top-[202px] z-[1] block size-[7px] -translate-x-1/2`}
              style={itemStyle(index)}
            >
              <img loading="lazy" alt="" className="block size-full max-w-none" src={img("imgEllipse6400.svg")} />
            </span>
            <article
              className={`${itemClass(phase)} absolute left-1/2 top-[206px] z-[1] flex w-[min(278px,calc(100%-16px))] -translate-x-1/2 flex-col items-start rounded-[16px] bg-white p-[20px] drop-shadow-[2px_2px_4px_rgba(224,224,224,0.25)]`}
              style={itemStyle(index)}
            >
              <div className="flex w-full flex-col items-start gap-[8px]">
                <p className="w-full text-[14px] font-semibold leading-[normal] text-[#4b4d57]">
                  {item.title}
                </p>
                <p className="w-full text-[12px] font-normal leading-[normal] text-[#999ca8] lg:whitespace-pre-line">
                  {item.text}
                </p>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
    </Typo>
  );
}
