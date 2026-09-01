import { StaticRedirect } from "@/components/site/StaticRedirect";
import { redirectMetadata } from "@/lib/seo";

export const metadata = redirectMetadata("/result");

export default function TaplinkOtzRedirect() {
  return <StaticRedirect href="/result" />;
}
