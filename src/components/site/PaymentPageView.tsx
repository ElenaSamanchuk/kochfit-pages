import { PageShell } from "@/components/site/PageShell";
import { PaymentCard } from "@/components/site/PaymentCard";
import type { PaymentOffer } from "@/content/payments";

export function PaymentPageView({ offer }: { offer: PaymentOffer }) {
  return (
    <PageShell narrow>
      <PaymentCard offer={offer} titleAs="h1" />
    </PageShell>
  );
}
