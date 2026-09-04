import { assetPath } from "@/lib/asset-path";
const img = (name: string) => assetPath(`/images/pelvic-floor/${name}`);

const mtdFacts = [
  "держат органы малого таза",
  " участвуют в дыхании",
  "влияют на осанку и ощущения в теле",
  "работа с осанкой, животом, движением, общим состоянием",
];

const weakSigns = ["появляются подтекания", "боли ", "дискомфорт при близости", "выпирающий живот"];

/** «Что такое МТД?» — Figma 2031:2808 */
export function WhatIsMtd() {
  return (
    <section data-figma-node="2031:2808" className="mx-auto w-full max-w-[1160px]">
      <h2 className="font-display text-[22px] font-normal leading-[1.25] text-[#4b4d57] lg:text-[24px] lg:leading-[1.2]">
        Что такое МТД?
      </h2>
      <div className="mt-6 flex w-full flex-col gap-4 sm:mt-[40px] xl:flex-row xl:items-start xl:gap-[16px]">
        {/* flow-root — текст обтекает квадрат на мобилке (как InsideCourse) */}
        <article className="relative w-full flow-root overflow-hidden rounded-[16px] bg-white p-[15px] xl:h-[309px] xl:w-[724px] xl:p-0">
          {/* Mobile: «Схема МТД» квадрат float-right у вводного абзаца */}
          <span className="relative float-right mb-[8px] ml-[12px] block size-[60px] overflow-hidden rounded-[10px] bg-[#edf4f9] xl:hidden">
            <img
              loading="lazy"
              alt="Схема мышц тазового дна"
              width={60}
              height={60}
              className="absolute inset-0 size-full max-w-none object-cover object-center"
              src={img("imgImage3.png")}
            />
          </span>
          {/* Mobile: ровно 4 строки (hard \\n + 13px/−0.02em у float 60px); xl — поток в 503px */}
          <p className="mb-4 whitespace-pre-line text-[13px] font-semibold leading-snug tracking-[-0.02em] text-[#4b4d57] sm:text-[18px] sm:tracking-normal xl:absolute xl:left-[20px] xl:top-[20px] xl:mb-0 xl:w-[503px] xl:whitespace-normal xl:leading-[normal] xl:tracking-normal">
            {`Это мышцы, которые влияют\nна\u00A0осанку, дыхание,\nдавление в\u00A0животе\nи\u00A0работу органов малого\u00A0таза`}
          </p>
          <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:absolute xl:left-[20px] xl:top-[88px] xl:mb-0 xl:block xl:gap-0">
            <div className="flex flex-col items-start gap-[8px] xl:w-[354px]">
              <p className="w-full text-[14px] font-semibold leading-[normal] text-[#4b4d57]">
                Что такое МТД?
              </p>
              {mtdFacts.map((fact) => (
                <ul
                  key={fact}
                  className="w-full list-disc text-[12px] font-normal leading-[normal] text-[#999ca8]"
                >
                  <li className="ms-[18px]">{fact}</li>
                </ul>
              ))}
            </div>
            <div className="flex flex-col items-start gap-[8px] xl:absolute xl:left-[400px] xl:top-0 xl:w-[265px]">
              <p className="text-[14px] font-semibold leading-[normal] text-[#4b4d57]">
                Если они слабы или перенапряжёны:
              </p>
              {weakSigns.map((sign) => (
                <ul
                  key={sign}
                  className="w-full list-disc text-[12px] font-normal leading-[normal] text-[#999ca8]"
                >
                  <li className="ms-[18px]">{sign}</li>
                </ul>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row xl:absolute xl:left-[20px] xl:top-[233px] xl:w-[684px] xl:gap-[15px]">
            <span className="flex min-w-0 flex-1 items-center gap-[12px] rounded-[8px] border border-solid border-[#efefef] p-[12px]">
              <img loading="lazy" alt="" className="block size-[16px] shrink-0" src={img("imgAtIconsCross.svg")} />
              <span className="min-w-0 flex-1 text-[12px] font-normal leading-[normal] text-[#676971]">
                Это не «возрастное» и не «после родов само
                 
                пройдёт»
              </span>
            </span>
            <span className="flex min-w-0 flex-1 items-center gap-[12px] rounded-[8px] border border-solid border-[#efefef] p-[12px]">
              <span className="relative block size-[16px] shrink-0 overflow-hidden">
                <img loading="lazy"
                  alt=""
                  className="absolute inset-[13.33%_0] block h-[73.35%] w-full max-w-none"
                  src={img("imgGroup4.svg")}
                />
              </span>
              <span className="min-w-0 flex-1 text-[12px] font-normal leading-[normal] text-[#676971]">
                Это решается через правильную работу с телом, в том числе на нашем курсе
              </span>
            </span>
          </div>
        </article>

        {/* Desktop: отдельная карточка со схемой */}
        <article className="relative hidden shrink-0 overflow-hidden rounded-[16px] bg-white xl:block xl:h-[309px] xl:w-[420px]">
          <img loading="lazy"
            alt="Схема мышц тазового дна"
            className="absolute inset-0 size-full object-cover"
            src={img("imgImage3.png")}
          />
          <span className="course-catalog-tag absolute left-[16px] top-[16px] bg-surface-blue text-accent">
            Схема МТД
          </span>
        </article>
      </div>
    </section>
  );
}
