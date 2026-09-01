import { LessonPage } from "@/components/site/LessonPage";
import { recipesLesson } from "@/content/lessons/recipes";
import { lessonMetadata } from "@/lib/seo";

export const metadata = lessonMetadata(recipesLesson);

/** /recipes — «Рецепты» (live kochfit.ru/recipes, Tilda page39292631) */
export default function RecipesPage() {
  return <LessonPage doc={recipesLesson} />;
}
