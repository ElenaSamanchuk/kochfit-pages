"use client";

import { useEffect } from "react";
import { basePath } from "@/lib/asset-path";
import { newTabProps } from "@/lib/link-target";

/** Клиентский редирект для static export (next.config redirects недоступны). */
export function StaticRedirect({ href }: { href: string }) {
  const target = href.startsWith("/") ? `${basePath}${href}` : href;

  useEffect(() => {
    window.location.replace(target);
  }, [target]);

  return (
    <main className="mx-auto max-w-[1160px] px-5 py-16 text-center">
      <p className="text-ink-secondary">Перенаправление…</p>
      <a href={target} className="mt-4 inline-block text-accent underline" {...newTabProps(href)}>
        Перейти
      </a>
    </main>
  );
}
