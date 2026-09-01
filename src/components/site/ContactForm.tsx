"use client";

import { useState } from "react";
import { externalLinks } from "@/content/links";
import { AppLink } from "@/components/ui/AppLink";
import { Typo } from "@/components/ui/TypoText";
import { LEAD_EMAIL, submitLead, type LeadResult } from "@/lib/submit-lead";

type Props = {
  subject: string;
  fields?: Array<"name" | "email" | "phone" | "message">;
  submitLabel?: string;
  note?: string;
};

export function ContactForm({
  subject,
  fields = ["name", "email", "message"],
  submitLabel = "Отправить",
  note,
}: Props) {
  const [state, setState] = useState<"idle" | "sending" | LeadResult>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(
      Array.from(new FormData(e.currentTarget).entries()).map(([k, v]) => [k, String(v)]),
    );
    setState(await submitLead(subject, data));
  }

  const inputClass =
    "w-full rounded-[12px] border border-line bg-surface px-[16px] py-[12px] text-[14px] text-ink outline-none focus:border-accent";

  return (
    <Typo>
    <form onSubmit={onSubmit} className="mt-[24px] space-y-[12px]">
      {fields.includes("name") && (
        <input
          required
          name="Имя"
          placeholder="Имя"
          className={inputClass}
        />
      )}
      {fields.includes("email") && (
        <input
          required
          type="email"
          name="Email"
          placeholder="Email"
          className={inputClass}
        />
      )}
      {fields.includes("phone") && (
        <input
          name="Телефон"
          type="tel"
          placeholder="Телефон"
          className={inputClass}
        />
      )}
      {fields.includes("message") && (
        <textarea
          required
          name="Сообщение"
          placeholder="Сообщение"
          rows={5}
          className={inputClass}
        />
      )}
      <button
        type="submit"
        className="rounded-[12px] px-[28px] py-[14px] font-display text-[14px] font-bold text-white transition hover:scale-[1.03] hover:brightness-105 active:scale-[0.98]"
        style={{ backgroundImage: "var(--gradient-primary)" }}
      >
        {submitLabel}
      </button>
      {note && (
        <p className="text-[12px] leading-[1.4] text-ink-muted">
          {note}{" "}
          <AppLink href={externalLinks.legal.privacy} className="text-accent underline">
            политикой обработки персональных данных
          </AppLink>
        </p>
      )}
      {state === "sent" && (
        <p className="text-[14px] text-ink-secondary">
          Обращение отправлено, мы свяжемся с вами
        </p>
      )}
      {state === "error" && (
        <p className="text-[14px] text-coral">
          Не удалось отправить. Напишите нам на{" "}
          <a className="underline" href={`mailto:${LEAD_EMAIL}`}>
            {LEAD_EMAIL}
          </a>
        </p>
      )}
    </form>
    </Typo>
  );
}
