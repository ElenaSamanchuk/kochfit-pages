import { StaticRedirect } from "@/components/site/StaticRedirect";
import { redirectMetadata } from "@/lib/seo";

export const metadata = redirectMetadata("/taplink");

export default function TaplinkKochRedirect() {
  return <StaticRedirect href="/taplink" />;
}
