import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Phone, MessageCircle, Clock, Zap, Users, Building2, ShieldCheck, Star, CheckCircle2, Siren } from "lucide-react";
import heroImg from "@/assets/hero-technician.jpg";
import { useLocalizedServices } from "@/lib/services";
import { PHONE_TEL, waLink } from "@/lib/site";
import { useEffect } from "react";
import { useT } from "@/lib/i18n";
import { HeroHeadline, type HeroTitleSegment } from "@/components/HeroHeadline";
import { HeroTechBackdrop } from "@/components/HeroTechBackdrop";
import { HeroTrustCards } from "@/components/HeroTrustCards";
import { ServicePreviewCard } from "@/components/ServicePreviewCard";
import { buildPageHead, SEO_PAGES } from "@/lib/seo";
import { SeoLocalSection } from "@/components/SeoLocalSection";

export const Route = createFileRoute("/")({
  head: () => buildPageHead(SEO_PAGES.home),
  component: Home,
});

const trustIcons = [Clock, Zap, Users, Building2];

function Home() {
  const t = useT();
  const services = useLocalizedServices();
  const trustBadges = t.home.trust.map((b: { l: string; d: string }, i: number) => ({
    icon: trustIcons[i],
    label: b.l,
    desc: b.d,
  }));

  useEffect(() => {
    document.title = t.home.metaTitle;
  }, [t.home.metaTitle]);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden -mt-20 pt-20">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Profesyonel endüstriyel teknik servis atölyesi"
            className="w-full h-full object-cover object-[70%_center] scale-105"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-background/20" />
          <HeroTechBackdrop />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium animate-glow">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              {t.home.activeNow ?? t.common.activeNow}
            </div>

            <HeroHeadline segments={t.home.heroTitle as HeroTitleSegment[]} />

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

          <HeroTrustCards badges={trustBadges} />
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-14 reveal">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">{t.home.servicesLabel}</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold">{t.home.servicesTitle1} <span className="text-gradient-primary">{t.home.servicesTitle2}</span></h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">{t.home.servicesSub}</p>
        </div>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServicePreviewCard
              key={s.slug}
              slug={s.slug}
              image={s.image}
              title={s.title}
              icon={s.icon}
              response={s.response}
              short={s.short}
              detailLabel={t.common.detail}
              index={i}
            />
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
            {t.home.whyCards.map((c: { t: string; d: string }, i: number) => {
              const Icon = [ShieldCheck, Star, Clock, Users][i];
              return (
                <div key={c.t} className="glass card-3d rounded-2xl p-6 text-center">
                  <div className="bg-gradient-primary w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-glow animate-float">
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div className="font-display font-bold text-lg">{c.t}</div>
                  <div className="text-xs text-muted-foreground mt-1">{c.d}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SeoLocalSection />

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
