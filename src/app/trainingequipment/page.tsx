import { StaticRedirect } from "@/components/site/StaticRedirect";
import { redirectMetadata } from "@/lib/seo";

export const metadata = redirectMetadata("/equipment");

export default function TrainingEquipmentRedirect() {
  return <StaticRedirect href="/equipment" />;
}
