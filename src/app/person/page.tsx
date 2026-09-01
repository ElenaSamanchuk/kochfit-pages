import Link from "next/link";
import { JsonLd } from "@/components/site/JsonLd";
import { PageShell } from "@/components/site/PageShell";
import { PersonGallery } from "@/components/site/PersonGallery";
import { personContent } from "@/content/public-pages";
import { routes } from "@/content/routes";
import { assetPath } from "@/lib/asset-path";
import { pageMetadata, personJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: personContent.title,
  description: personContent.description,
  path: "/person",
  image: personContent.portrait,
});

export default function PersonPage() {
  const c = personContent;
  return (
    <PageShell>
      <JsonLd
        data={personJsonLd({
          name: c.name,
          description: c.description,
          jobTitle: c.role,
          image: c.portrait,
        })}
      />
      <section className="grid overflow-hidden rounded-[24px] bg-white text-white lg:grid-cols-[1.4fr_1fr]">
        <div
          className="px-[28px] py-[40px] lg:px-[48px] lg:py-[56px]"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          <p className="text-[13px] font-semibold uppercase tracking-[0.04em] opacity-80">
            Kochfit
          </p>
          <h1 className="mt-[12px] font-display text-[32px] font-normal leading-[1.15] lg:text-[44px]">
            {c.headline}
          </h1>
          <p className="mt-[16px] font-display text-[22px] font-bold">{c.name}</p>
          <p className="mt-[8px] max-w-[560px] text-[16px] leading-[1.5] text-white/90">
            {c.role}
          </p>
        </div>
        <div className="relative z-[1] min-w-0 overflow-hidden bg-white max-h-[420px] lg:max-h-none lg:self-stretch">
          <img
            src={assetPath(c.portrait)}
            alt="Кочкина Юлия, основатель проекта Kochfit"
            className="block size-full min-h-full object-cover object-top"
          />
        </div>
      </section>

      <section className="mt-[32px] grid gap-[24px] lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[24px] bg-white p-[28px] shadow-[var(--shadow-card)] lg:p-[36px]">
          <h2 className="font-display text-[22px] font-normal text-ink">О проекте и подходе</h2>
          <div className="mt-6 space-y-[14px] text-[15px] leading-[1.5] sm:leading-[1.65] text-ink-secondary">
            {c.bio.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <Link
            href={routes.result}
            className="mt-[24px] inline-flex rounded-[12px] px-[24px] py-[12px] font-display text-[13px] font-bold text-white"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            Результаты участниц
          </Link>
        </div>
        <div className="rounded-[24px] bg-surface-blue p-[28px] lg:p-[36px]">
          <h2 className="font-display text-[18px] font-normal text-ink">{c.awardsTitle}</h2>
          <ul className="mt-6 space-y-[12px] text-[14px] leading-[1.5] text-ink-secondary">
            {c.awards.map((a) => (
              <li key={a} className="flex gap-[10px]">
                <span className="mt-[7px] size-[6px] shrink-0 rounded-full bg-accent" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-[48px]">
        <h2 className="font-display text-[26px] font-normal text-ink">
          {c.certificatesTitle}
        </h2>
        <p className="mt-3 max-w-[640px] text-[15px] leading-[1.5] text-ink-secondary">
          {c.certificatesIntro}
        </p>
        <PersonGallery images={c.gallery} />
      </section>
    </PageShell>
  );
}
