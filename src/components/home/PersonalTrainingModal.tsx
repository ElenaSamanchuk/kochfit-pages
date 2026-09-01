"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Typo } from "@/components/ui/TypoText";
import { externalLinks } from "@/content/links";
import { submitLead, type LeadResult } from "@/lib/submit-lead";

/** Поля попапа «Лист ожидания. Тренировки по Skype» со старого сайта (rec634548836). */
const fields = [
  { name: "ФИО", type: "text", autoComplete: "name", multiline: false },
  { name: "Номер телефона", type: "tel", autoComplete: "tel", multiline: false },
  { name: "Желаемые дни и время для тренировок", type: "text", multiline: true },
  { name: "Страна проживания", type: "text", autoComplete: "country-name", multiline: false },
] as const;

const SUBJECT = "Лист ожидания. Тренировки по Skype";

const inputClass =
  "w-full resize-none rounded-[12px] border border-line bg-surface px-[16px] py-[12px] text-[14px] text-ink outline-none transition focus:border-accent";

export function PersonalTrainingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [state, setState] = useState<"idle" | "sending" | LeadResult>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(
      Array.from(new FormData(e.currentTarget).entries()).map(([k, v]) => [k, String(v)]),
    );
    setState(await submitLead(SUBJECT, data));
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabel={SUBJECT}
      panelClassName="w-full max-w-[480px] rounded-[24px] bg-white p-[24px] shadow-[var(--shadow-card)] sm:p-[32px]"
    >
      <Typo>
        <h2 className="font-display text-[22px] font-normal leading-[1.25] text-ink">
          Лист ожидания. Тренировки по Skype
        </h2>

        {state === "sent" ? (
          <p className="mt-6 text-[15px] leading-[1.5] text-ink-secondary">
            Заявка отправлена, мы свяжемся с вами для согласования расписания
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-[12px]">
            {fields.map((f) =>
              f.multiline ? (
                <textarea
                  key={f.name}
                  required
                  name={f.name}
                  placeholder={f.name}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              ) : (
                <input
                  key={f.name}
                  required
                  name={f.name}
                  type={f.type}
                  autoComplete={"autoComplete" in f ? f.autoComplete : undefined}
                  placeholder={f.name}
                  className={inputClass}
                />
              ),
            )}

            <button
              type="submit"
              disabled={state === "sending"}
              className="btn-primary mt-2 flex min-h-[48px] w-full items-center justify-center rounded-[12px] px-[28px] py-[14px] text-[14px] text-white transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
            >
              {state === "sending" ? "Отправляем…" : "Записаться"}
            </button>

            {state === "error" && (
              <p className="text-[13px] leading-[1.4] text-coral">
                Не удалось отправить. Напишите нам на{" "}
                <a className="underline" href="mailto:info@kochfit.ru">
                  info@kochfit.ru
                </a>
              </p>
            )}

            <p className="text-[12px] leading-[1.4] text-ink-muted">
              Отправляя эту форму, вы соглашаетесь с{" "}
              {/* Документ — в соседней вкладке, иначе заполненная форма теряется */}
              <a
                href={externalLinks.legal.privacy}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap text-accent underline"
              >
                обработкой персональных данных
              </a>
            </p>
          </form>
        )}
      </Typo>
    </Modal>
  );
}
