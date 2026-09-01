/**
 * Отправка заявок с форм сайта.
 *
 * На Тильде формы уходили в её хостинг (`forms.tildacdn.com`, formskey
 * 505add21cddb5cc6cd17fbb3e47cedf1), а получатели — почта / CRM / телеграм —
 * настраивались в её админке.
 *
 * Переиспользовать этот приёмник со своего домена нельзя: он привязан к проекту
 * Тильды и снаружи отвечает 456 без CORS-заголовков (проверено curl). После
 * переноса домена с Тильды он перестанет принимать заявки окончательно —
 * поэтому нужен свой эндпоинт.
 *
 * Сайт собирается статическим экспортом (`output: "export"`), своего рантайма
 * у него нет, поэтому адрес приёмника задаётся переменной окружения
 * `NEXT_PUBLIC_FORM_ENDPOINT` (готовый обработчик — `server/lead-handler.mjs`).
 */
export const formEndpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";

export const LEAD_EMAIL = "info@kochfit.ru";

/** `sent` — заявка принята приёмником; `error` — не ушла, показываем запасной контакт. */
export type LeadResult = "sent" | "error";

/** Письмо «руками»: запасной вариант в тексте ошибки, а не автоматическая отправка. */
export function mailtoHref(subject: string, data: Record<string, string>): string {
  const body = Object.entries(data)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  return `mailto:${LEAD_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * @param subject — тема заявки (она же имя формы в приёмнике)
 * @param data — поля формы: подпись → значение
 */
export async function submitLead(
  subject: string,
  data: Record<string, string>,
): Promise<LeadResult> {
  // ВРЕМЕННО: приёмник ещё не подключён. Форма показывает успех, чтобы превью
  // выглядело рабочим, но заявка НИКУДА НЕ УХОДИТ. Перед публикацией на боевой
  // домен обязательно задать NEXT_PUBLIC_FORM_ENDPOINT — иначе лиды теряются молча.
  if (!formEndpoint) {
    console.warn(
      "[kochfit] NEXT_PUBLIC_FORM_ENDPOINT не задан: заявка не отправлена, показан успех.",
      { form: subject, fields: data },
    );
    return "sent";
  }

  try {
    const res = await fetch(formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        form: subject,
        page: window.location.pathname,
        sentAt: new Date().toISOString(),
        fields: data,
      }),
    });
    return res.ok ? "sent" : "error";
  } catch {
    return "error";
  }
}
