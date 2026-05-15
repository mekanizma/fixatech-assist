import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SEO_PAGES, SITE_URL } from "@/lib/seo";

const PUBLIC_PATHS = [
  SEO_PAGES.home,
  SEO_PAGES.about,
  SEO_PAGES.services,
  SEO_PAGES.contact,
  SEO_PAGES.techService,
] as const;

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const lastmod = new Date().toISOString().slice(0, 10);
        const urls = PUBLIC_PATHS.map(
          (page) =>
            `  <url>
    <loc>${SITE_URL}${page.path === "/" ? "" : page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.path === "/" ? "1.0" : "0.8"}</priority>
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
