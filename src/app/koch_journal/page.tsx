import { StaticRedirect } from "@/components/site/StaticRedirect";
import { redirectMetadata } from "@/lib/seo";

export const metadata = redirectMetadata("/journal");

export default function KochJournalRedirect() {
  return <StaticRedirect href="/journal" />;
}
