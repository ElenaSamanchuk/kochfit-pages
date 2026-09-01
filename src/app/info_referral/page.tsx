import { ReferralProgram } from "@/components/info-referral/ReferralProgram";
import { PageShell } from "@/components/site/PageShell";
import { referralContent } from "@/content/migrated/referral";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: referralContent.title,
  description: referralContent.description,
  path: "/info_referral",
});

export default function ReferralPage() {
  return (
    <PageShell>
      <ReferralProgram />
    </PageShell>
  );
}
