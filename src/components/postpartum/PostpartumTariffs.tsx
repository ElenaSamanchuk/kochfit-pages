import { assetPath } from "@/lib/asset-path";
import { coursePricing } from "@/content/courses";
import { AppLink } from "@/components/ui/AppLink";

const img = (name: string) => assetPath(`/images/postpartum/${name}`);
const tariffs = coursePricing.postpartum.tariffs;

/** «Тарифы курса» — Figma 2042:9328 */
export function PostpartumTariffs() {
  return (
    <section
      id="tariffs"
      data-figma-node="2042:9328"
      className="mx-auto flex w-full max-w-[1160px] scroll-mt-[20px] flex-col items-start gap-6 sm:gap-[40px]"
    >
      <h2 className="w-full font-display text-[24px] font-normal leading-[1.2] text-[#4b4d57]">
        {"Тарифы курса "}
      </h2>
      <div className="relative w-full overflow-hidden rounded-[20px] bg-white pb-5 xl:h-[331px] xl:pb-0">
        <span className="absolute inset-0 xl:left-[-372px] xl:top-[-172px] xl:block xl:h-[519px] xl:w-[1740px]">
          <img loading="lazy"
            alt=""
            className="absolute inset-0 size-full max-w-none object-cover"
            src={img("imgBackgroundImage.png")}
          />
          <span className="absolute inset-0 block bg-gradient-to-r from-[rgba(0,0,0,0.35)] from-[20%] to-[rgba(0,0,0,0)] xl:from-[rgba(0,0,0,0.1)] xl:from-[34.36%]" />
        </span>

        <div className="relative z-[1] flex flex-col gap-3 px-[15px] pb-[15px] pt-[15px] xl:contents">
          <span className="plaque bg-surface-blue text-plaque xl:absolute xl:right-[30px] xl:top-[30px]">
            {coursePricing.postpartum.startBadge}
          </span>
          <p className="max-w-[344px] text-[14px] font-normal leading-[normal] text-white xl:absolute xl:left-[30px] xl:top-[30px]">
            {"Выбирайте доступ в зависимости от того, "}
            <br aria-hidden />
            на каком этапе восстановления вы находитесь
          </p>
        </div>

        <div className="relative z-[1] flex flex-col gap-4 px-[15px] xl:px-0">
          {tariffs.map((tariff) => (
            <article
              key={tariff.tab}
              className={`relative flex w-full flex-col items-center px-[15px] pb-3 pt-[34px] overflow-hidden rounded-[20px] bg-white shadow-[2px_2px_8px_0px_rgba(224,224,224,0.25)] xl:absolute xl:top-[88px] xl:block xl:h-[213px] xl:overflow-hidden xl:px-0 xl:pb-0 xl:pt-0 ${tariff.xlLeft} ${tariff.xlWidth} xl:w-[353px]`}
            >
              <span
                className="absolute left-1/2 top-0 flex h-[26px] w-[87px] -translate-x-1/2 items-center justify-center rounded-b-[10px] text-center text-[12px] font-semibold text-white"
                style={{
                  backgroundImage:
                    "var(--gradient-primary)",
                }}
              >
                {tariff.tab}
              </span>
              <div className="flex w-full flex-col items-center text-center font-semibold xl:absolute xl:left-1/2 xl:top-[63px] xl:w-[min(220px,calc(100%-32px))] xl:-translate-x-1/2">
                <p className="text-[14px] leading-[normal] text-[#676971]">
                  {"Доступ на "}
                  <span className="text-[#84b0d2]">{tariff.months}</span>
                </p>
                <p className="mt-[3px] flex items-center justify-center gap-2 whitespace-nowrap text-[18px] leading-[normal] text-[#4b4d57]">
                  <span>{tariff.priceLabel}</span>
                </p>
              </div>
              <AppLink
                href={tariff.checkoutUrl}
                className="mt-1.5 flex w-full items-center justify-center rounded-[12px] px-[32px] py-[12px] xl:absolute xl:bottom-[16px] xl:left-[16px] xl:mt-0 xl:w-[321px] xl:py-[16px]"
                style={{
                  backgroundImage:
                    "var(--gradient-primary)",
                }}
              >
                <span className="whitespace-nowrap text-center font-display text-[14px] font-bold leading-[1.2] text-white">
                  Купить тариф
                </span>
              </AppLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
