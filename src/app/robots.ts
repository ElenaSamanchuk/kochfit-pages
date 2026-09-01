import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/yes",
        "/no",
        "/unsubscribe",
        "/delete",
        "/del",
        "/testpay",
        "/basket/pay",
        "/standartsub",
        "/special_gift_",
        "/special_recovery",
      ],
    },
    sitemap: "https://kochfit.ru/sitemap.xml",
    host: "https://kochfit.ru",
  };
}
