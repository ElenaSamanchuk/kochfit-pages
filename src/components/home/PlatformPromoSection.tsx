import { assetPath } from "@/lib/asset-path";
import { typo } from "@/lib/typography";
import { externalLinks } from "@/content/links";
import { Switch } from "@/components/ui/Switch";

const img = (name: string) => assetPath(`/images/home/${name}`);

const platformFeatures: { id: string; title: string; text: string }[] = [
  {
    id: "workouts",
    title: typo("Тренировки, в один клик: зашли, нажали, пошло!"),
    text: typo("Удобнее, быстрее и всё в одном месте, чтобы тренироваться было"),
  },
  {
    id: "tracker",
    title: typo("Личный кабинет с трекером прогресса:"),
    text: typo("отмечайте завершённые занятия и отслеживайте путь"),
  },
  {
    id: "favorites",
    title: typo("Функция «Избранное»:"),
    text: typo("сохраняйте любимые тренировки и возвращайтесь к ним"),
  },
  {
    id: "offline",
    title: typo("Работает даже при слабом интернете,"),
    text: typo("удобно в поездках и на прогулках"),
  },
];

/** Промо платформы / ЛК — Figma 2031:2123 (правая карточка в паре с AppPromo) */
export function PlatformPromoSection() {
  return (
    <article
      data-figma-node="2031:2123"
      className="flex w-full flex-col overflow-hidden rounded-lg bg-white shadow-[var(--shadow-card)] xl:min-h-[344px] xl:w-[552px] xl:shrink-0 xl:self-stretch"
    >
      <a
        href={externalLinks.platform}
        target="_blank"
        rel="noopener noreferrer"
        className="relative mx-2 mt-2 block min-h-[116px] overflow-hidden rounded-sm sm:mx-[8px] sm:mt-[8px]"
      >
        <span className="absolute inset-0 block overflow-hidden">
          {/* Figma 2031:2138 — ноутбук на камнях */}
          <img
            alt=""
            aria-hidden
            width={1072}
            height={432}
            decoding="async"
            loading="lazy"
            className="pointer-events-none absolute inset-0 size-full max-w-none object-cover object-[88%_50%] sm:inset-auto sm:left-[0.01%] sm:top-[-38.77%] sm:h-[191.25%] sm:w-[101.84%] sm:object-fill sm:object-center"
            src={img("imgTelegramCloudPhotoSize25217572614337927521Y61.webp")}
          />
        </span>
        <span className="relative flex min-h-[116px] flex-col justify-between gap-2 p-3 pr-14 sm:min-h-0 sm:justify-start sm:gap-3 sm:max-xl:p-[15px] sm:max-xl:pr-12 xl:p-4 xl:pr-12">
          <span className="course-catalog-tag max-xl:!px-2 max-xl:!py-[5px] max-xl:!text-[10px] bg-surface text-ink-secondary">
            Перейти в новый личный кабинет ➔
          </span>
          <span className="max-w-[215px] text-[13px] font-medium leading-snug text-ink sm:max-w-[250px] sm:text-body-lg">
            {typo("Все тренировки Kochfit теперь на нашей новой платформе!")}
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

      <ul className="flex flex-1 flex-col gap-4 p-[15px] pt-4 sm:gap-5 sm:p-5 sm:pt-5 xl:gap-4">
        {platformFeatures.map((feature) => (
          <li key={feature.id} className="flex items-center gap-4">
            <Switch />
            <p className="text-small leading-snug text-ink">
              <span className="font-semibold">{feature.title}</span>
              <span className="font-normal text-ink-secondary"> {feature.text}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}
