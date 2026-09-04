import { assetPath } from "@/lib/asset-path";
const img = (name: string) => assetPath(`/images/beauty-health/${name}`);

const bonuses = [
  {
    value: "5%",
    text: "кэшбек подруге, когда она купит курс по твоей ссылке или промокоду",
  },
  {
    value: "10%",
    text: "бонусов начислится тебе от суммы её покупки",
  },
  {
    value: "5 000 ₽ ",
    text: "можно вывести на карту или оплатить бонусами при следующей оплате",
  },
];

const steps = [
  {
    left: 8,
    top: 244,
    width: 188,
    n: "1",
    text: (
      <>
        <span className="mb-0 block">{"Скопируй ссылку "}</span>
        <span className="block">или промокод в личном кабинете</span>
      </>
    ),
    textWidth: undefined as number | undefined,
  },
  {
    left: 215,
    top: 134,
    width: 140,
    n: "2",
    text: "Отправь подруге в мессенджере или соцсетях",
    textWidth: 178,
  },
  {
    left: 403,
    top: 244,
    width: 140,
    n: "3",
    text: "После покупки курса бонус начислится автоматически вам и подруге",
    textWidth: 162,
  },
];

/** «Реферальная программа KochFitpay» — Figma 2031:2414 */
export function ReferralSection() {
  return (
    <section data-figma-node="2031:2414" className="relative mx-auto w-full max-w-[1160px] lg:h-[378px]">
      {/* ——— Mobile (<lg): вертикальный стек ——— */}
      <div className="flex flex-col gap-[20px] lg:hidden">
        <div className="flex flex-col items-start gap-[12px]">
          <h2 className="font-display text-[22px] font-normal leading-[1.25] text-[#4b4d57]">
            Реферальная программа KochFitpay
          </h2>
          <p className="text-[14px] font-normal leading-[1.45] text-[#676971]">
            Рекомендуй курс подруге и получи деньги на карту или скидку на курсы
          </p>
        </div>

        {/* Фото + шаги */}
        <div className="relative w-full overflow-hidden rounded-[20px] drop-shadow-[2px_-2px_4px_rgba(224,224,224,0.25)]">
          <img loading="lazy"
            alt=""
            className="absolute inset-0 size-full max-w-none object-cover"
            src={img("imgImage10-1200.webp")}
          />
          <span className="absolute inset-0 block bg-[rgba(0,0,0,0.25)]" />
          <div className="relative flex flex-col gap-[16px] p-[20px]">
            {steps.map((step) => (
              <div key={step.n} className="flex items-center gap-[12px]">
                <span className="flex size-[22px] shrink-0 items-center justify-center rounded-[5px] bg-[#f8f8f8] text-[12px] font-semibold leading-[normal] text-[#676971]">
                  {step.n}
                </span>
                <p className="min-w-0 flex-1 text-[13px] font-normal leading-[1.4] text-white">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-[12px]">
          {bonuses.map((bonus) => (
            <article
              key={bonus.value}
              className="flex flex-col items-start gap-[10px] rounded-[16px] border border-solid border-[#efefef] bg-white p-[16px]"
            >
              <p className="whitespace-nowrap text-[16px] font-semibold leading-[normal] text-[#4b4d57]">
                {bonus.value}
              </p>
              <p className="w-full text-[12px] font-normal leading-[1.4] text-[#999ca8]">
                {bonus.text}
              </p>
            </article>
          ))}
        </div>
      </div>

      {/* ——— Desktop (lg+): исходный абсолютный макет ——— */}
      <div className="hidden lg:block">
      <div className="absolute left-0 top-0 flex w-[460px] flex-col items-start gap-[12px]">
        <h2 className="w-[414px] font-display text-[24px] font-normal leading-[1.2] text-[#4b4d57]">
          Реферальная программа KochFitpay
        </h2>
        <p className="w-[295px] text-[14px] font-normal leading-[normal] text-[#676971]">
          Рекомендуй курс подруге и получи деньги на карту или скидку на курсы
        </p>
      </div>

      {/* Карточка с шагами на фото — 2031:2418 */}
      <div className="absolute left-[590px] top-0 h-[350px] w-[570px] overflow-hidden rounded-[20px] drop-shadow-[2px_-2px_4px_rgba(224,224,224,0.25)]">
        <span className="absolute inset-0 block overflow-hidden">
          <img
            loading="lazy"
            alt=""
            className="size-full object-cover object-[center_30%]"
            src={img("imgImage10-1200.webp")}
          />
        </span>
        <span className="absolute left-[-39px] top-[93px] block size-[648px]">
          <img loading="lazy" alt="" className="block size-full max-w-none" src={img("imgContainer1.svg")} />
        </span>
        {steps.map((step) => (
          <div
            key={step.n}
            className="absolute flex flex-col items-center gap-[6px]"
            style={{ left: step.left, top: step.top, width: step.width }}
          >
            <span className="flex size-[22px] items-center justify-center rounded-[5px] bg-[#f8f8f8] text-[12px] font-semibold leading-[normal] text-[#676971]">
              {step.n}
            </span>
            <p
              className="text-center text-[12px] font-normal leading-[normal] text-white"
              style={step.textWidth ? { width: step.textWidth } : undefined}
            >
              {step.text}
            </p>
          </div>
        ))}
      </div>

      <div className="absolute left-0 top-[228px] flex items-center gap-[12px]">
        {bonuses.map((bonus) => (
          <article
            key={bonus.value}
            className="flex w-[178px] flex-col items-start gap-[20px] rounded-[16px] border border-solid border-[#efefef] bg-white p-[16px]"
          >
            <p className="whitespace-nowrap text-[16px] font-semibold leading-[normal] text-[#4b4d57]">
              {bonus.value}
            </p>
            <p className="w-full text-[12px] font-normal leading-[normal] text-[#999ca8]">
              {bonus.text}
            </p>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}
