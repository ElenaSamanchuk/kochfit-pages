import type { ReactNode } from "react";
import Link from "next/link";
import { assetPath } from "@/lib/asset-path";
import { routes } from "@/content/routes";

/** Cache-bust: без query браузер оставляет мыльные 480w/1100w. */
const CACHE_BUST = "v=figma-crop";
/** Мостик 2031:2302: Lanczos3 550/1100/1650/2752 — sizes = CSS-бокс, не 2752px. */
const BRIDGE_BUST = "v=bridge-lanczos-srcset";
const img = (name: string) => `${assetPath(`/images/beauty-health/${name}`)}?${CACHE_BUST}`;
const bridgeImg = (name: string) => `${assetPath(`/images/beauty-health/${name}`)}?${BRIDGE_BUST}`;

const webpSrcSet = (stem: string, widths: number[], bust = CACHE_BUST) =>
  widths
    .map((w) => `${assetPath(`/images/beauty-health/${stem}-${w}.webp`)}?${bust} ${w}w`)
    .join(", ");

/** 550/1100/1650 — pre-downscale Lanczos3; 2752 — native Figma fill. */
const bridgePhotoSrcSet = webpSrcSet("imgImage1", [550, 1100, 1650, 2752], BRIDGE_BUST);
const duoPhotoSrcSet = webpSrcSet("imgImage2", [700, 1100, 2000]);
const appMockupSrcSet = webpSrcSet("imgIPhone15Pro", [560, 840]);

/**
 * sizes: desktop = CSS-бокс коллажа; mobile = квадратный thumb 60px (fit-card / WhyKochfit).
 * Mobile: duo→Тренировки; bridge 2031:2302 (рядом с телефонами на деске)→Многоуровневая
 * и Дыхание/МФР; phone mockup остаётся только в десктоп-карточке.
 */
const bridgePhotoSizes = "(min-width: 1024px) 275px, 60px";
const duoPhotoSizes = "(min-width: 1024px) 292px, 60px";
const appMockupSizes = "260px";
/** Мобильный квадратный thumb 60px — тот же макет телефонов, что в десктоп-карточке. */
const appMockupThumbSizes = "(min-width: 1024px) 260px, 90px";
/** Figma CROP 2031:2469 → 161:174; 644 = 4× бокса, 966 = 6×. sizes = CSS-бокс. */
const authorPortraitSrcSet = webpSrcSet("imgAuthorPortrait", [644, 966]);
const authorPortraitSizes = "161px";

/**
 * Квадратный thumb float-right — заголовок и список обтекают картинку
 * (без колонки под thumb и пустоты под заголовком).
 */
function MobileCardThumb({
  children,
  className = "bg-[#edf4f9]",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`relative float-right mb-[8px] ml-[12px] block size-[60px] overflow-hidden rounded-[10px] ${className}`}
    >
      {children}
    </span>
  );
}

const mobileCardClass = "flow-root rounded-[12px] bg-white p-[15px]";
const mobileTitleClass = "text-[14px] font-semibold leading-[normal] text-[#4b4d57]";
/* без flex — иначе список не обтекает float */
const mobileListClass =
  "mt-[12px] list-disc space-y-[8px] pl-[18px] text-[12px] font-normal leading-[1.45] text-[#999ca8]";

