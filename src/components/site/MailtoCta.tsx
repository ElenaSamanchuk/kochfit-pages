import { Typo } from "@/components/ui/TypoText";

/**
 * Кнопка «написать на почту» вместо формы обратной связи.
 * Форма всё равно открывала почтовый клиент (mailto), поэтому прямая ссылка —
 * тот же путь обращения, но без лишнего шага.
 */
export function MailtoCta({
  subject,
  label = "Написать нам",
  note,
}: {
  subject: string;
  label?: string;
  note?: string;
}) {
  const href = `mailto:info@kochfit.ru?subject=${encodeURIComponent(subject)}`;

  return (
    <Typo>
      <div className="mt-[24px]">
        <a
          href={href}
          className="btn-primary inline-flex min-h-[48px] items-center justify-center rounded-[12px] px-[28px] py-[14px] text-[14px] text-white transition hover:scale-[1.03] hover:brightness-105 active:scale-[0.98]"
        >
          {label}
        </a>
        <p className="mt-[12px] text-[13px] leading-[1.45] text-ink-secondary">
          {note ?? "Или напишите на"}{" "}
          <a className="text-accent underline" href={href}>
            info@kochfit.ru
          </a>
        </p>
      </div>
    </Typo>
  );
}
