import { StaticRedirect } from "@/components/site/StaticRedirect";
import { redirectMetadata } from "@/lib/seo";

export const metadata = redirectMetadata("/equipment");

/** Архивный slug Тильды (старая страница инвентаря) → актуальный каталог */
export default function EquipmentOldRedirectPage() {
  return <StaticRedirect href="/equipment" />;
}
