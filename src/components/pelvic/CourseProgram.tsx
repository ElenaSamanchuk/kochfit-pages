import type { ReactNode } from "react";
import { assetPath } from "@/lib/asset-path";
import { externalLinks } from "@/content/links";
import { AppLink } from "@/components/ui/AppLink";

const img = (name: string) => assetPath(`/images/pelvic-floor/${name}`);

function BulletIcon({ icon }: { icon: string }) {
  return (
    <span className="relative block size-[13px] shrink-0 overflow-hidden">
      <img loading="lazy"
        alt=""
        className="absolute inset-[13.33%_0] block h-[73.35%] w-full max-w-none"
        src={img(icon)}
      />
    </span>
  );
}

const juliaWebinars = [
  {
    strong: "Анатомия дыхания: ",
    rest: "как связаны лёгкие, диафрагма и тазовое дно",
  },
  {
    strong: "Упражнения Кегеля: ",
    rest: "кому нужны, кому нет и в каком формате",
  },
  {
    strong: "Мышцы живота и тазовое дно:",
    rest: " как они работают вместе",
  },
  { strong: "Виды недержания и тренировка мочевого пузыря", rest: "" },
  {
    strong: "Пролапс тазовых органов: ",
    rest: "что это и что делать",
  },
  { strong: "Тема оргазмов: физиология и работа с телом", rest: "" },
  { strong: "Анатомия и дисфункции мышц тазового дна", rest: "" },
];

const doctorWebinars = [
  "Гинекологический check-up: что и когда проверять",
  "Контрацепция и женское здоровье",
  "Варикоз, пролапс, растяжки",
  "Менструальный цикл",
];

type PracticeCard = {
  count: string;
  chip?: string;
  title: string;
  text: ReactNode;
};

const practiceCards: PracticeCard[] = [
  {
    count: "42",
    chip: "25 - 40 мин",
    title: "Урока в формате «следуй за мной»",
    text: (
      <>
        <span className="text-[#676971]">
          {"Практики в формате реального занятия с Юлей: "}
        </span>
        {"включаешь и делаешь вместе. "}
        <span className="text-[#676971]">
          Работа с дыханием, мышцами тазового дна, осанкой, животом
        </span>
      </>
    ),
  },
  {
    count: "10",
    chip: "12 - 18 мин",
    title: "Короткие уроки",
    text: (
      <>
        <span className="text-[#676971]">
          {"Самостоятельные практики для ежедневного использования: "}
        </span>
        <span className="text-[#999ca8]">
          утренняя зарядка или практика в течение дня. Можно встроить в любой распорядок
        </span>
      </>
    ),
  },
  {
    count: "3",
    chip: "до 40 минут",
    title: "Силовые тренировки",
    text: (
      <>
        <span className="text-[#676971]">{"Для отслеживания динамики: "}</span>
        <span className="text-[#999ca8]">
          делаешь в начале курса, в середине и в конце. Помогают увидеть, что изменилось в контроле
          и ощущениях
        </span>
      </>
    ),
  },
];

function PracticeArticle({ card, mobile = false }: { card: PracticeCard; mobile?: boolean }) {
  return (
    <article
      className={`flex flex-col items-start gap-[20px] rounded-[16px] bg-white p-[15px] drop-shadow-[2px_2px_4px_rgba(224,224,224,0.25)] lg:p-[20px] ${
        mobile ? "w-full" : "w-[376px]"
      }`}
    >
      <div className="flex w-full items-start justify-between">
        <p className="whitespace-nowrap text-[24px] font-semibold leading-[normal] text-[#4b4d57]">
          {card.count}
        </p>
        {card.chip && (
          <span className="inline-flex items-center justify-center rounded-[7px] bg-surface-blue px-[8px] py-[4px] text-center text-[12px] font-semibold leading-none text-plaque">
            {card.chip}
          </span>
        )}
      </div>
      <div className="flex w-full flex-col gap-[8px]">
        <p className="w-full text-[14px] font-semibold leading-[normal] text-[#4b4d57]">
          {card.title}
        </p>
        <p className="w-full text-[12px] font-normal leading-[1.45] text-[#999ca8]">{card.text}</p>
      </div>
    </article>
  );
}

function PartLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-[10px]">
      <span className="whitespace-nowrap text-[12px] font-medium uppercase leading-[normal] text-[#6d8da6]">
        {text}
      </span>
      <span className="block h-px flex-1 rounded-[38px] bg-[#6d8da6] opacity-30" />
    </div>
  );
}

