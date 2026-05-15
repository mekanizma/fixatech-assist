import { getLocalBusinessJsonLd, getWebSiteJsonLd } from "@/lib/seo";

export function SeoJsonLd() {
  const graphs = [getLocalBusinessJsonLd(), getWebSiteJsonLd()];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graphs) }}
    />
  );
}
