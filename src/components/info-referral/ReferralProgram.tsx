import { AppLink } from "@/components/ui/AppLink";
import { externalLinks } from "@/content/links";
import { referralContent } from "@/content/migrated/referral";

const ctaClass =
  "btn-primary inline-flex min-h-[44px] w-fit items-center justify-center whitespace-nowrap rounded-[12px] px-5 py-4 text-[14px] transition hover:brightness-105 active:brightness-95 sm:px-8";

const heroBadgeClass =
  "inline-flex items-center justify-center whitespace-nowrap rounded-[8px] bg-surface-blue px-2.5 py-1 text-center text-[11px] font-semibold leading-none text-accent sm:px-3 sm:text-[12px]";

function LoginCta({ label }: { label: string }) {
  return (
    <AppLink href={externalLinks.login} className={ctaClass}>
      {label}
    </AppLink>
  );
}

function SectionCard({
  heading,
  children,
  id,
}: {
  heading: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-[96px] rounded-[24px] bg-white p-[28px] shadow-[var(--shadow-card)] lg:p-[40px]"
    >
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
        {referralContent.overline}
      </p>
      <h2 className="mt-2 font-display text-[22px] font-normal leading-[1.2] text-ink lg:text-[26px]">
        {heading}
      </h2>
      <div className="mt-6 space-y-[14px] text-[15px] leading-[1.5] sm:leading-[1.65] text-ink-secondary">
        {children}
      </div>
    </section>
  );
}

function NumberedList({ items }: { items: readonly string[] }) {
  return (
    <ol className="space-y-[14px]">
      {items.map((step, i) => (
        <li key={step} className="flex items-start gap-3">
          <span className="mt-[1px] flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-blue font-display text-[13px] font-bold text-accent">
            {i + 1}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

/** Реферальная программа "KochFitpay" — перенос old-site/page60737655.html, голубая схема */
export function ReferralProgram() {
  const { title, hero, about, rules, howItWorks, influencers } =
    referralContent;

  return (
    <div className="flex flex-col gap-[20px] lg:gap-[24px]">
      <header
        data-figma-node="referral-hero"
        className="scroll-mt-[96px] rounded-[24px] bg-white p-[28px] shadow-[var(--shadow-card)] lg:p-[48px]"
      >
        <div className="flex flex-wrap gap-2">
          {hero.badges.map((badge) =>
            badge.href ? (
              <AppLink
                key={badge.label}
                href={badge.href}
                className={`${heroBadgeClass} transition hover:brightness-95`}
              >
                {badge.label}
              </AppLink>
            ) : (
              <span
                key={badge.label}
                className={heroBadgeClass}
              >
                {badge.label}
              </span>
            ),
          )}
        </div>
        <h1 className="mt-4 font-display text-[28px] font-normal leading-[1.2] text-ink lg:text-[36px]">
          {title}
        </h1>
        <p className="mt-[14px] max-w-[560px] text-[16px] leading-[1.45] sm:leading-[1.6] text-ink-secondary">
          {hero.text}
        </p>
        <AppLink href={hero.ctaHref} className={`${ctaClass} mt-[24px]`}>
          {hero.cta}
        </AppLink>
      </header>

      <SectionCard id="about" heading={about.heading}>
        {about.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </SectionCard>

      <SectionCard heading={rules.heading}>
        {rules.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </SectionCard>

      <SectionCard heading={howItWorks.heading}>
        <NumberedList items={howItWorks.steps} />
        <div className="pt-[10px]">
          <LoginCta label={howItWorks.cta} />
        </div>
      </SectionCard>

      <SectionCard id="influencers" heading={influencers.heading}>
        <p>{influencers.intro}</p>
        <h3 className="pt-[10px] font-display text-[17px] font-normal text-ink">
          {influencers.rulesHeading}
        </h3>
        <NumberedList items={influencers.rules} />
        <div className="pt-[10px]">
          <LoginCta label={influencers.cta} />
        </div>
      </SectionCard>
    </div>
  );
}
