"use client";

import { useState } from "react";
import { checkout } from "@/content/courses";
import { personalWorkContent } from "@/content/personal-work";
import { PersonalTrainingModal } from "@/components/home/PersonalTrainingModal";
import { assetPath } from "@/lib/asset-path";
import { CatalogPriceCta } from "@/components/home/CoursesCatalog";

/** Прямая оплата тестовой недели — kochfit.ru/test7 → tariff_LwpWAM */
const TRIAL_CHECKOUT = checkout("LwpWAM");

/** Что даёт тестовая неделя — блок rec1160338831 старого сайта */
const trialItems = [
  "попробовать формат тренировок",
  "познакомиться с тренером",
  "узнать функционал личного кабинета",
  "получить результат",
];

const img = (name: string) => assetPath(`/images/home/${name}`);

const cardClass = "course-card relative flex w-full flex-col items-start gap-5 overflow-hidden";

/** Галочка как в карточке флагманского курса (imgGroup1.svg) */
function CatalogCheck() {
  return (
    <span className="relative block size-[13px] shrink-0 overflow-hidden">
      <img
        loading="lazy"
        alt=""
        width={13}
        height={13}
        className="absolute inset-[13.33%_0] block h-[73.34%] w-full max-w-none"
        src={img("imgGroup1.svg")}
      />
    </span>
  );
}

const titleClass = "text-body-lg font-semibold text-ink";

const listClass = "flex w-full flex-col gap-2";

/**
 * «Тестовая неделя» и «Персональные тренировки» — нижний ряд каталога курсов,
 * как на текущем kochfit.ru (rec1160338831). Тестовая неделя ведёт сразу
 * на оплату, персональные тренировки открывают попап-заявку (rec634548836).
 */
export function TrialAndPersonal() {
  const [formOpen, setFormOpen] = useState(false);
  const { training } = personalWorkContent;

  return (
    <div className="grid w-full grid-cols-1 gap-[18px] xl:grid-cols-2">
      {/* Тестовая неделя */}
      <article className={cardClass}>
        <div className="w-full">
          <span className="course-catalog-tag bg-surface text-ink-secondary">
            Демоверсия курса
          </span>
          <div className="mt-2 flex flex-col gap-1 xl:mt-4">
            <p className={titleClass}>Тестовая неделя</p>
            <ul className={listClass}>
              {trialItems.map((item) => (
                <li key={item} className="flex w-full items-center gap-2">
                  <CatalogCheck />
                  <span className="text-small font-normal text-ink-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <CatalogPriceCta
          catalogLabel="990 ₽ / неделя"
          externalHref={TRIAL_CHECKOUT}
          label="Перейти к покупке"
        />
      </article>

      {/* Персональные тренировки */}
      <article className={cardClass}>
        <div className="w-full">
          <span className="course-catalog-tag bg-surface text-ink-secondary">
            {training.subtitle}
          </span>
          <div className="mt-2 flex flex-col gap-1 xl:mt-4">
            <p className={titleClass}>{training.title}</p>
            <ul className={listClass}>
              {training.features.map((item) => (
                <li key={item} className="flex w-full items-center gap-2">
                  <CatalogCheck />
                  <span className="text-small font-normal text-ink-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <CatalogPriceCta
          catalogLabel="от 6 000 ₽"
          onClick={() => setFormOpen(true)}
          label="Оставить заявку"
        />
      </article>

      <PersonalTrainingModal open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
