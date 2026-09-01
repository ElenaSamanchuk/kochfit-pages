import { assetPath } from "@/lib/asset-path";
import Link from "next/link";
import { routes } from "@/content/routes";

const img = (name: string) => assetPath(`/images/home/${name}`);

/** Figma 2265:2893 — native 2608w, sizes = ширина файла (dpr2 @ 40px CSS). */
const JULIA_AVATAR_BUST = "v=author-julia-native-2608";
const juliaAvatarWebp = (width: number) =>
  `${assetPath(`/images/home/imgRectangle29012-${width}.webp`)}?${JULIA_AVATAR_BUST}`;
const juliaAvatarSrcSet = `${juliaAvatarWebp(2608)} 2608w`;
const juliaAvatarSizes = "2608px";

/** Figma 2265:2908 — native fill widths, sizes = ширина файла (dpr2 @ 26px CSS). */
const PARTICIPANT_BUST = "v=author-participants-native";
const participantWebp = (stem: string, width: number) =>
  `${assetPath(`/images/home/${stem}-${width}.webp`)}?${PARTICIPANT_BUST}`;
const participantAvatars = [
  { stem: "imgRectangle29016", width: 1470, node: "2265:2909" },
  { stem: "imgRectangle29017", width: 736, node: "2265:2910" },
  { stem: "imgRectangle29019", width: 474, node: "2265:2911" },
] as const;

function AuthorQuoteBody() {
  return (
    <>
      <span
        data-figma-node="2265:2893"
        className="relative block size-[40px] overflow-hidden rounded-full border border-solid border-surface-blue"
      >
        <img
          loading="lazy"
          decoding="async"
          alt=""
          width={80}
          height={100}
          className="absolute top-[-41.79%] left-[-73.61%] h-[340.78%] w-[272.45%] max-w-none"
          src={juliaAvatarWebp(2608)}
          srcSet={juliaAvatarSrcSet}
          sizes={juliaAvatarSizes}
        />
      </span>
      <div className="flex w-full flex-col gap-1 font-semibold leading-[normal]">
        <p className="text-body-lg text-ink">Юлия Кочкина</p>
        <p className="text-small text-ink-muted xl:text-[11px] xl:leading-[15px]">
          «Здесь не обещают «быстрое чудо», а помогают разобраться, что происходит с телом, дают инструменты, с которыми можно прийти к реальному результату»
        </p>
      </div>
    </>
  );
}

