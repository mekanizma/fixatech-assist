import { createFileRoute } from "@tanstack/react-router";
import teamImg from "@/assets/about-team.jpg";
import { Target, Eye, Award, Heart, Sparkles, ShieldCheck } from "lucide-react";
import { useT } from "@/lib/i18n";
import { buildPageHead, SEO_PAGES } from "@/lib/seo";

export const Route = createFileRoute("/hakkimizda")({
  head: () => buildPageHead(SEO_PAGES.about),
  component: About,
});

function About() {
  const t = useT();
  const pillarIcons = [Target, Eye, Heart, Sparkles];
  const whyIcons = [Award, ShieldCheck, Sparkles];
  return (
    <>
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl reveal">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">{t.about.label}</div>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
              {t.about.title1} <span className="text-gradient-primary">{t.about.titleHi}</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">{t.about.lead}</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="relative rounded-3xl overflow-hidden reveal">
          <img src={teamImg} alt={t.about.teamTitle} loading="lazy" className="w-full h-[400px] md:h-[520px] object-cover" width={1600} height={1024} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 glass rounded-2xl p-6 max-w-md">
            <h3 className="font-display font-bold text-2xl mb-2">{t.about.teamTitle}</h3>
            <p className="text-sm text-muted-foreground">{t.about.teamDesc}</p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="reveal">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{t.about.storyTitle}</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>{t.about.story1}</p>
              <p>{t.about.story2}</p>
              <p>{t.about.mottoLead} <strong className="text-foreground">{t.about.motto}</strong></p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 reveal">
            {t.about.pillars.map((c: any, i: number) => {
              const Icon = pillarIcons[i];
              return (
              <div key={c.t} className="glass card-3d rounded-2xl p-6">
                <div className="bg-gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-glow">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="font-display font-bold text-lg mb-1">{c.t}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.d}</p>
              </div>
            );})}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="py-20 bg-secondary/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-12 reveal">
            <h2 className="font-display text-4xl font-bold">{t.about.whyTitle}</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">{t.about.whySub}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {t.about.whyCards.map((c: any, i: number) => {
              const Icon = whyIcons[i];
              return (
              <div key={c.t} className="bg-gradient-card rounded-2xl p-7 border border-border card-3d reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="bg-gradient-accent w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-glow-accent animate-float">
                  <Icon className="w-7 h-7 text-accent-foreground" />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">{c.t}</h3>
                <p className="text-muted-foreground">{c.d}</p>
              </div>
            );})}
          </div>
        </div>
      </section>
    </>
  );
}
