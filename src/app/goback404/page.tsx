import { StaticRedirect } from "@/components/site/StaticRedirect";
import { redirectMetadata } from "@/lib/seo";

export const metadata = redirectMetadata("/");

export default function Goback404Redirect() {
  return <StaticRedirect href="/" />;
}
