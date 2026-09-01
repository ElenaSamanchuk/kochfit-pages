import { StaticRedirect } from "@/components/site/StaticRedirect";
import { redirectMetadata } from "@/lib/seo";

export const metadata = redirectMetadata("/equipment");

/** Старый slug Тильды → актуальная страница инвентаря */
export default function InventNewRedirectPage() {
  return <StaticRedirect href="/equipment" />;
}
