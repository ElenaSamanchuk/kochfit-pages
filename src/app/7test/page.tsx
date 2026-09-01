import { PageShell } from "@/components/site/PageShell";
import { AppLink } from "@/components/ui/AppLink";
import { FeatureCheckIcon } from "@/components/ui/FeatureCheckIcon";
import { Typo } from "@/components/ui/TypoText";
import { trialCheckoutUrl, trialWeekContent } from "@/content/trial-week";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: trialWeekContent.title,
  description: trialWeekContent.description,
  path: "/7test",
});

const cardClass =
  "rounded-[24px] bg-white p-[24px] shadow-[var(--shadow-card)] lg:p-[40px]";

const sectionTitleClass =
  "font-display text-[22px] font-normal leading-[1.25] text-ink lg:text-[26px] lg:leading-[1.2]";

function BuyButton({ className = "" }: { className?: string }) {
  return (
    <AppLink
      href={trialCheckoutUrl}
      className={`btn-primary inline-flex min-h-[52px] items-center justify-center rounded-[14px] px-[32px] font-display text-[15px] font-bold text-white transition hover:brightness-105 active:scale-[0.99] ${className}`.trim()}
    >
      {trialWeekContent.ctaLabel}
    </AppLink>
  );
}

/** «Тестовая неделя» — перенос old-site/page32578561.html в голубую схему */
export default function TrialWeekPage() {
  const c = trialWeekContent;

  return (
    <PageShell>
      <Typo>
        <div className="flex flex-col gap-[20px] lg:gap-[24px]">
          {/* Hero */}
          <section
            className="rounded-[24px] px-[24px] py-[32px] text-white sm:px-[28px] sm:py-[40px] lg:px-[48px]"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-white/80">
              {c.overline}
            </p>
            <h1 className="mt-3 font-display text-[32px] font-normal leading-[1.15] lg:text-[44px]">
              {c.headline}
            </h1>
            <p className="mt-[14px] max-w-[620px] text-[16px] leading-[1.45] text-white/90 sm:leading-[1.5]">
              {c.intro}
            </p>

            <div className="mt-[20px] flex flex-wrap gap-[8px]">
              {c.badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center rounded-full bg-white/20 px-[14px] py-[7px] text-[12px] font-semibold text-white"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-[24px] flex flex-col gap-[14px] sm:flex-row sm:items-center sm:gap-[20px]">
              <BuyButton className="btn-on-dark" />
              <span className="font-display text-[20px] font-bold text-white">
                {c.price}
                <span className="text-[13px] font-normal text-white/80"> {c.priceNote}</span>
              </span>
            </div>

            <p className="mt-[20px] max-w-[560px] text-[14px] leading-[1.45] text-white/85 sm:leading-[1.5]">
              {c.proof}
            </p>
          </section>

          {/* Пробная неделя — это возможность */}
          <section className={cardClass}>
            <h2 className={sectionTitleClass}>{c.opportunities.title}</h2>
            <ul className="mt-6 space-y-[14px]">
              {c.opportunities.items.map((item) => (
                <li
                  key={item.verb}
                  className="flex gap-[12px] text-[15px] leading-[1.5] text-ink-secondary"
                >
                  <FeatureCheckIcon className="mt-[4px] block size-[14px] shrink-0" />
                  <span>
                    <span className="font-semibold text-ink">{item.verb}</span> {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Что входит */}
          <section className={cardClass}>
            <h2 className={sectionTitleClass}>{c.included.title}</h2>
            <ol className="mt-6 space-y-[18px]">
              {c.included.items.map((item, i) => (
                <li key={item.title} className="flex gap-[14px]">
                  <span className="mt-[2px] flex size-[28px] shrink-0 items-center justify-center rounded-full bg-surface-blue font-display text-[13px] font-bold text-accent">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold leading-[1.4] text-ink">
                      {item.title}
                    </p>
                    {item.details.length > 0 && (
                      <ul className="mt-[8px] space-y-[6px] text-[14px] leading-[1.5] text-ink-secondary">
                        {item.details.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-[20px] rounded-[12px] bg-surface-blue px-[16px] py-[12px] text-[13px] leading-[1.45] text-ink-secondary">
              {c.included.note}
            </p>
          </section>

          {/* Кому подойдёт */}
          <section className={cardClass}>
            <h2 className={sectionTitleClass}>{c.fit.title}</h2>
            <ul className="mt-6 space-y-[12px]">
              {c.fit.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-[12px] rounded-[16px] bg-surface-blue p-[16px] text-[14px] leading-[1.5] text-ink-secondary sm:text-[15px]"
                >
                  <FeatureCheckIcon className="mt-[3px] block size-[14px] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Отзывы */}
          <section className={cardClass}>
            <h2 className={sectionTitleClass}>{c.reviews.title}</h2>
            <div className="mt-6 grid gap-[16px] md:grid-cols-2">
              {c.reviews.items.map((review) => (
                <blockquote
                  key={review}
                  className="rounded-[16px] border border-line bg-surface p-[18px] text-[14px] leading-[1.5] text-ink-secondary"
                >
                  {review}
                </blockquote>
              ))}
            </div>
          </section>

          {/* Финал */}
          <section
            className="rounded-[24px] px-[24px] py-[32px] text-white sm:px-[28px] sm:py-[36px] lg:px-[48px]"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            <h2 className="font-display text-[24px] font-normal sm:text-[26px]">
              {c.outro.title}
            </h2>
            <p className="mt-[12px] max-w-[620px] text-[15px] leading-[1.45] text-white/90 sm:leading-[1.55]">
              {c.outro.text}
            </p>
            <BuyButton className="btn-on-dark mt-[22px]" />
          </section>
        </div>
      </Typo>
    </PageShell>
  );
}
