import { assetPath } from "@/lib/asset-path";
const img = (name: string) => assetPath(`/images/pregnancy/${name}`);

/** «Физическая активность во время беременности помогает» — Figma 2351:10807 */
export function PregnancyBenefits() {
  return (
    <section
      data-figma-node="2351:10807"
      className="mx-auto flex w-full max-w-[1160px] flex-col items-start gap-6 sm:gap-[40px]"
    >
      <h2 className="w-full font-display text-[22px] font-normal leading-[1.25] text-[#4b4d57] lg:text-[24px] lg:leading-[1.2]">
        {"Физическая активность "}
        во время беременности помогает
      </h2>

      <div className="grid w-full grid-cols-1 gap-[12px] sm:grid-cols-2 xl:grid-cols-3">
        {/* 1 — иконка спины */}
        <article className="fit-card">
          <p className="absolute left-[15px] xl:left-[27px] top-1/2 w-[206px] -translate-y-1/2 text-[14px] font-medium leading-[normal] text-[#676971]">
            {"Уменьшить боли в спине, шее "}
            и пояснице
          </p>
          <span className="absolute right-[15px] top-1/2 flex size-[36px] -translate-y-1/2 items-center justify-center rounded-[8px] bg-[#f8f8f8] lg:right-[27px]">
            <img loading="lazy" alt="" className="block size-[24px]" src={img("imgGroup.svg")} />
          </span>
        </article>

        {/* 2 — фото */}
        <article className="fit-card">
          <p className="absolute left-[15px] xl:left-[27px] top-1/2 w-[209px] -translate-y-1/2 text-[14px] font-medium leading-[normal] text-[#676971]">
            {"Подготовить мышцы тазового "}
            дна к родам
          </p>
          <span className="absolute right-[4px] top-1/2 block size-[60px] -translate-y-1/2 overflow-hidden rounded-[10px] lg:top-[5px] lg:size-[80px] lg:translate-y-0 lg:rounded-[15px]">
            <img loading="lazy"
              alt=""
              className="absolute left-[-11.49%] top-0 h-[99.95%] w-[122.66%] max-w-none"
              src={img("imgImage.webp")}
            />
          </span>
        </article>

        {/* 3 — иконка йоги */}
        <article className="fit-card">
          <p className="absolute left-[15px] xl:left-[27px] top-1/2 w-[262px] -translate-y-1/2 text-[14px] font-medium leading-[normal] text-[#676971]">
            {"Снизить уровень "}
            стресса
          </p>
          <span className="absolute right-[15px] top-1/2 flex size-[36px] -translate-y-1/2 items-center justify-center rounded-[8px] bg-[#f8f8f8] lg:right-[27px]">
            <img loading="lazy" alt="" className="block size-[24px]" src={img("imgGroup1.svg")} />
          </span>
        </article>

        {/* 4 — фото (сон) */}
        <article className="fit-card">
          <p className="absolute left-[15px] xl:left-[27px] top-1/2 w-[166px] -translate-y-1/2 text-[14px] font-medium leading-[normal] text-[#676971]">
            Улучшить самочувствие и сон
          </p>
          <img loading="lazy"
            alt=""
            className="absolute right-[5px] top-1/2 block size-[60px] -translate-y-1/2 rounded-[10px] object-cover lg:top-[5px] lg:size-[80px] lg:translate-y-0 lg:rounded-[15px]"
            src={img("imgImage1.webp")}
          />
        </article>

        {/* 5 — иконка сердца */}
        <article className="fit-card">
          <p className="absolute left-[15px] xl:left-[27px] top-1/2 w-[196px] -translate-y-1/2 text-[14px] font-medium leading-[normal] text-[#676971]">
            Укрепить сердечно-сосудистую систему
          </p>
          <span className="absolute right-[15px] top-1/2 flex size-[36px] -translate-y-1/2 items-center justify-center rounded-[8px] bg-[#f8f8f8] lg:right-[27px]">
            <span className="relative block size-[24px] overflow-hidden">
              <img loading="lazy"
                alt=""
                className="absolute inset-[12.5%_18.75%_12.72%_13.33%] block h-[74.78%] w-[67.92%] max-w-none"
                src={img("imgGroup2.svg")}
              />
            </span>
          </span>
        </article>

        {/* 6 — фото (мама с малышом) */}
        <article className="fit-card">
          <p className="absolute left-[15px] xl:left-[27px] top-1/2 w-[162px] -translate-y-1/2 text-[14px] font-medium leading-[normal] text-[#676971]">
            Легче восстановиться после родов
          </p>
          <img loading="lazy"
            alt=""
            className="absolute right-[5px] top-1/2 block size-[60px] -translate-y-1/2 rounded-[10px] object-cover lg:top-[5px] lg:size-[80px] lg:translate-y-0 lg:rounded-[15px]"
            src={img("imgImage2.png")}
          />
        </article>
      </div>
    </section>
  );
}
