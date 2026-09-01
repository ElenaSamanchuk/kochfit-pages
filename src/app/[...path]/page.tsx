import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaymentPageView } from "@/components/site/PaymentPageView";
import { TildaProsePage } from "@/components/site/TildaProsePage";
import {
  getAllPaymentPaths,
  getAllProsePaths,
  getDynamicPaymentOffer,
  getDynamicProsePage,
  pathKey,
} from "@/content/tilda-dynamic";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ path: string[] }> };

export function generateStaticParams() {
  const prose = getAllProsePaths().map((p) => ({ path: p.split("/") }));
  const payments = getAllPaymentPaths().map((p) => ({ path: p.split("/") }));
  const seen = new Set<string>();
  const out: { path: string[] }[] = [];
  for (const item of [...prose, ...payments]) {
    const k = pathKey(item.path);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params;
  const key = pathKey(path);
  const offer = getDynamicPaymentOffer(path);
  if (offer) {
    return pageMetadata({
      title: offer.title,
      description: `Оплата: ${offer.productName} — ${offer.priceLabel}`,
      path: `/${key}`,
      noIndex: true,
      follow: false,
    });
  }
  const prose = getDynamicProsePage(path);
  if (prose) {
    return pageMetadata({
      title: prose.title,
      description: prose.description,
      path: `/${key}`,
    });
  }
  return pageMetadata({
    title: "Kochfit",
    description: "Онлайн фитнес-школа женского здоровья Юлии Кочкиной",
    path: `/${key}`,
    absoluteTitle: true,
    noIndex: true,
    follow: true,
  });
}

/** Все URL с Тильды (один и несколько сегментов): prose, оплаты, fallback → v2 */
export default async function TildaCatchAllPage({ params }: Props) {
  const { path } = await params;

  const offer = getDynamicPaymentOffer(path);
  if (offer) {
    return <PaymentPageView offer={offer} />;
  }

  const prose = getDynamicProsePage(path);
  if (prose) {
    return <TildaProsePage doc={prose} />;
  }

  notFound();
}
