"use client";

import { Modal } from "@/components/ui/Modal";
import { Typo } from "@/components/ui/TypoText";

type Lesson = {
  title: string;
  bullets: string[];
};

const LESSONS: Lesson[] = [
  {
    title: "1 занятие:",
    bullets: [
      "Физиологические изменения, происходящие в организме женщины во время беременности, особенности топографии и строения беременной матки, поддерживающего связочного аппарата",
      "Сроки гестации (понятия пролонгированная и переношенная беременность)",
      "Изменения, происходящие в шейке матки на этапе ее «созревания» (3 степени зрелости)",
      "Прелиминарный период (тренировочные схватки). Как отличить от истинных родовых схваток",
      "Когда выезжать в роддом",
    ],
  },
  {
    title: "2 занятие:",
    bullets: [
      "Физиология родов (схема 3х периодов и фаз родов, описание происходящего в каждом из них объективно; возможные субъективные ощущения, сопровождающие каждый из периодов для перво- и повторно-рожающей женщины)",
      "Как облегчить проживание родового процесса и помочь Малышу появиться на свет максимально бережно и безопасно (перечисление условий, в которых течение родов идет физиологически, возможных положений тела и основных типов дыхания)",
      "Возможные медицинские вмешательства в родах (на каком этапе, основные показания и противопоказания к ним). Как избежать лишние вмешательства",
    ],
  },
  {
    title: "3 занятие:",
    bullets: [
      "Ранний послеродовый период (2ч после родов): что происходит на уровне тела Мамы и Малыша, эмоциональные переживания, формирование импринтинга, важность «золотого часа» для обоих участников Родов",
      "Возможные вмешательства в раннем послеродовом периоде и способы их избежать",
      "Основные принципы послеродового восстановления в позднем послеродовом периоде (до 8 нед после родов)",
    ],
  },
];

/** Попап программы акушерского блока (карточка Милы Войт на /for_pregnant) */
export function ObstetricProgramModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabel="Акушерский блок подготовки к родам"
      overlayClassName="bg-black/45"
      panelClassName="max-w-[640px] rounded-[20px] bg-white p-5 shadow-[var(--shadow-card)] sm:p-7"
      zIndexClass="z-[200]"
    >
      <Typo>
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="font-display text-[20px] font-normal leading-[1.25] text-ink sm:text-[24px]">
            Акушерский блок подготовки к родам
          </h2>
          <button
            type="button"
            aria-label="Закрыть"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-blue text-ink-secondary transition hover:bg-accent/20"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-5">
          {LESSONS.map((lesson) => (
            <section key={lesson.title}>
              <h3 className="text-[14px] font-semibold leading-[1.35] text-ink sm:text-[15px]">
                {lesson.title}
              </h3>
              <ul className="mt-2 flex flex-col gap-1.5 text-[13px] font-normal leading-[1.45] text-ink-secondary sm:text-[14px] sm:leading-[1.5]">
                {lesson.bullets.map((bullet) => (
                  <li key={bullet} className="ms-[18px] list-disc">
                    {bullet}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Typo>
    </Modal>
  );
}
