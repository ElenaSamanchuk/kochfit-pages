import { MailtoCta } from "@/components/site/MailtoCta";
import { PageShell } from "@/components/site/PageShell";
import { workContent } from "@/content/public-pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: workContent.title,
  description: workContent.description,
  path: "/work",
});

export default function WorkPage() {
  const c = workContent;
  return (
    <PageShell>
      <section
        className="rounded-[24px] px-[28px] py-[40px] text-white lg:px-[48px]"
        style={{ backgroundImage: "var(--gradient-primary)" }}
      >
        <h1 className="font-display text-[32px] font-normal leading-[1.15] lg:text-[40px]">
          {c.title}
        </h1>
        <p className="mt-[14px] max-w-[640px] text-[16px] leading-[1.5] text-white/90">
          {c.intro}
        </p>
      </section>

      <section className="mt-[24px] grid gap-[16px] lg:grid-cols-2">
        <div className="rounded-[24px] bg-white p-[28px] shadow-[var(--shadow-card)]">
          <h2 className="font-display text-[20px] font-normal text-ink">
            Кто нам нужен?
          </h2>
          <ul className="mt-[16px] space-y-[14px]">
            {c.requirements.map((r) => (
              <li key={r.label}>
                <p className="font-display text-[14px] font-bold text-accent">
                  {r.label}
                </p>
                <p className="mt-[4px] text-[14px] leading-[1.5] text-ink-secondary">
                  {r.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[24px] bg-white p-[28px] shadow-[var(--shadow-card)]">
          <h2 className="font-display text-[20px] font-normal text-ink">
            Присоединяйтесь к команде
          </h2>
          <p className="mt-[10px] text-[14px] leading-[1.5] text-ink-secondary">
            Напишите нам, расскажите о себе и приложите резюме в письме
          </p>
          <MailtoCta
            subject="Вакансия куратора KOCHFIT"
            label="Отправить заявку"
          />
        </div>
      </section>
    </PageShell>
  );
}
