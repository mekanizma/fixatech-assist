import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, MessageCircle } from "lucide-react";
import { useLocalizedServices } from "@/lib/services";
import { ServiceIcon } from "@/components/ServiceIcon";
import { waLink } from "@/lib/site";
import { useT } from "@/lib/i18n";

import { buildPageHead, SEO_PAGES } from "@/lib/seo";

export const Route = createFileRoute("/hizmetler")({
  head: () => buildPageHead(SEO_PAGES.services),
  component: Services,
});

function Services() {
  const t = useT();
  const services = useLocalizedServices();
  return (
    <>
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <div className="container mx-auto px-4 relative text-center max-w-3xl reveal">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">{t.services.label}</div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {t.services.title1} <span className="text-gradient-primary">{t.services.titleHi}</span>
          </h1>
          <p className="text-lg text-muted-foreground">{t.services.sub}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24 space-y-10">
        {services.map((s, i) => (
          <article
            id={s.slug}
            key={s.slug}
            className={`group grid lg:grid-cols-2 gap-8 items-center bg-gradient-card rounded-3xl overflow-hidden border border-border card-3d reveal ${
              i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden relative">
              <img src={s.image} alt={s.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-5 left-5 bg-gradient-primary p-4 rounded-2xl shadow-glow animate-float">
                <ServiceIcon name={s.icon} className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <div className="p-8 lg:p-12 space-y-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5" /> {t.common.response}: {s.response}
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold">{s.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{s.description}</p>
              <ul className="grid sm:grid-cols-2 gap-2">
                {s.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={waLink(t.services.askMsg(s.title))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-primary text-primary-foreground font-semibold btn-3d"
              >
                <MessageCircle className="w-4 h-4" /> {t.services.ctaWa}
              </a>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
