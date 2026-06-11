import { ADDRESS_REGION, ADDRESS_STREET, COMPANY, EMAIL, PHONE_TEL } from "@/lib/site";

export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") || "https://pragmatechnical.com.tr";

export const OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/88f3bdf4-db66-4eb7-bde3-122840072f36/id-preview-78933056--1e8218dc-4c87-4ecd-9914-4c3d3b2aa4e6.lovable.app-1778829939425.png";

/** KKTC / Girne odaklı anahtar kelime kümesi */
export const SEO_KEYWORDS = [
  "kktc teknik servis",
  "girne teknik servis",
  "kktc tamir bakım onarım",
  "girne tamirat",
  "kktc endüstriyel mutfak tamiri",
  "girne endüstriyel mutfak servisi",
  "kktc otel teknik servis",
  "girne restoran bakım onarım",
  "kktc elektrik tesisatı",
  "girne su tesisatı tamir",
  "kktc acil teknik servis 7/24",
  "kuzey kıbrıs teknik servis",
  "lefkoşa teknik servis",
  "gazimağusa tamirat",
  "pragmatechnical",
  "profesyonel teknik çözüm",
  "periyodik bakım sözleşmesi kktc",
  "soğutma sistemi onarım girne",
  "konveksiyonlu fırın servisi kktc",
  "kktc klima servisi",
  "girne klima bakım onarım",
  "kktc beyaz eşya tamiri",
  "split klima gaz dolumu girne",
].join(", ");

/** Hizmet verilen KKTC bölgeleri — yerel SEO */
export const KKTC_SERVICE_AREAS = [
  "Girne",
  "Lefkoşa",
  "Gazimağusa",
  "Güzelyurt",
  "İskele",
  "Alsancak",
  "Lapta",
  "Çatalköy",
  "Esentepe",
  "Bellapais",
] as const;

export type SeoFaq = { question: string; answer: string };

export const SEO_FAQS: SeoFaq[] = [
  {
    question: "KKTC'nin hangi bölgelerine teknik servis veriyorsunuz?",
    answer:
      "Girne merkezli olarak Girne, Lefkoşa, Gazimağusa, Güzelyurt, İskele ve çevre mahallelere yerinde tamir, bakım ve onarım hizmeti sunuyoruz.",
  },
  {
    question: "Otel ve restoranlar için periyodik bakım yapıyor musunuz?",
    answer:
      "Evet. Endüstriyel mutfak, elektrik ve su tesisatı için aylık veya yıllık bakım sözleşmeleri ile arıza riskini azaltıyoruz.",
  },
  {
    question: "Acil arızada ne kadar sürede müdahale ediyorsunuz?",
    answer:
      "Kritik arızalarda Girne ve yakın bölgelerde ortalama 30–60 dakika içinde saha ekibimizi yönlendiriyoruz. 7/24 hatlarımız açıktır.",
  },
  {
    question: "Endüstriyel mutfak ve soğutma sistemi tamiri yapıyor musunuz?",
    answer:
      "Konveksiyonlu fırın, bulaşık makinesi, soğuk oda ve tüm mutfak ekipmanlarında kurulum, tamir ve bakım hizmeti veriyoruz.",
  },
  {
    question: "Tamir ve onarım işlerinde garanti veriyor musunuz?",
    answer:
      "Tüm işlerimizde şeffaf fiyatlandırma ve işçilik garantisi sunuyoruz. Yapılan işlemler dijital servis raporunda kayıt altına alınır.",
  },
];

export const SERVICE_CATALOG = [
  {
    slug: "klima-beyaz-esya",
    name: "Klima ve Beyaz Eşya Bakım & Onarım",
    description:
      "KKTC'de split klima, VRF, buzdolabı, çamaşır makinesi ve ankastre cihaz tamir; gaz dolumu ve periyodik bakım.",
  },
  {
    slug: "endustriyel-mutfak",
    name: "Endüstriyel Mutfak Tamir ve Bakım",
    description:
      "KKTC'de konveksiyonlu fırın, bulaşık makinesi, soğutma ve gazlı ocak onarımı; otel ve restoranlara yerinde servis.",
  },
  {
    slug: "elektrik-tesisati",
    name: "Elektrik Tesisatı Tamir ve Bakım",
    description: "Girne ve KKTC genelinde pano, aydınlatma, topraklama ve acil elektrik arıza müdahalesi.",
  },
  {
    slug: "su-tesisati",
    name: "Su Tesisatı Onarım",
    description: "Su kaçağı tespiti, tıkanıklık açma, pompa ve hidrofor bakımı; tahribatsız müdahale.",
  },
  {
    slug: "tadilat-tamirat",
    name: "Tadilat ve Genel Tamirat",
    description: "Otel ve restoran renovasyonu, mutfak yenileme, alçıpan, boya ve fayans işleri.",
  },
  {
    slug: "acil-servis",
    name: "Acil Teknik Servis 7/24",
    description: "KKTC'de kritik arızalarda hızlı saha müdahalesi ve mobil servis desteği.",
  },
] as const;

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

