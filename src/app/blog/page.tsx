import { StaticRedirect } from "@/components/site/StaticRedirect";
import { routes } from "@/content/routes";
import { redirectMetadata } from "@/lib/seo";

export const metadata = redirectMetadata(routes.journal);

/** Старый URL /blog → новый журнал */
export default function BlogIndexPage() {
  return <StaticRedirect href={routes.journal} />;
}
