"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { assetPath } from "@/lib/asset-path";
import {
  recipeCategories,
  recipes,
  type Recipe,
  type RecipeCategory,
} from "@/content/recipes-catalog";

/** Короткая подпись категории для плашки на фото (полное название длинное) */
const shortCategory: Record<RecipeCategory, string> = {
  Завтрак: "Завтрак",
  Обед: "Обед",
  Ужин: "Ужин",
  Десерт: "Десерт",
  Хлеб: "Хлеб",
  "Закуски/паштеты/сладкие пасты": "Закуски",
};

function Macros({ recipe }: { recipe: Recipe }) {
  const items = [
    { label: "Ккал", value: recipe.kcal },
    { label: "Белки", value: recipe.protein },
    { label: "Жиры", value: recipe.fat },
    { label: "Углеводы", value: recipe.carbs },
  ];

  return (
    <div className="grid grid-cols-4 gap-[8px]">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[12px] bg-surface-blue px-[8px] py-[10px] text-center"
        >
          <div className="font-display text-[18px] leading-none text-ink">
            {item.value}
          </div>
          <div className="mt-[6px] text-[11px] leading-none text-ink-muted">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Каталог рецептов: табы категорий → сетка карточек → попап с таблицей
 * ингредиентов и шагами. Повторяет формат страницы на Тильде (T395 + T396 + T390).
 */
export function RecipesCatalog() {
  const [active, setActive] = useState<RecipeCategory>(recipeCategories[0]);
  const [opened, setOpened] = useState<Recipe | null>(null);

  const visible = useMemo(
    () => recipes.filter((r) => r.category === active),
    [active],
  );

  return (
    <>
      {/* Мобила — табы одной лентой со скроллом, sm+ — свободный wrap */}
      <div
        className="-mx-(--page-inset-x) mt-[28px] flex flex-nowrap gap-[6px] overflow-x-auto px-(--page-inset-x) [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:gap-[8px] sm:overflow-visible sm:px-0"
        role="tablist"
        aria-label="Категории рецептов"
      >
        {recipeCategories.map((category) => {
          const isActive = category === active;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(category)}
              className={`inline-flex min-h-[34px] items-center justify-center whitespace-nowrap rounded-full px-[12px] py-[7px] text-center text-[12px] font-semibold leading-none transition sm:min-h-[44px] sm:px-[16px] sm:py-[8px] sm:text-[13px] ${
                isActive
                  ? "bg-accent text-white"
                  : "bg-white text-ink-secondary shadow-[var(--shadow-card)] hover:text-accent"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="mt-[24px] grid grid-cols-2 gap-[12px] sm:grid-cols-3 sm:gap-[16px] lg:grid-cols-4">
        {visible.map((recipe) => (
          <button
            key={recipe.slug}
            type="button"
            onClick={() => setOpened(recipe)}
            className="group flex flex-col overflow-hidden rounded-[20px] bg-white text-left shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-hover)]"
          >
            <span className="relative block aspect-square w-full overflow-hidden">
              <img
                src={assetPath(recipe.photo)}
                alt={recipe.name}
                loading="lazy"
                className="size-full object-cover transition duration-300 group-hover:scale-[1.03]"
              />
              <span className="absolute left-[8px] top-[8px] inline-flex items-center rounded-full bg-white/90 px-[8px] py-[4px] text-[10px] font-semibold leading-none text-ink-secondary backdrop-blur-[2px]">
                {shortCategory[recipe.category]}
              </span>
              <span className="absolute right-[8px] top-[8px] inline-flex items-center rounded-full bg-accent/90 px-[8px] py-[4px] text-[10px] font-semibold leading-none text-white backdrop-blur-[2px]">
                {recipe.kcal} ккал
              </span>
            </span>
            <span className="flex flex-1 flex-col p-[12px] sm:p-[14px]">
              <span className="line-clamp-3 text-[13px] font-semibold leading-[1.3] text-ink transition group-hover:text-accent sm:text-[14px]">
                {recipe.name}
              </span>
              <span className="mt-auto pt-[10px] text-[11px] leading-none text-ink-muted">
                Б {recipe.protein} · Ж {recipe.fat} · У {recipe.carbs}
              </span>
            </span>
          </button>
        ))}
      </div>

      {opened && (
        <RecipeModal recipe={opened} onClose={() => setOpened(null)} />
      )}
    </>
  );
}

function RecipeModal({
  recipe,
  onClose,
}: {
  recipe: Recipe;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(true);
  const requestClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={requestClose}
      onClosed={onClose}
      ariaLabel={recipe.name}
      panelClassName="max-w-[720px] rounded-[24px] bg-white p-[20px] sm:p-[28px]"
    >
      <button
        type="button"
        aria-label="Закрыть рецепт"
        onClick={requestClose}
        className="absolute right-[14px] top-[14px] z-10 flex size-[34px] items-center justify-center rounded-full bg-white/90 text-ink shadow-[var(--shadow-card)] transition hover:text-accent sm:-top-[42px] sm:right-0"
      >
        <svg aria-hidden viewBox="0 0 14 14" className="size-[12px]">
          <path
            d="M1.5 1.5l11 11M12.5 1.5l-11 11"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <img
        src={assetPath(recipe.photo)}
        alt={recipe.name}
        className="h-[180px] w-full rounded-[16px] object-cover sm:h-[240px]"
      />

      <span className="mt-[16px] inline-flex items-center rounded-full bg-surface-blue px-[10px] py-[5px] text-[11px] font-semibold leading-none text-ink-secondary">
        {recipe.category}
      </span>

      <h2 className="mt-[10px] font-display text-[20px] font-normal leading-[1.25] text-ink sm:text-[24px]">
        {recipe.name}
      </h2>

      <div className="mt-[16px]">
        <Macros recipe={recipe} />
      </div>

      <h3 className="mt-[24px] text-[13px] font-semibold uppercase tracking-[0.04em] text-accent">
        Ингредиенты и расчёт
      </h3>
      {/* Таблица — скрин с Тильды; на мобиле листается вбок, чтобы цифры остались читаемыми */}
      <div className="mt-[10px] overflow-x-auto rounded-[16px] border border-line bg-white p-[10px]">
        <img
          src={assetPath(recipe.table)}
          alt={`Таблица ингредиентов: ${recipe.name}`}
          loading="lazy"
          className="h-auto w-full min-w-[560px] max-w-none"
        />
      </div>
      <p className="mt-[8px] text-[11px] text-ink-muted sm:hidden">
        Таблица листается вбок
      </p>

      {recipe.steps && recipe.steps.length > 0 && (
        <>
          <h3 className="mt-[24px] text-[13px] font-semibold uppercase tracking-[0.04em] text-accent">
            Приготовление
          </h3>
          <div className="mt-[10px] space-y-[10px] text-[14px] leading-[1.55] text-ink-secondary">
            {recipe.steps.map((step, i) => (
              <p key={i}>{step}</p>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
}
