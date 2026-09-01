import { AppLink } from "@/components/ui/AppLink";
import { assetPath } from "@/lib/asset-path";

export type HubCard = {
  href: string;
  src: string;
  alt: string;
  title: string;
  label: string;
};

/**
 * Хаб-карточки как на Тильде: равные карточки в ряд (десктоп ≥1200px),
 * на узком экране — колонкой. Голубая схема, не оливковая.
 */
export function HubCards({ items }: { items: readonly HubCard[] }) {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-[16px] p-0 min-[900px]:grid-cols-3 xl:gap-[20px]">
      {items.map((item, i) => {
        const href = item.href.trim();
        const className =
          "group flex h-full min-w-0 flex-col overflow-hidden rounded-[20px] bg-surface-blue shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-hover)]";
        const inner = (
          <>
            <span
              className="relative block aspect-[356/265] w-full shrink-0 overflow-hidden"
              style={
                item.src
                  ? undefined
                  : { backgroundImage: "var(--gradient-soft)" }
              }
            >
              {item.src ? (
                <img
                  src={assetPath(item.src)}
                  alt={item.alt}
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              ) : null}
            </span>
            <span className="flex flex-1 flex-col gap-[12px] px-[16px] pb-[16px] pt-[14px]">
              <span className="font-display text-[16px] font-bold leading-[1.3] text-ink">
                {item.title}
              </span>
              {item.label ? (
                <span
                  className="mt-auto inline-flex min-h-[40px] w-fit items-center justify-center rounded-[12px] px-[20px] font-display text-[13px] font-bold text-white"
                  style={{ backgroundImage: "var(--gradient-primary)" }}
                >
                  {item.label}
                </span>
              ) : null}
            </span>
          </>
        );

        return (
          <li key={`${href || item.title}-${i}`} className="min-w-0">
            {!href ? (
              <div className={className}>{inner}</div>
            ) : (
              <AppLink href={href} className={className}>
                {inner}
              </AppLink>
            )}
          </li>
        );
      })}
    </ul>
  );
}
