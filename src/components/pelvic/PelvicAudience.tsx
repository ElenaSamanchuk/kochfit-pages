import { assetPath } from "@/lib/asset-path";
const img = (name: string) => assetPath(`/images/pelvic-floor/${name}`);

/** «Курс подойдёт, если» — Figma 2031:2664 */
export function PelvicAudience() {
  return (
    <section
      data-figma-node="2031:2664"
      className="mx-auto flex w-full max-w-[1160px] flex-col items-start gap-[30px]"
    >
      <div className="flex w-full max-w-[589px] flex-col items-start gap-[12px]">
        <h2 className="w-full font-display text-[24px] font-normal leading-[1.2] text-[#4b4d57]">
          Курс подойдёт, если
        </h2>
        <p className="w-full text-[14px] font-medium leading-[1.4] text-[#999ca8] lg:text-[18px] lg:leading-[normal]">
          {"Вы никогда не занимались мышцами тазового дна и "}
          <span className="text-[#676971]">
            хотите понять, с чего начать и как дыхание влияет на тело
          </span>
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-[12px] sm:grid-cols-2 xl:grid-cols-3">
        {/* 1 — иконка таза */}
        <article className="fit-card">
          <p className="absolute left-[15px] top-1/2 w-[261px] max-w-[calc(100%-88px)] -translate-y-1/2 text-[12px] xl:text-[14px] font-medium leading-[normal] text-[#676971] xl:left-[27px] xl:max-w-[calc(100%-118px)]">
            Есть ощущение слабости в области таза или постоянного напряжения
          </p>
          <span className="absolute right-[15px] top-1/2 flex size-[36px] -translate-y-1/2 items-center justify-center rounded-[8px] bg-[#f8f8f8] xl:right-[26px] xl:top-[27px] xl:translate-y-0">
            <img loading="lazy" alt="" className="block size-[24px]" src={img("imgGameIconsPelvisBone.svg")} />
          </span>
        </article>

        {/* 2 — фото */}
        <article className="fit-card">
          <p className="absolute left-[15px] top-1/2 w-[266px] max-w-[calc(100%-88px)] -translate-y-1/2 text-[12px] xl:text-[14px] font-medium leading-[normal] text-[#676971] xl:left-[27px] xl:max-w-[calc(100%-118px)]">
            Бывают подтекания при кашле, чихании, смехе или прыжках
          </p>
          <img loading="lazy"
            alt=""
            className="absolute right-[5px] top-1/2 block size-[60px] -translate-y-1/2 rounded-[10px] object-cover lg:top-[5px] lg:size-[80px] lg:translate-y-0 lg:rounded-[15px]"
            src={img("imgImage.png")}
          />
        </article>

        {/* 3 — иконка репродуктивного здоровья */}
        <article className="fit-card">
          <p className="absolute left-[15px] xl:left-[27px] top-1/2 w-[254px] max-w-[calc(100%-118px)] -translate-y-1/2 text-[12px] xl:text-[14px] font-medium leading-[normal] text-[#676971]">
            Снизились ощущения при близости или появился дискомфорт
          </p>
          <span className="absolute right-[15px] top-1/2 flex size-[36px] -translate-y-1/2 items-center justify-center rounded-[8px] bg-[#f8f8f8] xl:right-[27px] xl:top-[27px] xl:translate-y-0">
            <span className="relative block size-[32px] overflow-hidden">
              <img loading="lazy"
                alt=""
                className="absolute inset-[16.64%_12.47%_16.67%_12.5%] block h-[66.7%] w-[75%] max-w-none"
                src={img("imgGroup.svg")}
              />
            </span>
          </span>
        </article>

        {/* 4 — фото (отзеркалено) */}
        <article className="fit-card">
          <p className="absolute left-[15px] top-1/2 w-[219px] max-w-[calc(100%-88px)] -translate-y-1/2 text-[12px] xl:text-[14px] font-medium leading-[normal] text-[#676971] xl:left-[27px] xl:max-w-[calc(100%-118px)]">
            Беспокоит выпирающий живот, даже при нормальном весе
          </p>
          <span className="absolute right-[5px] top-1/2 block size-[60px] -translate-y-1/2 -scale-x-100 overflow-hidden rounded-[10px] lg:top-[5px] lg:size-[80px] lg:translate-y-0 lg:rounded-[15px]">
            <img loading="lazy"
              alt=""
              className="absolute left-[-11.25%] top-0 size-[127.81%] max-w-none"
              src={img("imgImage1.webp")}
            />
          </span>
        </article>

        {/* 5 — иконка живота */}
        <article className="fit-card">
          <p className="absolute left-[15px] xl:left-[27px] top-1/2 w-[211px] max-w-[calc(100%-118px)] -translate-y-1/2 text-[12px] xl:text-[14px] font-medium leading-[normal] text-[#676971]">
            Был диагностирован пролапс 1–2 степени
          </p>
          <span className="absolute right-[15px] top-1/2 flex size-[36px] -translate-y-1/2 items-center justify-center rounded-[8px] bg-[#f8f8f8] xl:right-[26px] xl:top-[27px] xl:translate-y-0">
            <span className="relative block size-[24px] overflow-hidden">
              <img loading="lazy"
                alt=""
                className="absolute inset-[9.5%_9%] block h-[88%] w-[90%] max-w-none"
                src={img("imgGroup1.svg")}
              />
            </span>
          </span>
        </article>

        {/* 6 — фото (отзеркалено) */}
        <article className="fit-card">
          <p className="absolute left-[15px] top-1/2 w-[241px] max-w-[calc(100%-88px)] -translate-y-1/2 text-[12px] xl:text-[14px] font-medium leading-[normal] text-[#676971] xl:left-[27px] xl:max-w-[calc(100%-118px)]">
            Есть боли в пояснице или крестце, которые не проходят
          </p>
          <span className="absolute right-[5px] top-1/2 block size-[60px] -translate-y-1/2 -scale-x-100 overflow-hidden rounded-[10px] lg:top-[5px] lg:size-[80px] lg:translate-y-0 lg:rounded-[15px]">
            <img loading="lazy"
              alt=""
              className="absolute left-[-5.62%] top-[-63.43%] h-[184.46%] w-[123.75%] max-w-none"
              src={img("imgImage2.webp")}
            />
          </span>
        </article>
      </div>
    </section>
  );
}