const GEO_META = [
  { name: "geo.region", content: "CY" },
  { name: "geo.placename", content: "Girne, KKTC" },
  { name: "geo.position", content: "35.34;33.32" },
  { name: "ICBM", content: "35.34, 33.32" },
] as const;

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
      ...GEO_META,
      { property: "og:title", content: ogTitle },
      { property: "og:description", content: page.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
      { property: "og:locale", content: "tr_TR" },
      { property: "og:locale:alternate", content: "en_US" },
      { property: "og:site_name", content: COMPANY },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:alt", content: `${COMPANY} — KKTC Girne teknik servis, tamir ve bakım` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: ogTitle },
      { name: "twitter:description", content: page.description },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: canonical },
      { rel: "alternate", href: canonical, hrefLang: "tr" },
      { rel: "alternate", href: canonical, hrefLang: "en" },
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
    title: "KKTC Girne Teknik Servis | Tamir, Bakım, Onarım — PRAGMATECHNICAL",
    description:
      "KKTC ve Girne'de otel, restoran ve işletmelere 7/24 teknik servis. Endüstriyel mutfak tamiri, elektrik ve su tesisatı onarımı, periyodik bakım ve acil müdahale — şeffaf fiyat, garantili işçilik.",
    keywords:
      "kktc teknik servis, girne tamir bakım onarım, kktc endüstriyel mutfak tamiri, girne acil teknik servis, otel restoran bakım kktc",
  },
  about: {
    path: "/hakkimizda",
    title: "Hakkımızda | KKTC Girne Teknik Servis — PRAGMATECHNICAL",
    description:
      "PRAGMATECHNICAL: KKTC Girne merkezli teknik servis firması. Otel, restoran ve kurumsal işletmelere tamir, bakım, onarım ve periyodik bakım sözleşmeleri. Deneyimli saha ekibi, garantili işçilik.",
    keywords:
      "kktc teknik servis firması, girne bakım onarım şirketi, endüstriyel teknik servis kktc, pragmatechnical hakkında",
  },
  services: {
    path: "/hizmetler",
    title: "Hizmetler | KKTC Tamir, Bakım ve Onarım — PRAGMATECHNICAL Girne",
    description:
      "Girne ve KKTC'de klima ve beyaz eşya bakım onarım, endüstriyel mutfak, elektrik ve su tesisatı, tadilat ile 7/24 acil teknik servis. Otel ve restoranlara özel çözümler.",
    keywords:
      "kktc endüstriyel mutfak servisi, girne elektrik tamiri, kktc su tesisatı onarım, otel bakım hizmeti girne, restoran tamirat kktc",
  },
  contact: {
    path: "/iletisim",
    title: "İletişim | KKTC 7/24 Teknik Servis — PRAGMATECHNICAL Girne",
    description:
      "KKTC Girne teknik servis için hemen arayın veya WhatsApp ile yazın. Türk Mahallesi No: 10, Girne. Acil tamir, bakım teklifi ve randevu — hızlı yanıt.",
    keywords:
      "girne teknik servis telefon, kktc acil tamirat iletişim, pragmatechnical whatsapp, girne teknik servis adres",
  },
  techService: {
    path: "/teknik-servis",
    title: "Online Teknik Servis Talebi | KKTC Tamir Kaydı — PRAGMATECHNICAL",
    description:
      "KKTC'de online teknik servis talebi oluşturun. Ürün bilgisi, adres ve randevu ile hızlı kayıt; Girne ve çevresinde yerinde tamir, bakım ve onarım.",
    keywords:
      "kktc online teknik servis, girne arıza kaydı, ürün tamir talebi kktc, teknik servis formu girne",
  },
} as const satisfies Record<string, PageSeoConfig>;

export function getLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: COMPANY,
    alternateName: "PRAGMATECHNICAL Teknik Servis",
    url: SITE_URL,
    logo: OG_IMAGE,
    image: OG_IMAGE,
    telephone: PHONE_TEL,
    email: EMAIL,
    description: SEO_PAGES.home.description,
    slogan: "KKTC'de profesyonel tamir, bakım ve onarım",
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS_STREET,
      addressLocality: "Girne",
      addressRegion: "KKTC",
      addressCountry: "CY",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 35.34,
      longitude: 33.32,
    },
    areaServed: KKTC_SERVICE_AREAS.map((name) => ({
      "@type": "City",
      name,
      containedInPlace: { "@type": "AdministrativeArea", name: "KKTC" },
    })),
    serviceType: [
      "Klima ve beyaz eşya bakım onarım",
      "Endüstriyel mutfak tamiri",
      "Elektrik tesisatı onarımı",
      "Su tesisatı tamiratı",
      "Periyodik bakım",
      "Acil teknik servis",
      "Tadilat ve renovasyon",
    ],
    knowsAbout: [
      "KKTC teknik servis",
      "Girne tamir bakım onarım",
      "Otel teknik bakım",
      "Restoran ekipman servisi",
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
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "KKTC Teknik Servis Hizmetleri",
      itemListElement: SERVICE_CATALOG.map((s, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.description,
          areaServed: { "@type": "AdministrativeArea", name: "KKTC" },
          provider: { "@id": `${SITE_URL}/#organization` },
        },
      })),
    },
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
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/takip/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: SEO_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function getServicesItemListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/#services`,
    name: "KKTC Teknik Servis Hizmetleri",
    itemListElement: SERVICE_CATALOG.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      description: s.description,
      url: `${SITE_URL}/hizmetler#${s.slug}`,
    })),
  };
}

/** Tüm yapılandırılmış veri grafiği */
export function getSeoJsonLdGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      getLocalBusinessJsonLd(),
      getWebSiteJsonLd(),
      getFaqJsonLd(),
      getServicesItemListJsonLd(),
    ],
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
      ...GEO_META,
      { property: "og:site_name", content: COMPANY },
      { property: "og:locale", content: "tr_TR" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  };
}
