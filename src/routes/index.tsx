import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Phone, MessageCircle, Clock, Zap, Users, Building2, ShieldCheck, Star, CheckCircle2, Siren } from "lucide-react";
import heroImg from "@/assets/hero-technician.jpg";
import { useLocalizedServices } from "@/lib/services";
import { ServiceIcon } from "@/components/ServiceIcon";
import { PHONE_TEL, waLink } from "@/lib/site";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FİXATECH — Endüstriyel Teknik Serviste Güvenilir Çözüm Ortağınız" },
      { name: "description", content: "Otel, restoran ve işletmeler için 7/24 endüstriyel mutfak tamiri, elektrik, su tesisatı ve tadilat hizmetleri. Hızlı müdahale, uzman ekip." },
      { property: "og:title", content: "FİXATECH — Endüstriyel Teknik Servis" },
      { property: "og:description", content: "7/24 endüstriyel teknik servis. Otel & restoran bakım onarım." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const trustIcons = [Clock, Zap, Users, Building2];

const refLogos = ["Grand Hotel", "Marina Bistro", "Bosphorus Suites", "La Cucina", "Sky Lounge", "Palmiye Otel", "Loft Restaurant", "Park Cafe"];

function Home() {
  const t = useT();
  const services = useLocalizedServices();
  const trustBadges = t.home.trust.map((b: any, i: number) => ({ icon: trustIcons[i], label: b.l, desc: b.d }));
  const stats = t.home.stats;
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden -mt-20 pt-20">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Endüstriyel teknik servis ustası" className="w-full h-full object-cover" width={1920} height={1280} />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
          <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
        </div>

        {/* floating decorative */}
        <div className="absolute top-32 right-20 w-72 h-72 bg-primary-glow/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

        <div className="relative container mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium animate-glow">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              {t.home.activeNow ?? t.common.activeNow}
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05]">
              {t.home.title1}{" "}
              <span className="text-gradient-primary">{t.home.titleHighlight}</span>{" "}
              {t.home.title2}
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              {t.home.sub} <strong className="text-foreground">{t.home.subStrong}</strong> {t.home.subTail}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/hizmetler"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-gradient-primary text-primary-foreground font-semibold btn-3d"
              >
                {t.home.ctaServices}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </Link>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-gradient-accent text-accent-foreground font-semibold btn-3d-accent"
              >
                <MessageCircle className="w-5 h-5" />
                {t.home.ctaContact}
              </a>
            </div>

            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center gap-3 mt-2 group"
            >
              <span className="relative flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 text-destructive">
                <span className="absolute inset-0 rounded-full bg-destructive/30 animate-ping" />
                <Siren className="w-5 h-5 relative" />
              </span>
              <span>
                <span className="block text-xs text-muted-foreground uppercase tracking-wider">{t.common.emergencyLine}</span>
                <span className="font-display font-bold text-lg group-hover:text-primary transition">+90 533 821 61 72</span>
              </span>
            </a>
          </div>

          {/* trust pills floating card */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-3xl rounded-3xl animate-tilt" />
            <div className="relative grid grid-cols-2 gap-4">
              {trustBadges.map((b: any, i: number) => (
                <div
                  key={b.label}
                  className="glass card-3d rounded-2xl p-5 reveal"
                  style={{ animationDelay: `${i * 100}ms`, transitionDelay: `${i * 80}ms` }}
                >
                  <div className="bg-gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-glow">
                    <b.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="font-display font-bold text-lg">{b.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{b.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="relative container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s: any, i: number) => (
            <div key={s.l} className="text-center reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="font-display text-4xl md:text-5xl font-bold text-gradient-accent">{s.v}</div>
              <div className="text-sm text-primary-foreground/70 mt-1 uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-14 reveal">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">{t.home.servicesLabel}</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold">{t.home.servicesTitle1} <span className="text-gradient-primary">{t.home.servicesTitle2}</span></h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">{t.home.servicesSub}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((s, i) => (
            <Link
              key={s.slug}
              to="/hizmetler"
              className="group relative bg-gradient-card rounded-2xl overflow-hidden border border-border card-3d reveal"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img src={s.image} alt={s.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
                <div className="absolute top-4 left-4 bg-gradient-primary p-3 rounded-xl shadow-glow group-hover:scale-110 transition">
                  <ServiceIcon name={s.icon} className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="absolute top-4 right-4 glass-dark text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full">{s.response}</div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.short}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {t.common.detail} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 bg-secondary/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="relative container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <div className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-xs font-semibold uppercase tracking-wider mb-4">{t.home.whyLabel}</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">{t.home.whyTitle1} <span className="text-gradient-accent">{t.home.whyTitleHi}</span> {t.home.whyTitle2}</h2>
            <p className="text-muted-foreground mb-6 text-lg">{t.home.whySub}</p>
            <ul className="space-y-3">
              {t.home.whyList.map((line: string) => (
                <li key={line} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span className="text-foreground">{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4 reveal">
            {t.home.whyCards.map((c: any, i: number) => {
              const Icon = [ShieldCheck, Star, Clock, Users][i];
              return (
              <div key={c.t} className="glass card-3d rounded-2xl p-6 text-center">
                <div className="bg-gradient-primary w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-glow animate-float">
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="font-display font-bold text-lg">{c.t}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.d}</div>
              </div>
            );})}
          </div>
        </div>
      </section>

      {/* REFERENCES MARQUEE */}
      <section className="py-16 overflow-hidden">
        <div className="text-center mb-10 reveal">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">{t.home.brandsLabel}</p>
        </div>
        <div className="relative">
          <div className="flex gap-8 animate-marquee w-max">
            {[...refLogos, ...refLogos].map((n, i) => (
              <div key={i} className="glass px-8 py-5 rounded-2xl font-display font-bold text-xl text-muted-foreground hover:text-primary transition whitespace-nowrap">
                {n}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 container mx-auto px-4">
        <div className="relative bg-gradient-hero rounded-3xl overflow-hidden p-10 md:p-16 text-primary-foreground">
          <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/30 rounded-full blur-3xl animate-float" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{t.home.ctaTitle}</h2>
              <p className="text-primary-foreground/80 text-lg">{t.home.ctaSub}</p>
            </div>
            <div className="flex flex-wrap gap-4 md:justify-end">
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white text-primary font-semibold btn-3d">
                <MessageCircle className="w-5 h-5" /> {t.common.whatsappOffer}
              </a>
              <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-gradient-accent text-accent-foreground font-semibold btn-3d-accent">
                <Phone className="w-5 h-5" /> {t.common.callNow}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
