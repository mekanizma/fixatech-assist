import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SEO_PAGES, SITE_URL } from "@/lib/seo";

const PUBLIC_PAGES = [
  { ...SEO_PAGES.home, priority: "1.0", changefreq: "weekly" },
  { ...SEO_PAGES.services, priority: "0.9", changefreq: "weekly" },
  { ...SEO_PAGES.techService, priority: "0.9", changefreq: "weekly" },
  { ...SEO_PAGES.contact, priority: "0.8", changefreq: "monthly" },
  { ...SEO_PAGES.about, priority: "0.7", changefreq: "monthly" },
] as const;

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const lastmod = new Date().toISOString().slice(0, 10);
        const urls = PUBLIC_PAGES.map(
          (page) =>
            `  <url>
    <loc>${SITE_URL}${page.path === "/" ? "" : page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
        ).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
