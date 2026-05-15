import { ADDRESS_REGION, ADDRESS_STREET, COMPANY, EMAIL, PHONE_TEL } from "@/lib/site";

export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") || "https://fixatech.com.tr";

export const OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/88f3bdf4-db66-4eb7-bde3-122840072f36/id-preview-78933056--1e8218dc-4c87-4ecd-9914-4c3d3b2aa4e6.lovable.app-1778829939425.png";

export const SEO_KEYWORDS =
  "fixatech, girne teknik servis, kktc teknik servis, girne endüstriyel mutfak tamiri, otel teknik servis girne, restoran bakım onarım kktc, elektrik tesisat girne, su tesisatı tamir, acil teknik servis 7/24, profesyonel teknik çözüm, endüstriyel teknik servis";

export type PageSeoConfig = {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  ogTitle?: string;
};

export function absoluteUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return SITE_URL;
  return `${SITE_URL}${normalized}`;
}

export function buildPageHead(page: PageSeoConfig) {
  const canonical = absoluteUrl(page.path);
  const ogTitle = page.ogTitle ?? page.title;

  return {
    meta: [
      { title: page.title },
      { name: "description", content: page.description },
      { name: "keywords", content: page.keywords ?? SEO_KEYWORDS },
      { name: "author", content: COMPANY },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "googlebot", content: "index, follow" },
      { property: "og:title", content: ogTitle },
      { property: "og:description", content: page.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
      { property: "og:locale", content: "tr_TR" },
      { property: "og:site_name", content: COMPANY },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:alt", content: `${COMPANY} — Girne endüstriyel teknik servis` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: ogTitle },
      { name: "twitter:description", content: page.description },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: canonical },
      { rel: "alternate", href: canonical, hrefLang: "tr" },
      { rel: "alternate", href: canonical, hrefLang: "x-default" },
    ],
  };
}

export function buildNoIndexHead(title: string) {
  return {
    meta: [
      { title: `${title} | ${COMPANY}` },
      { name: "robots", content: "noindex, nofollow" },
    ],
  };
}

export const SEO_PAGES = {
  home: {
    path: "/",
    title: "FİXATECH | Girne Teknik Servis — Profesyonel ve Kalıcı Çözümler",
    description:
      "Teknik sorunlarınıza profesyonel ve kalıcı çözümler. KKTC Girne'de otel, restoran ve işletmeler için 7/24 endüstriyel mutfak, elektrik, su tesisatı ve tadilat.",
    keywords:
      "girne teknik servis, kktc teknik servis, profesyonel teknik çözüm, kalıcı onarım, endüstriyel mutfak tamiri girne",
  },
  about: {
    path: "/hakkimizda",
    title: "Hakkımızda | FİXATECH — Girne Endüstriyel Teknik Servis",
    description:
      "FİXATECH: KKTC Girne merkezli, otel ve restoranlara profesyonel teknik servis. Deneyimli ekip, şeffaf fiyat, garantili işçilik.",
  },
  services: {
    path: "/hizmetler",
    title: "Hizmetler | Endüstriyel Mutfak, Elektrik, Su Tesisatı — FİXATECH Girne",
    description:
      "Girne ve KKTC'de endüstriyel mutfak ekipmanı, elektrik, su tesisatı, tadilat ve 7/24 acil teknik servis hizmetleri.",
  },
  contact: {
    path: "/iletisim",
    title: "İletişim | FİXATECH Girne — 7/24 Teknik Servis",
    description:
      "FİXATECH ile iletişime geçin: telefon, WhatsApp, e-posta. Türk Mahallesi No: 10, KKTC/Girne. Hızlı teklif ve acil müdahale.",
  },
  techService: {
    path: "/teknik-servis",
    title: "Teknik Servis Talebi | Online Kayıt — FİXATECH",
    description:
      "Ürün bilgisi ve adresinizle online teknik servis talebi oluşturun. Girne ve KKTC genelinde hızlı randevu ve WhatsApp onayı.",
  },
} as const satisfies Record<string, PageSeoConfig>;

export function getLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#organization`,
    name: COMPANY,
    url: SITE_URL,
    logo: OG_IMAGE,
    image: OG_IMAGE,
    telephone: PHONE_TEL,
    email: EMAIL,
    description: SEO_PAGES.home.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS_STREET,
      addressLocality: "Girne",
      addressRegion: ADDRESS_REGION,
      addressCountry: "CY",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 35.34,
      longitude: 33.32,
    },
    areaServed: [
      { "@type": "City", name: "Girne" },
      { "@type": "AdministrativeArea", name: "KKTC" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE_TEL,
      contactType: "customer service",
      availableLanguage: ["Turkish", "English"],
      areaServed: "CY",
    },
    sameAs: [],
    priceRange: "$$",
  };
}

export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: COMPANY,
    description: SEO_PAGES.home.description,
    inLanguage: ["tr", "en"],
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** Varsayılan site meta (alt sayfalar üzerine yazar) */
export function buildDefaultSiteHead() {
  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SEO_PAGES.home.title },
      { name: "description", content: SEO_PAGES.home.description },
      { name: "keywords", content: SEO_KEYWORDS },
      { name: "author", content: COMPANY },
      { name: "theme-color", content: "#1e3a5f" },
      { property: "og:site_name", content: COMPANY },
      { property: "og:locale", content: "tr_TR" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  };
}
