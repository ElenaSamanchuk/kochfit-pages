import { StaticRedirect } from "@/components/site/StaticRedirect";
import { externalLinks } from "@/content/links";
import { redirectMetadata } from "@/lib/seo";

export const metadata = redirectMetadata(externalLinks.login);

/** Тильда /1 — «Тренировки выходного дня»: закрытый контент курса, живёт в ЛК v2 */
export default function WeekendTrainingsRedirect() {
  return <StaticRedirect href={externalLinks.login} />;
}
