import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaymentPageView } from "@/components/site/PaymentPageView";
import { getPaymentOffer } from "@/content/payments";

const offer = getPaymentOffer("special_gift_pack1");

export const metadata: Metadata = {
  title: offer?.title ?? "Оплата",
  description: offer ? `Оплата: ${offer.productName} — ${offer.priceLabel}` : "Оплата курса Kochfit",
  robots: { index: false, follow: false },
};

export default function Page() {
  if (!offer) notFound();
  return <PaymentPageView offer={offer} />;
}