/** «Kochfit ведёт Юлия Кочкина» — Figma 2265:2884 */
export function AuthorSection() {
  return (
    <section
      data-figma-node="2265:2884"
      className="relative mx-auto flex w-full max-w-[1160px] flex-col gap-6 overflow-visible bg-bg py-4 xl:min-h-[504px] xl:flex-row xl:items-start xl:gap-[327px] xl:py-[55px]"
    >
      {/* Фон — Figma 2265:2885: прекомпозит (асфальт + бегунья); светлые полосы в ассете = --color-bg (#f8f8f8) */}
      <span
        aria-hidden
        data-figma-node="2265:2885"
        className="pointer-events-none absolute left-1/2 top-0 z-0 hidden h-[503px] w-full max-w-[1160px] -translate-x-1/2 xl:block"
      >
        <img
          loading="lazy"
          decoding="async"
          alt=""
          width={2320}
          height={1006}
          className="block size-full object-cover object-top"
          src={img("imgAuthorSectionBg.webp")}
        />
      </span>

      {/* Левая колонка */}
      <div className="relative z-10 flex w-full flex-col gap-6 sm:gap-8 xl:w-[472px] xl:shrink-0 xl:gap-[154px]">
        <h2 className="max-w-[338px] font-display text-h2 font-normal leading-[1.2] text-ink">
          Kochfit ведёт Юлия Кочкина
        </h2>
        <div className="flex w-full flex-col items-start xl:pl-[50px]">
          <div className="flex w-full flex-col gap-4 xl:flex-row xl:flex-nowrap xl:items-end xl:gap-5">
            {/* Mobile: текст слева, стрелка сверху справа, фото в правом нижнем углу; без «Подробнее» */}
            <Link
              href={routes.person}
              aria-label="Подробнее об авторе курса"
              data-figma-node="2265:2892"
              className="group/author-mobile relative flex w-full flex-col overflow-hidden rounded-2xl bg-white p-[15px] transition hover:opacity-95 xl:hidden"
            >
              <span
                data-figma-node="2265:2897"
                aria-hidden
                className="absolute right-[12px] top-[12px] z-10 block size-[36px] shrink-0 overflow-hidden rounded-full border border-solid border-surface-blue bg-surface-blue"
              >
                <img
                  loading="lazy"
                  alt=""
                  width={36}
                  height={36}
                  className="block size-full transition duration-300 group-hover/author-mobile:translate-x-[2px] group-hover/author-mobile:-translate-y-[2px]"
                  src={img("imgAuthorArrowMobile.svg")}
                />
              </span>
              <span
                data-figma-node="2265:2893"
                aria-hidden
                className="pointer-events-none absolute bottom-[10px] right-[10px] z-0 block size-[48px] overflow-hidden rounded-full border border-solid border-surface-blue shadow-[var(--shadow-card)]"
              >
                <img
                  loading="lazy"
                  decoding="async"
                  alt=""
                  width={96}
                  height={120}
                  className="absolute top-[-41.79%] left-[-73.61%] h-[340.78%] w-[272.45%] max-w-none"
                  src={juliaAvatarWebp(2608)}
                  srcSet={juliaAvatarSrcSet}
                  sizes={juliaAvatarSizes}
                />
              </span>
              <div className="relative z-[1] flex min-w-0 flex-col gap-1 pr-11 font-semibold leading-[normal]">
                <p className="text-body-lg leading-tight text-ink">Юлия Кочкина</p>
                <p className="max-w-[calc(100%-14px)] whitespace-pre-line pb-1 text-small leading-[1.35] tracking-[-0.02em] text-ink-muted">
                  «Здесь не обещают «быстрое чудо», а помогают разобраться, что происходит с телом, дают инструменты, с которыми можно прийти к реальному результату»
                </p>
              </div>
            </Link>
            {/* Desktop: статичная белая карточка с цитатой */}
            <div className="hidden w-full flex-col items-start gap-5 rounded-2xl bg-white p-4 xl:flex xl:w-[262px] xl:max-w-[262px] xl:flex-none">
              <AuthorQuoteBody />
            </div>
            {/* Figma 2265:2897: glass card — desktop xl; шире 140, чтобы «об авторе курса» влезло в 2 строки */}
            <Link
              href={routes.person}
              data-figma-node="2265:2897"
              className="group/author hidden min-h-[44px] w-full flex-col items-start gap-5 rounded-2xl border border-solid border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.2)] p-4 backdrop-blur-[10px] transition hover:border-[rgba(255,255,255,0.32)] hover:bg-[rgba(255,255,255,0.3)] hover:brightness-105 xl:flex xl:h-[130px] xl:w-[160px] xl:min-w-[160px] xl:shrink-0"
            >
              <span className="relative block size-[40px] shrink-0 overflow-hidden rounded-full">
                <img
                  loading="lazy"
                  alt=""
                  width={40}
                  height={40}
                  className="block size-full transition duration-300 group-hover/author:translate-x-[2px] group-hover/author:-translate-y-[2px]"
                  src={img("img5.svg")}
                />
              </span>
              <span
                data-figma-node="2265:2901"
                className="block text-[13px] font-medium leading-[19px] text-white"
              >
                <span className="block whitespace-nowrap">Подробнее</span>
                <span className="block whitespace-nowrap">об авторе курса</span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Правая колонка — Figma 2265:2902: items-center, карточка 260 по центру (inset ~50.5) */}
      <div className="relative z-10 flex w-full min-w-0 flex-col gap-6 sm:gap-8 xl:w-[361px] xl:max-w-[361px] xl:shrink-0 xl:items-center xl:gap-[158px]">
        <p className="w-full min-w-0 font-display text-[15px] font-normal leading-[1.35] text-ink-secondary sm:text-body-lg xl:text-right xl:leading-[1.2]">
          Кочфит — это не только тренировка и экспертность, но и большое комьюнити, в котором есть
          поддержка от Юлии, куратора
        </p>
        <div
          data-figma-node="2265:2905"
          className="flex w-full flex-col items-start gap-5 rounded-lg border border-solid border-transparent bg-white p-[15px] sm:max-w-[320px] xl:w-[260px] xl:max-w-[260px] xl:shrink-0 xl:border-[rgba(255,255,255,0.2)] xl:bg-[rgba(255,255,255,0.2)] xl:backdrop-blur-[10px] xl:p-4"
        >
          <div className="flex w-full flex-col items-start gap-3">
            <span className="flex flex-wrap items-center gap-[5px] rounded-full p-px">
              <span className="flex items-center">
                {participantAvatars.map(({ stem, width, node }, i) => (
                  <span
                    key={stem}
                    data-figma-node={node}
                    className={`relative block size-[26px] overflow-hidden rounded-full border border-solid border-surface-blue shadow-[var(--shadow-card)] ${
                      i < 2 ? "mr-[-5px]" : ""
                    }`}
                  >
                    <img
                      loading="lazy"
                      decoding="async"
                      alt=""
                      width={52}
                      height={78}
                      className="block size-full object-cover"
                      src={participantWebp(stem, width)}
                      srcSet={`${participantWebp(stem, width)} ${width}w`}
                      sizes={`${width}px`}
                    />
                  </span>
                ))}
              </span>
              <span className="whitespace-nowrap text-small font-medium leading-[normal] text-ink xl:text-white">
                + 4 000 участниц
              </span>
            </span>
            <p className="w-full text-body font-semibold leading-[normal] text-ink xl:text-white">
              Комфортное достижение результата каждой из участниц
            </p>
          </div>
          <Link
            href={routes.result}
            className="btn-primary flex min-h-[44px] w-full items-center justify-center rounded-[10px] px-3 py-1.5 transition hover:brightness-105 active:brightness-95 sm:max-xl:rounded-[12px] sm:max-xl:px-8 sm:max-xl:py-3 xl:rounded-[12px] xl:px-[32px] xl:py-[16px]"
          >
            <span className="whitespace-nowrap text-center font-display text-[13px] font-bold leading-[1.2] text-white sm:text-[14px]">
              Результаты и отзывы
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