/** «Что будет на курсе» — полноширинная лента, Figma 2031:2704 */
export function CourseProgram() {
  return (
    <section
      data-figma-node="2031:2704"
      className="-mx-(--page-inset-x) overflow-hidden bg-[#edf4f9] lg:h-[670px]"
    >
      {/* ——— Desktop (lg+) ——— */}
      <div className="relative mx-auto hidden h-full w-full max-w-[1160px] lg:block">
        <h2 className="absolute left-0 top-[40px] w-full font-display text-[25px] font-normal leading-[1.2] text-ink">
          Что будет на курсе
        </h2>

        <div className="absolute left-0 top-[100px] flex w-full items-center gap-[10px]">
          <span className="whitespace-nowrap text-[12px] font-medium uppercase leading-[normal] text-[#6d8da6]">
            Практическая часть
          </span>
          <span className="block h-px w-[1010px] rounded-[38px] bg-[#6d8da6] opacity-30" />
        </div>

        {/* Практика: 3 карточки */}
        <div className="absolute left-0 top-[136px] flex items-start gap-[16px]">
          {practiceCards.map((card) => (
            <PracticeArticle key={card.title} card={card} />
          ))}
        </div>

        <div className="absolute left-0 top-[334px] flex w-full items-center gap-[10px]">
          <span className="whitespace-nowrap text-[12px] font-medium uppercase leading-[normal] text-[#6d8da6]">
            теоретическая часть
          </span>
          <span className="block h-px w-[1004px] rounded-[38px] bg-[#6d8da6] opacity-30" />
        </div>

        {/* Вебинары Юлии — 2031:2705 */}
        <article className="absolute left-0 top-[370px] h-[260px] w-[570px] overflow-hidden rounded-[16px] border border-solid border-[#efefef] bg-white shadow-[2px_2px_8px_0px_rgba(224,224,224,0.25)]">
          <span className="absolute left-[20px] top-[20px] block size-[40px] overflow-hidden rounded-[50px] border border-solid border-[#efefef]">
            <img loading="lazy"
              alt=""
              className="absolute left-[-73.61%] top-[-41.79%] h-[340.78%] w-[272.45%] max-w-none"
              src={img("imgIndicatorImage.webp")}
            />
          </span>
          <div className="absolute left-[71px] top-[23px] flex w-[200px] flex-col items-start leading-[normal]">
            <p className="w-full text-[14px] font-semibold text-[#4b4d57]">Вебинар Юлии Кочкиной</p>
            <p className="w-full text-[12px] font-medium text-[#676971]">
              тренер и специалист по движению
            </p>
          </div>
          <div className="absolute left-[19px] top-[79px] flex w-[530px] flex-col items-start gap-[8px]">
            {juliaWebinars.map((item) => (
              <span key={item.strong} className="flex w-full items-center gap-[8px]">
                <BulletIcon icon="imgGroup2.svg" />
                <span className="w-[509px] text-[12px] font-normal leading-[normal] text-[#676971]">
                  {item.strong}
                  {item.rest && <span className="text-[#999ca8]">{item.rest}</span>}
                </span>
              </span>
            ))}
          </div>
        </article>

        {/* Вебинары акушера-гинеколога — 2031:2747 */}
        <article className="absolute left-[590px] top-[370px] h-[260px] w-[570px] overflow-hidden rounded-[16px] bg-[#6d8da6] shadow-[2px_2px_8px_0px_rgba(224,224,224,0.25)]">
          <span className="absolute left-[20px] top-[20px] block size-[40px] overflow-hidden rounded-[50px] border border-solid border-[#efefef]">
            <img loading="lazy"
              alt=""
              className="absolute left-[-37.69%] top-[-3.58%] size-[175%] max-w-none"
              src={img("imgIndicatorImage1.png")}
            />
          </span>
          <div className="absolute left-[71px] top-[23px] flex w-[300px] flex-col items-start leading-[normal]">
            <p className="whitespace-nowrap text-[14px] font-semibold text-white">
              4 вебинара от акушера-гинеколога
            </p>
            <p className="text-[12px] font-medium text-[#f8f8f8]">практикующий врач</p>
          </div>
          <div className="absolute left-[20px] top-[80px] flex w-[530px] flex-col items-start gap-[8px]">
            {doctorWebinars.map((item) => (
              <span key={item} className="flex w-full items-center gap-[8px]">
                <BulletIcon icon="imgGroup3.svg" />
                <span className="w-[509px] text-[12px] font-normal leading-[normal] text-white">
                  {item}
                </span>
              </span>
            ))}
          </div>
          <AppLink
            href={externalLinks.buy.pelvicFloor}
            className="btn-on-dark absolute left-[20px] top-[191px] flex items-center justify-center rounded-[12px] px-[32px] py-[16px]"
          >
            <span className="whitespace-nowrap text-center font-display text-[14px] font-bold leading-[1.2]">
              Купить курс
            </span>
          </AppLink>
        </article>
      </div>

      {/* ——— Mobile (<lg) ——— */}
      <div className="flex flex-col gap-6 px-(--page-inset-x) py-[40px] lg:hidden">
        <h2 className="font-display text-[22px] font-normal leading-[1.25] text-ink">
          Что будет на курсе
        </h2>

        <PartLabel text="Практическая часть" />
        <div className="flex flex-col gap-[12px]">
          {practiceCards.map((card) => (
            <PracticeArticle key={card.title} card={card} mobile />
          ))}
        </div>

        <PartLabel text="теоретическая часть" />
        <div className="flex flex-col gap-[12px]">
          <article className="flex flex-col gap-[16px] rounded-[16px] border border-solid border-[#efefef] bg-white p-[15px] shadow-[2px_2px_8px_0px_rgba(224,224,224,0.25)]">
            <div className="flex items-center gap-[12px]">
              <span className="relative block size-[40px] shrink-0 overflow-hidden rounded-[50px] border border-solid border-[#efefef]">
                <img loading="lazy"
                  alt=""
                  className="absolute left-[-73.61%] top-[-41.79%] h-[340.78%] w-[272.45%] max-w-none"
                  src={img("imgIndicatorImage.webp")}
                />
              </span>
              <div className="flex min-w-0 flex-col leading-[normal]">
                <p className="text-[14px] font-semibold text-[#4b4d57]">Вебинар Юлии Кочкиной</p>
                <p className="text-[12px] font-medium text-[#676971]">
                  тренер и специалист по движению
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-[8px]">
              {juliaWebinars.map((item) => (
                <span key={item.strong} className="flex w-full items-start gap-[8px]">
                  <span className="mt-[2px]">
                    <BulletIcon icon="imgGroup2.svg" />
                  </span>
                  <span className="min-w-0 text-[12px] font-normal leading-[1.45] text-[#676971]">
                    {item.strong}
                    {item.rest && <span className="text-[#999ca8]">{item.rest}</span>}
                  </span>
                </span>
              ))}
            </div>
          </article>

          <article className="flex flex-col gap-[16px] rounded-[16px] bg-[#6d8da6] px-[15px] pt-[15px] pb-[24px] shadow-[2px_2px_8px_0px_rgba(224,224,224,0.25)]">
            <div className="flex items-center gap-[12px]">
              <span className="relative block size-[40px] shrink-0 overflow-hidden rounded-[50px] border border-solid border-[#efefef]">
                <img loading="lazy"
                  alt=""
                  className="absolute left-[-37.69%] top-[-3.58%] size-[175%] max-w-none"
                  src={img("imgIndicatorImage1.png")}
                />
              </span>
              <div className="flex min-w-0 flex-col leading-[normal]">
                <p className="text-[14px] font-semibold text-white">
                  4 вебинара от акушера-гинеколога
                </p>
                <p className="text-[12px] font-medium text-[#f8f8f8]">практикующий врач</p>
              </div>
            </div>
            <div className="flex flex-col gap-[8px]">
              {doctorWebinars.map((item) => (
                <span key={item} className="flex w-full items-start gap-[8px]">
                  <span className="mt-[2px]">
                    <BulletIcon icon="imgGroup3.svg" />
                  </span>
                  <span className="min-w-0 text-[12px] font-normal leading-[1.45] text-white">
                    {item}
                  </span>
                </span>
              ))}
            </div>
            <AppLink
              href={externalLinks.buy.pelvicFloor}
              className="btn-on-dark flex min-h-[48px] w-full items-center justify-center rounded-[12px] px-[32px] py-[14px]"
            >
              <span className="whitespace-nowrap text-center font-display text-[14px] font-bold leading-[1.2]">
                Купить курс
              </span>
            </AppLink>
          </article>
        </div>
      </div>
    </section>
  );
}