/** «Что внутри курса» — Figma 2031:2288 + карточки 2031:2289…2031:2454 */
export function InsideCourse() {
  return (
    <section data-figma-node="2031:2288" className="mx-auto w-full max-w-[1160px]">
      <h2 className="font-display text-[22px] font-normal leading-[1.25] text-[#4b4d57] lg:text-[24px] lg:leading-[1.2]">
        Что внутри курса
      </h2>

      {/* ——— Mobile (<lg): текст обтекает квадрат float-right ——— */}
      <div className="mt-6 flex flex-col gap-[12px] lg:hidden">
        {/* Тренировки + duo 2031:2312 */}
        <article className={mobileCardClass}>
          <MobileCardThumb className="">
            <span
              className="absolute inset-0"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            />
            <img
              loading="lazy"
              alt=""
              className="absolute inset-0 size-full max-w-none object-cover object-center"
              src={img("imgImage2-1100.webp")}
              srcSet={duoPhotoSrcSet}
              sizes={duoPhotoSizes}
            />
          </MobileCardThumb>
          <p className={mobileTitleClass}>Тренировки с комплексным подходом</p>
          <ul className={mobileListClass}>
            <li>Разные уровни нагрузки и форматы</li>
            <li>Система, а не случайный набор упражнений, не просто фитнес, а образ жизни</li>
            <li>Полная система заботы о вашем теле и самочувствии</li>
          </ul>
        </article>

        {/* Многоуровневая — телефоны, как в десктоп-карточке 2031:2289 */}
        <article className={mobileCardClass}>
          <MobileCardThumb>
            <img
              loading="lazy"
              decoding="async"
              alt="Приложение Kochfit"
              width={60}
              height={60}
              className="absolute inset-0 size-full max-w-none origin-bottom scale-[1.45] object-contain object-bottom"
              src={img("imgIPhone15Pro-560.webp")}
              srcSet={appMockupSrcSet}
              sizes={appMockupThumbSizes}
            />
          </MobileCardThumb>
          <p className={mobileTitleClass}>Многоуровневая подача материала</p>
          <ul className={mobileListClass}>
            <li>
              Видеоуроки в формате «следуй за мной»: я веду каждое занятие от первой до последней
              минуты
            </li>
            <li>Все материалы теперь можно найти в приложении и личном кабинете</li>
          </ul>
        </article>

        {/* Дыхание и МФР + bridge/mat 2031:2302 */}
        <article className={mobileCardClass}>
          <MobileCardThumb>
            <img
              loading="lazy"
              decoding="async"
              alt=""
              width={60}
              height={60}
              className="absolute inset-0 size-full max-w-none object-cover object-center"
              src={bridgeImg("imgImage1-1100.webp")}
              srcSet={bridgePhotoSrcSet}
              sizes={bridgePhotoSizes}
            />
          </MobileCardThumb>
          <p className={mobileTitleClass}>Дыхание и МФР. Осанка и тазовое дно</p>
          <ul className={mobileListClass}>
            <li>Коррекции убирают хроническое напряжение в шее, пояснице, животе</li>
            <li>Силовые добавляются, когда тело готово</li>
          </ul>
        </article>

        <Link
          href={routes.person}
          aria-label="Подробнее об авторе курса"
          data-figma-node="2031:2454"
          className="relative overflow-hidden rounded-[12px] bg-white p-[15px] shadow-[2px_2px_8px_0px_rgba(224,224,224,0.25)] xl:p-[16px]"
        >
          {/* Портрет 161×174; голубой фон на всю высоту — голова/плечи на surface-blue, не на белом.
              Mobile: чуть меньше бокса, bottom-aligned — запас сверху, чтобы макушку не резал overflow. */}
          <span className="relative mx-auto block h-[174px] w-full overflow-hidden rounded-[8px] bg-surface-blue">
            <img
              loading="lazy"
              alt=""
              className="absolute inset-0 h-full w-full max-w-none"
              src={img("imgExclude.svg")}
            />
            <img
              loading="lazy"
              decoding="async"
              alt="Юлия Кочкина"
              width={161}
              height={174}
              className="pointer-events-none absolute bottom-0 left-1/2 z-[1] h-[158px] w-[146px] max-w-none -translate-x-1/2 object-fill"
              src={img("imgAuthorPortrait-644.webp")}
              srcSet={authorPortraitSrcSet}
              sizes={authorPortraitSizes}
            />
            {/* Круг со стрелкой — Figma 2031:2456: inset от края голубого фона (mobile) */}
            <img
              loading="lazy"
              alt=""
              data-figma-node="2031:2456"
              className="absolute right-4 top-4 z-[2] block size-[34px]"
              src={img("img.svg")}
            />
          </span>
          <div className="mt-[14px] flex flex-col gap-[8px]">
            <span className="plaque bg-surface text-ink-secondary">
              Создатель и тренер курса
            </span>
            <p className="text-[14px] font-semibold leading-[normal] text-[#4b4d57]">
              Юлия Кочкина
            </p>
            <ul className="flex list-disc flex-col gap-[8px] pl-[18px] text-[12px] font-normal leading-[1.45] text-[#999ca8]">
              <li>Тренер с 2014 года, специалист по движению и восстановлению после родов</li>
              <li>Автор фитнес-школы женского здоровья, помогла более 5000 женщинам</li>
            </ul>
          </div>
        </Link>
      </div>

      {/* ——— Desktop (lg+): исходный абсолютный коллаж ——— */}
      <div className="relative mt-[27px] hidden h-[311px] w-full lg:block">
        {/* Тренировки с комплексным подходом — 2031:2306 */}
        <article className="absolute left-0 top-0 h-[174px] w-[292px] overflow-hidden rounded-[12px] bg-white">
          <p className="absolute left-[16px] top-[16px] w-[218px] text-[14px] font-semibold leading-[normal] text-[#4b4d57]">
            {"Тренировки с комплексным"}
            <br aria-hidden />
            подходом
          </p>
          <ul className="absolute left-[10px] top-[62px] flex w-[272px] list-disc flex-col gap-[8px] text-[12px] font-normal leading-[normal] text-[#999ca8]">
            <li className="ms-[18px]">Разные уровни нагрузки и форматы</li>
            <li className="ms-[18px]">
              {"Система, а не случайный набор упражнений,"}
              <br aria-hidden />
              {"не просто фитнес, а образ жизни"}
            </li>
            <li className="ms-[18px]">
              {"Полная система заботы о вашем теле "}
              <br aria-hidden />и самочувствии
            </li>
          </ul>
        </article>
        {/* Фото под карточкой — 2031:2312 + 2031:2313 */}
        <span
          className="absolute left-0 top-[190px] block h-[121px] w-[292px] overflow-hidden rounded-[12px]"
          style={{
            backgroundImage:
              "var(--gradient-primary)",
          }}
        >
          <span className="absolute inset-0 overflow-hidden rounded-[12px]">
            <img
              loading="lazy"
              alt=""
              className="absolute h-[134.69%] left-[-0.09%] top-[-16.7%] w-full max-w-none object-cover"
              src={img("imgImage2-1100.webp")}
              srcSet={duoPhotoSrcSet}
              sizes={duoPhotoSizes}
            />
          </span>
        </span>

        {/* Многоуровневая подача материала — 2031:2289 */}
        <article className="absolute left-[308px] top-0 h-[311px] w-[251px] overflow-hidden rounded-[12px] bg-white">
          <p className="absolute left-[16px] top-[16px] w-[201px] text-[14px] font-semibold leading-[normal] text-[#4b4d57]">
            {"Многоуровневая подача"}
            <br aria-hidden />
            материала
          </p>
          <ul className="absolute left-[10px] top-[62px] flex w-[233px] list-disc flex-col gap-[8px] text-[12px] font-normal leading-[normal] text-[#999ca8]">
            <li className="ms-[18px]">
              {"Видеоуроки в формате «следуй "}
              <br aria-hidden />
              {"за мной»: я веду каждое занятие "}
              <br aria-hidden />
              от первой до последней минуты
            </li>
            <li className="ms-[18px]">
              {"Все материалы теперь можно найти "}
              <br aria-hidden />в приложении и личном кабинете
            </li>
          </ul>
          <span className="absolute left-[8px] top-[168px] block h-[135px] w-[235px] rounded-[10px] bg-[#edf4f9]" />
          <span className="absolute left-[3px] top-[153px] block h-[145px] w-[240px] overflow-hidden">
            <img
              loading="lazy"
              alt="Приложение Kochfit"
              className="absolute h-[134.42%] left-[-5.11%] top-[-18.83%] w-[108.44%] max-w-none object-contain object-bottom"
              src={img("imgIPhone15Pro-560.webp")}
              srcSet={appMockupSrcSet}
              sizes={appMockupSizes}
            />
          </span>
        </article>

        {/* Фото — 2031:2302 */}
        <span className="absolute left-[575px] top-0 block aspect-[275/152] w-[275px] overflow-hidden rounded-[12px] bg-[#edf4f9]">
          <img
            loading="lazy"
            decoding="async"
            alt=""
            width={275}
            height={152}
            className="absolute inset-0 h-full w-full object-cover object-center"
            src={bridgeImg("imgImage1-1100.webp")}
            srcSet={bridgePhotoSrcSet}
            sizes={bridgePhotoSizes}
          />
        </span>
        {/* Дыхание и МФР — 2031:2297 */}
        <article className="absolute left-[575px] top-[168px] h-[143px] w-[275px] overflow-hidden rounded-[12px] bg-white">
          <p className="absolute left-[16px] top-[16px] w-[153px] text-[14px] font-semibold leading-[normal] text-[#4b4d57]">
            {"Дыхание и МФР."}
            <br aria-hidden />
            {"Осанка и тазовое дно"}
          </p>
          <ul className="absolute left-[10px] top-[63px] w-[249px] list-disc text-[12px] font-normal leading-[normal] text-[#999ca8]">
            <li className="ms-[18px]">
              {"Коррекции убирают хроническое"}
              <br aria-hidden />
              {"напряжение в шее, пояснице, животе"}
            </li>
          </ul>
          <ul className="absolute left-[10px] top-[103px] w-[246px] list-disc text-[12px] font-normal leading-[normal] text-[#999ca8]">
            <li className="ms-[18px]">
              {"Силовые добавляются, когда тело"}
              <br aria-hidden />
              готово
            </li>
          </ul>
        </article>

        {/* Карточка автора — 2031:2454 */}
        <Link
          href={routes.person}
          aria-label="Подробнее об авторе курса"
          data-figma-node="2031:2454"
          className="absolute left-[866px] top-0 h-[311px] w-[294px] rounded-[12px] bg-white shadow-[2px_2px_8px_0px_rgba(224,224,224,0.25)]"
        >
          {/* Голубая подложка с вырезом под стрелку — Figma 2031:2463 (270×134) */}
          <span className="absolute left-[12px] top-[12px] block h-[134px] w-[270px]">
            <img loading="lazy" alt="" className="block size-full max-w-none" src={img("imgExclude.svg")} />
          </span>
          {/* Портрет — Figma 2031:2469: 161×174, left 67, top −28, fill stretch */}
          <img
            loading="lazy"
            decoding="async"
            alt="Юлия Кочкина"
            width={161}
            height={174}
            /* Figma 2031:2469 — 161×174 при left 67 / top −28 от карточки 294px */
            className="pointer-events-none absolute left-[67px] top-[-28px] h-[174px] w-[161px] max-w-none object-fill"
            src={img("imgAuthorPortrait-644.webp")}
            srcSet={authorPortraitSrcSet}
            sizes={authorPortraitSizes}
          />
          <img
            loading="lazy"
            alt=""
            data-figma-node="2031:2456"
            className="absolute left-[248px] top-[12px] block size-[34px]"
            src={img("img.svg")}
          />
          <span className="plaque absolute left-[16px] top-[164px] bg-surface text-ink-secondary">
            Создатель и тренер курса
          </span>
          <p className="absolute left-[16px] top-[194px] w-[243px] text-[14px] font-semibold leading-[normal] text-[#4b4d57]">
            Юлия Кочкина
          </p>
          <ul className="absolute left-[10px] top-[223px] flex w-[271px] list-disc flex-col gap-[8px] text-[12px] font-normal leading-[normal] text-[#999ca8]">
            <li className="ms-[18px]">
              {"Тренер с 2014 года, специалист по"}
              <br aria-hidden />
              {"движению и восстановлению после родов"}
            </li>
            <li className="ms-[18px]">
              {"Автор фитнес-школы женского здоровья,"}
              <br aria-hidden />
              {"помогла более 5000 женщинам"}
            </li>
          </ul>
        </Link>
      </div>
    </section>
  );
}
