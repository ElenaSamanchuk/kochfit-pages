import { assetPath } from "@/lib/asset-path";
import { AppLink } from "@/components/ui/AppLink";
import { journalArticles, type JournalArticle } from "@/content/public-pages";

const img = (name: string) => assetPath(`/images/pregnancy/${name}`);

type MaterialCard = {
  title: string;
  subtitle: string;
  href: JournalArticle["href"];
  activeDot: number;
};

function journalHref(href: JournalArticle["href"]): JournalArticle["href"] {
  const article = journalArticles.find((a) => a.href === href);
  if (!article) throw new Error(`Unknown journal article ${href}`);
  return article.href;
}

/** Реальные статьи журнала (/st* из journalArticles и old-site-url-map) */
const materials: MaterialCard[] = [
  {
    title: "Восстановление толщины мышц живота",
    subtitle: "А также их сократительной функции после родов",
    href: journalHref("/st1"),
    activeDot: 0,
  },
  {
    title: "Слабость мышц тазового дна",
    subtitle: "Что делать и когда идти к врачу",
    href: journalHref("/st10"),
    activeDot: 1,
  },
  {
    title: "Репродуктивная система беременной",
    subtitle: "Как меняется тело во время беременности",
    href: journalHref("/st6"),
    activeDot: 2,
  },
  {
    title: "Туалетные привычки",
    subtitle: "Для здоровья тазового дна и мочевого пузыря",
    href: journalHref("/st5"),
    activeDot: 3,
  },
  {
    title: "Варикоз: причины и профилактика",
    subtitle: "Что важно знать во время беременности",
    href: journalHref("/st7"),
    activeDot: 4,
  },
];

function MaterialCardLink({ card }: { card: MaterialCard }) {
  return (
    <AppLink
      href={card.href}
      aria-label={`${card.title}. ${card.subtitle}`}
      className="useful-material-card relative flex h-auto min-h-0 w-[242px] shrink-0 flex-col self-stretch overflow-visible rounded-[18px] bg-white p-[15px] shadow-[var(--shadow-card)] min-[1200px]:min-h-[207px] min-[1200px]:p-4"
    >
      <span className="flex items-start justify-between gap-2">
        <span className="flex min-w-0 flex-1 flex-col items-start gap-2">
          <span className="flex items-start gap-[4px]">
            {Array.from({ length: 5 }, (_, d) => (
              <span
                key={d}
                className={`block size-[7px] rounded-[100px] bg-[#999ca8] ${
                  d === card.activeDot ? "" : "opacity-25"
                }`}
              />
            ))}
          </span>
          <span className="course-catalog-tag bg-surface text-ink-muted">Статья</span>
        </span>
        <img
          loading="lazy"
          alt=""
          className="block size-[26px] shrink-0"
          src={img("imgArrowSmall.svg")}
        />
      </span>
      <div className="mt-auto flex w-full min-w-0 flex-col items-start gap-[4px] pt-2 leading-[normal]">
        <p className="w-full min-w-0 [text-wrap:wrap] break-words text-[14px] font-semibold text-[#4b4d57]">
          {card.title}
        </p>
        <p className="w-full min-w-0 [text-wrap:wrap] break-words text-[12px] font-medium text-[#999ca8]">
          {card.subtitle}
        </p>
      </div>
    </AppLink>
  );
}

/** «Полезные материалы Kochfit» — лента статей, Figma 2351:11004 */
export function UsefulMaterials() {
  return (
    <section
      data-figma-node="2351:11004"
      className="relative mx-auto w-full max-w-[1400px] overflow-x-visible overflow-y-visible"
    >
      <div className="mx-auto flex min-w-0 max-w-[1160px] flex-col gap-6 overflow-x-visible min-[1200px]:flex-row min-[1200px]:items-stretch min-[1200px]:gap-4">
        <div className="flex shrink-0 flex-col gap-4 min-[1200px]:w-[242px] min-[1200px]:justify-between">
          <h2 className="font-display text-[22px] font-normal leading-[1.25] text-[#4b4d57] min-[1200px]:text-[24px] min-[1200px]:leading-[1.2]">
            Полезные материалы Kochfit
          </h2>
          <div className="hidden items-center gap-[4px] xl:flex">
            <button
              type="button"
              aria-label="Прокрутить назад"
              data-carousel-prev="#useful-materials-scroll"
              className="flex size-[40px] items-center justify-center transition"
            >
              <img
                loading="lazy"
                alt=""
                className="block size-full max-w-none -rotate-90 -scale-y-100"
                src={img("imgArrowNav.svg")}
              />
            </button>
            <button
              type="button"
              aria-label="Прокрутить вперёд"
              data-carousel-next="#useful-materials-scroll"
              className="flex size-[40px] items-center justify-center transition"
            >
              <img
                loading="lazy"
                alt=""
                className="block size-full max-w-none -rotate-90"
                src={img("imgArrowNav.svg")}
              />
            </button>
          </div>
        </div>

        <div className="min-w-0 w-full overflow-x-visible overflow-y-visible">
          {/* Карточки — прямые дети скроллера: hscroll-bleed без padding-inline
              (иначе Chromium режет карточку). items-stretch — равная высота. */}
          <div
            id="useful-materials-scroll"
            data-drag-scroll
            className="flex min-w-0 items-stretch gap-3 overflow-x-auto overflow-y-visible scroll-smooth pb-1 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [touch-action:pan-x] max-[1199px]:hscroll-bleed min-[1200px]:mr-[calc((1160px-100vw)/2)] min-[1200px]:flex-1 min-[1200px]:gap-4 min-[1200px]:hscroll-end-bleed [&::-webkit-scrollbar]:hidden"
          >
            {materials.map((card, i) => (
              <MaterialCardLink key={i} card={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
