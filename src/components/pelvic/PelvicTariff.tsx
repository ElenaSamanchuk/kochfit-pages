import { assetPath } from "@/lib/asset-path";
import { coursePricing } from "@/content/courses";
import { AppLink } from "@/components/ui/AppLink";

const img = (name: string) => assetPath(`/images/pelvic-floor/${name}`);
const { pelvicFloor: pricing } = coursePricing;

const features = [
  { icon: "imgGroup5.svg", text: "Доступ открывается с момента покупки" },
  { icon: "imgGroup6.svg", text: "Тренируйся через телефон / ноутбук / в своём темпе" },
  { icon: "imgGroup6.svg", text: "52 урока, 3 тренировки, вебинары от специалистов и врачей" },
];

/** «Тариф курса» — Figma 2031:2837 */
export function PelvicTariff() {
  return (
    <section
      id="tariffs"
      data-figma-node="2031:2837"
      className="mx-auto flex w-full max-w-[1160px] scroll-mt-[20px] flex-col items-start gap-6 sm:gap-[40px]"
    >
      <h2 className="w-full font-display text-[22px] font-normal leading-[1.25] text-[#4b4d57] lg:text-[24px] lg:leading-[1.2]">
        {"Тариф курса "}
      </h2>

      <div className="flex w-full flex-col gap-5 xl:flex-row xl:items-start xl:gap-[20px]">
        <article className="relative w-full overflow-hidden rounded-[20px] bg-white p-[15px] shadow-[2px_2px_8px_0px_rgba(224,224,224,0.25)] xl:h-[280px] xl:w-[469px] xl:p-0">
          <div className="mb-4 flex flex-col items-start gap-[4px] pr-[150px] font-semibold xl:absolute xl:left-[20px] xl:top-[20px] xl:mb-0 xl:w-[220px] xl:pr-0">
            <p className="w-full text-[14px] leading-[normal] text-[#676971]">
              {"Доступ на "}
              <span className="text-[#84b0d2]">{pricing.tariff.period}</span>
            </p>
            <span className="hidden w-full flex-wrap items-center gap-[8px] leading-[normal] xl:flex">
              <span className="text-[24px] text-[#4b4d57]">{pricing.tariff.priceLabel}</span>
            </span>
          </div>
          <span className="plaque absolute right-[15px] top-[15px] bg-surface-blue text-plaque xl:right-[20px] xl:top-[20px]">
            Единственный тариф
          </span>
          <span className="mb-4 hidden h-px w-full rounded-[38px] bg-[#efefef] xl:absolute xl:left-[20px] xl:top-[96px] xl:mb-0 xl:block xl:w-[429px]" />
          <div className="mb-5 flex flex-col items-start gap-[8px] xl:absolute xl:left-[20px] xl:top-[117px] xl:mb-0 xl:w-[429px]">
            {features.map((feature) => (
              <span key={feature.text} className="flex items-start gap-[8px]">
                <span className="relative mt-0.5 block size-[13px] shrink-0 overflow-hidden">
                  <img loading="lazy"
                    alt=""
                    className="absolute inset-[13.33%_0] block h-[73.35%] w-full max-w-none"
                    src={img(feature.icon)}
                  />
                </span>
                <span className="text-[12px] font-medium leading-[normal] text-[#676971]">
                  {feature.text}
                </span>
              </span>
            ))}
          </div>
          <p className="mb-4 flex items-center justify-center gap-2 font-semibold leading-[normal] xl:hidden">
            <span className="text-[24px] text-[#4b4d57]">{pricing.tariff.priceLabel}</span>
          </p>
          <AppLink
            href={pricing.tariff.checkoutUrl}
            className="flex w-full items-center justify-center rounded-[12px] px-[32px] py-[16px] xl:absolute xl:left-[20px] xl:top-[211px] xl:w-[429px]"
            style={{
              backgroundImage:
                "var(--gradient-primary)",
            }}
          >
            <span className="whitespace-nowrap text-center font-display text-[14px] font-bold leading-[1.2] text-white">
              Купить курс
            </span>
          </AppLink>
        </article>

        <article className="relative h-[112px] w-full overflow-hidden rounded-[20px] bg-white xl:h-[280px] xl:w-[671px]">
          <span className="absolute inset-0 block overflow-hidden">
            <img loading="lazy"
              alt=""
              className="absolute inset-0 size-full max-w-none object-cover object-[50%_24%]"
              src={img("imgBackgroundImage.png")}
            />
            <span
              className="absolute inset-0 block"
              style={{
                backgroundImage:
                  "linear-gradient(-89deg, rgba(0, 0, 0, 0) 0.22%, rgba(0, 0, 0, 0.29) 48.23%)",
              }}
            />
          </span>
          <span className="absolute right-[12px] top-[10px] z-10 block size-[30px] rounded-[8px] border border-solid border-[rgba(239,239,239,0.35)] bg-[rgba(248,248,248,0.2)] backdrop-blur-[2px] xl:hidden">
            <img loading="lazy"
              alt=""
              className="absolute left-[5px] top-[5px] block size-[20px]"
              src={img("imgGlyphsQuestionBold.svg")}
            />
          </span>
          <div className="absolute inset-x-[15px] top-[10px] bottom-[10px] flex flex-col items-start justify-center gap-5 xl:bottom-auto xl:left-[40px] xl:right-auto xl:top-1/2 xl:w-[379px] xl:-translate-y-1/2 xl:gap-[30px]">
            <span className="relative hidden size-[30px] rounded-[8px] border border-solid border-[rgba(239,239,239,0.35)] bg-[rgba(248,248,248,0.2)] backdrop-blur-[2px] xl:block">
              <img loading="lazy"
                alt=""
                className="absolute left-[5px] top-[5px] block size-[20px]"
                src={img("imgGlyphsQuestionBold.svg")}
              />
            </span>
            <div className="flex w-full flex-col gap-[2px] leading-[1.25] text-white max-xl:pr-[36px] xl:gap-[4px] xl:leading-[normal]">
              <p className="w-full text-[18px] font-semibold xl:text-[20px]">Почему именно 3 месяца?</p>
              <p className="w-full text-[13px] font-normal xl:text-[14px]">
                {"Этого достаточно, чтобы изменения закрепились, "}
                 а не ушли после первой недели
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
