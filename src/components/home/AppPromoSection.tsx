import { assetPath } from "@/lib/asset-path";
import { typo } from "@/lib/typography";
import { externalLinks } from "@/content/links";

const img = (name: string) => assetPath(`/images/home/${name}`);

const socials = [
  {
    title: "ВКонтакте",
    text: typo("Тренировки, советы и полезные материалы"),
    href: externalLinks.vk,
  },
  {
    title: "YouTube",
    text: typo("Видеоуроки и разборы от Юлии"),
    href: externalLinks.youtube,
  },
  {
    title: "Бот Telegram",
    text: typo("Тренировки, советы и полезные материалы"),
    href: externalLinks.telegramBot,
  },
];

/** Промо приложения и соцсети — Figma 2031:2146 (левая карточка в паре с PlatformPromo) */
export function AppPromoSection() {
  return (
    <article
      data-figma-node="2031:2146"
      className="flex w-full flex-col overflow-hidden rounded-lg bg-white shadow-[var(--shadow-card)] xl:min-h-[344px] xl:w-[588px] xl:shrink-0 xl:self-stretch"
    >
        <a
          href={externalLinks.appStore}
          target="_blank"
          rel="noopener noreferrer"
          className="relative mx-2 mt-2 block min-h-[116px] overflow-hidden rounded-sm sm:mx-[8px] sm:mt-[8px]"
        >
          <span className="absolute inset-0 block overflow-hidden">
            {/* Figma 2031:2148 — телефон на камнях, один слой с crop */}
            <img
              alt=""
              aria-hidden
              width={1144}
              height={432}
              decoding="async"
              loading="lazy"
              className="pointer-events-none absolute inset-0 size-full max-w-none object-cover object-[78%_50%] sm:inset-auto sm:left-0 sm:top-[-33.99%] sm:h-[186%] sm:w-full sm:object-fill sm:object-center"
              src={img("imgTelegramCloudPhotoSize25217572614337927521Y62.webp")}
            />
          </span>
          <span className="relative flex min-h-[116px] flex-col justify-between gap-2 p-3 pr-14 sm:min-h-0 sm:justify-start sm:gap-3 sm:max-xl:p-[15px] sm:max-xl:pr-12 xl:p-4 xl:pr-12">
            <span className="course-catalog-tag max-xl:!px-2 max-xl:!py-[5px] max-xl:!text-[10px] bg-surface text-ink-secondary">
              Скачать в AppStore или Google Play ➔
            </span>
            <span className="max-w-[215px] text-[13px] font-medium leading-snug text-ink sm:max-w-[265px] sm:text-body-lg">
              {typo("Курсы KOCHFIT в обновленном мобильном приложении!")}
            </span>
          </span>
          <img
            loading="lazy"
            alt=""
            width={26}
            height={26}
            className="absolute right-3 top-3 block size-[26px]"
            src={img("img3.svg")}
          />
        </a>

        <div className="flex flex-1 flex-col justify-end gap-4 p-[15px] pt-[15px] sm:p-5">
          <p className="text-body-lg font-medium leading-[normal] text-ink">Мы в соцсетях</p>
          <div className="overflow-hidden max-sm:overflow-visible xl:overflow-visible">
            <div
              data-drag-scroll
              className="flex flex-col gap-3 max-sm:flex-col sm:-mx-1 sm:flex-row sm:snap-x sm:snap-mandatory sm:overflow-x-auto sm:max-xl:pb-1 sm:[scrollbar-width:none] sm:[-ms-overflow-style:none] sm:mx-0 xl:overflow-visible xl:pb-0 sm:[&::-webkit-scrollbar]:hidden"
            >
              {socials.map((social) => (
                <a
                  key={social.title}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex min-h-[68px] w-full flex-col items-start gap-1.5 rounded-lg border border-solid border-line bg-white p-3 pr-11 sm:min-h-[110px] sm:gap-5 sm:max-xl:p-[15px] sm:max-xl:pr-[15px] sm:w-[min(178px,72vw)] sm:shrink-0 sm:snap-start xl:w-[178px] xl:p-4 xl:pr-4"
                >
                  <img
                    loading="lazy"
                    alt=""
                    width={26}
                    height={26}
                    className="absolute right-3 top-3 block size-[26px] sm:right-4 sm:top-4"
                    src={img("img4.svg")}
                  />
                  <span className="block h-[26px] w-full">
                    <span className="whitespace-nowrap text-body font-semibold leading-[26px] text-ink">
                      {social.title}
                    </span>
                  </span>
                  <span className="text-caption font-normal leading-snug text-ink-muted sm:text-small sm:">
                    {social.text}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
    </article>
  );
}
