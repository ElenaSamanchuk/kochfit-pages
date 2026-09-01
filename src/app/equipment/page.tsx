import { EquipmentCatalog } from "@/components/equipment/EquipmentCatalog";
import { PageShell } from "@/components/site/PageShell";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Инвентарь",
  description:
    "Необходимое оборудование для тренировок на курсе Kochfit: рекомендации и ссылки на проверенные варианты",
  path: "/equipment",
});

/** Страница инвентаря — Figma 2351:10228 */
export default function EquipmentPage() {
  return (
    <PageShell compactBottom content1160>
      <EquipmentCatalog />
    </PageShell>
  );
}
