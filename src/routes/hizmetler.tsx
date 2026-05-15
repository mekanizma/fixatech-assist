import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, MessageCircle } from "lucide-react";
import { services } from "@/lib/services";
import { ServiceIcon } from "@/components/ServiceIcon";
import { waLink } from "@/lib/site";

export const Route = createFileRoute("/hizmetler")({
  head: () => ({
    meta: [
      { title: "Hizmetlerimiz — Endüstriyel Mutfak, Elektrik, Su Tesisatı | FİXATECH" },
      { name: "description", content: "Endüstriyel mutfak ekipmanları, elektrik tesisatı, su tesisatı, tadilat ve 7/24 acil teknik servis hizmetlerimizi keşfedin." },
      { property: "og:title", content: "Hizmetlerimiz — FİXATECH" },
      { property: "og:description", content: "Otel ve restoranlar için tüm teknik servis hizmetleri." },
      { property: "og:url", content: "/hizmetler" },
    ],
    links: [{ rel: "canonical", href: "/hizmetler" }],
  }),
  component: Services,
});

function Services() {
  return (
    <>
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <div className="container mx-auto px-4 relative text-center max-w-3xl reveal">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">Hizmetlerimiz</div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 leading-tight">
            İşletmenize Özel <span className="text-gradient-primary">Profesyonel Çözümler</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Otel, restoran ve kurumsal işletmelerin tüm teknik servis ihtiyaçlarını tek elden, garantili ve hızlı şekilde karşılıyoruz.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24 space-y-10">
        {services.map((s, i) => (
          <article
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
                  <Clock className="w-3.5 h-3.5" /> Müdahale: {s.response}
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
                href={waLink(`Merhaba, ${s.title} hizmeti hakkında bilgi almak istiyorum.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-primary text-primary-foreground font-semibold btn-3d"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp ile Teklif Al
              </a>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
