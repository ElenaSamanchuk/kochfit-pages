"use client";

import Script from "next/script";
import { useEffect } from "react";

const METRIKA_ID = 52961668;
const FB_PIXEL_ID = "644985905999603";

/** Ленивое подключение CSS Collabza — не блокирует первый рендер */
function useCollabzaCss() {
  useEffect(() => {
    const href = "https://storage.yandexcloud.net/collabza/bonus.css";
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }, []);
}

/**
 * Метрики и виджеты со старого сайта (Тильда):
 * Яндекс.Метрика, Facebook Pixel, nn99, Collabza bonus.
 */
export function SiteScripts() {
  useCollabzaCss();
  return (
    <>
      <Script id="ym-init" strategy="afterInteractive">{`
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        window.mainMetrikaId='${METRIKA_ID}';
        ym(${METRIKA_ID}, "init", {
          clickmap:true,
          trackLinks:true,
          accurateTrackBounce:true,
          webvisor:true,
          ecommerce:"dataLayer"
        });
      `}</Script>

      <Script id="fb-pixel" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init','${FB_PIXEL_ID}');fbq('track','PageView');
      `}</Script>

      {/*
        Embed — как на старом сайте (атрибуты без data-color).
        Цвет launcher/header: CSS vars в nn99-brand-blue.css (не DOM-paint).
        Канон в админке NinetyNine / shumann: primaryColor.
      */}
      <Script
        src="https://nn99.ru/widget.js"
        strategy="lazyOnload"
        data-widget-id="cmmj78hfu009vckzxqcqxjh1q"
        data-api-key="cmmj78hfu009wckzx4btjp2un"
        data-api-url="https://nn99.ru/api"
        data-ws-url="https://nn99.ru"
      />

      <Script
        src="https://storage.yandexcloud.net/collabza/bonus.js"
        strategy="lazyOnload"
      />

      {/* Списание бонусов Collabza при оплате — со старого сайта Тильды */}
      <Script
        src="https://storage.yandexcloud.net/tilda-tools/7c8df0f0-655b-49f6-acad-c871db71fde2.js?v=1"
        strategy="lazyOnload"
      />

      <noscript>
        <div>
          <img
            src="https://mc.yandex.ru/watch/52961668"
            style={{ position: "absolute", left: -9999 }}
            alt=""
          />
        </div>
        <img
          height={1}
          width={1}
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=644985905999603&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
    </>
  );
}
