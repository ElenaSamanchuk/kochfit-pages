type AboutCard = {
  title: string;
  text: React.ReactNode;
  gradient?: boolean;
};

const cards: AboutCard[] = [
  {
    title: "Знакомство с собственным телом по-новому",
    text: "Понимание, как работать с разными запросами о своём теле",
  },
  {
    title: "Появляется регулярность",
    text: "Программа расписана по дням: можно выбирать время тренировки в зависимости от загрузки своего расписания",
  },
  {
    title: "Улучшается самочувствие",
    text: "Лучше осанка, меньше боли и отёков, высвобождается больше энергии",
  },
  {
    title: "Меняется внешний вид",
    text: "Внешние изменения как результат комплексного подхода в тренировках и регулярности",
    gradient: true,
  },
];

function Dots({ active, light }: { active: number; light?: boolean }) {
  return (
    <span className="flex items-start gap-[4px]">
      {Array.from({ length: 4 }, (_, i) => (
        <span
          key={i}
          className={`block size-[7px] rounded-[100px] ${light ? "bg-white" : "bg-[#999ca8]"} ${
            i === active ? "" : "opacity-25"
          }`}
        />
      ))}
    </span>
  );
}

/** «Про что этот курс Kochfit» — Figma 2031:2246 */
export function AboutCourse() {
  return (
    <section
      data-figma-node="2031:2246"
      className="mx-auto flex w-full max-w-[1160px] flex-col items-start gap-6 overflow-x-visible sm:gap-[40px]"
    >
      <h2 className="font-display text-[22px] font-normal leading-[1.25] text-[#4b4d57] lg:text-[24px] lg:leading-[1.2]">
        Про что этот курс Kochfit
      </h2>
      <div
        data-drag-scroll
        className="flex min-w-0 snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overflow-y-visible pb-2 [-ms-overflow-style:none] [scrollbar-width:none] max-xl:hscroll-bleed sm:gap-[20px] xl:w-full xl:overflow-visible xl:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card, i) => (
          <article
            key={card.title}
            className={`flex w-[min(275px,80vw)] shrink-0 snap-start flex-col items-start gap-[20px] rounded-[16px] p-[15px] drop-shadow-[2px_2px_4px_rgba(224,224,224,0.25)] sm:w-[275px] sm:p-[20px] ${
              card.gradient ? "" : "bg-white"
            }`}
            style={
              card.gradient
                ? {
                    backgroundImage:
                      "var(--gradient-primary)",
                  }
                : undefined
            }
          >
            <div className="flex w-full flex-col gap-[12px]">
              <Dots active={i} light={card.gradient} />
              <p
                className={`text-[16px] font-semibold leading-[normal] ${
                  card.gradient ? "text-white" : "text-[#4b4d57]"
                }`}
              >
                {card.title}
              </p>
            </div>
            <p
              className={`w-full text-[12px] font-medium leading-[normal] ${
                card.gradient ? "text-white" : "text-[#999ca8]"
              }`}
            >
              {card.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
