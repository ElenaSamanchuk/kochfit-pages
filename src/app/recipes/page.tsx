import { PageShell } from "@/components/site/PageShell";
import { RecipesCatalog } from "@/components/site/RecipesCatalog";
import { recipes } from "@/content/recipes-catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Рецепты",
  description:
    "Рецепты Kochfit с расчётом КБЖУ: завтраки, обеды, ужины, десерты, хлеб и закуски",
  path: "/recipes",
  ogTitle: "Рецепты Kochfit",
});

/** /recipes — «Рецепты» (было Tilda page39292631: табы категорий + карточки + попапы) */
export default function RecipesPage() {
  return (
    <PageShell>
      <header className="max-w-[720px]">
        <h1 className="font-display text-[28px] font-normal leading-[1.15] text-ink lg:text-[36px]">
          Рецепты
        </h1>
        <p className="mt-[12px] text-[15px] leading-[1.5] text-ink-secondary lg:text-[16px]">
          {recipes.length} рецепта с расчётом калорий и БЖУ на порцию. Выберите
          категорию и откройте карточку — внутри таблица ингредиентов и
          приготовление.
        </p>
      </header>
      <RecipesCatalog />
    </PageShell>
  );
}
