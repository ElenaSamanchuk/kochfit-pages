import { ProsePage } from "@/components/site/ProsePage";
import { legalDocs } from "@/content/migrated/legal";
import { pageMetadata } from "@/lib/seo";

const doc = legalDocs.dataConsent;

export const metadata = pageMetadata({
  title: doc.title,
  description: doc.description,
  path: "/data-consent",
});

export default function Page() {
  return <ProsePage title={doc.title} paragraphs={doc.paragraphs} />;
}
