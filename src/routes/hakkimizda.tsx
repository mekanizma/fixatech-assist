import { createFileRoute } from "@tanstack/react-router";
import teamImg from "@/assets/about-team.jpg";
import { Target, Eye, Award, Heart, Sparkles, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/hakkimizda")({
  head: () => ({
    meta: [
      { title: "Hakkımızda — FİXATECH Endüstriyel Teknik Servis" },
      { name: "description", content: "FİXATECH; otel ve restoran sektörüne 12 yılı aşkın süredir profesyonel teknik servis sağlayan, güvenilir ve uzman ekipten oluşan bir teknik servis firmasıdır." },
      { property: "og:title", content: "Hakkımızda — FİXATECH" },
      { property: "og:description", content: "12 yılı aşkın deneyim, profesyonel ekip, kurumsal çözümler." },
      { property: "og:url", content: "/hakkimizda" },
    ],
    links: [{ rel: "canonical", href: "/hakkimizda" }],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl reveal">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">Hakkımızda</div>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
              Endüstriyel teknik serviste <span className="text-gradient-primary">12+ yıllık tecrübe</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              FİXATECH; otel, restoran ve kurumsal işletmelerin teknik altyapı ihtiyaçlarına çözüm üreten, sertifikalı uzman ekibiyle hizmet veren bir teknik servis firmasıdır.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="relative rounded-3xl overflow-hidden reveal">
          <img src={teamImg} alt="FİXATECH ekibi" loading="lazy" className="w-full h-[400px] md:h-[520px] object-cover" width={1600} height={1024} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 glass rounded-2xl p-6 max-w-md">
            <h3 className="font-display font-bold text-2xl mb-2">Profesyonel Saha Ekibi</h3>
            <p className="text-sm text-muted-foreground">Mutfak şefleri, mühendisler ve teknik ustalar — sektörün ihtiyaçlarını en iyi anlayan kadro.</p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="reveal">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Firma Hikayemiz</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>2012 yılında küçük bir teknik servis atölyesi olarak yola çıkan FİXATECH, kısa sürede İstanbul'un önde gelen otel ve restoran zincirlerinin tercih ettiği teknik servis ortağı haline geldi.</p>
              <p>Bugün 20'yi aşkın saha uzmanı, mobil servis araçları ve geniş yedek parça ağı ile 500'den fazla işletmenin teknik altyapısının sürekliliğini sağlıyoruz.</p>
              <p>Mottomuz net: <strong className="text-foreground">"Sizin işletmeniz durmasın diye, biz hiç durmayız."</strong></p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 reveal">
            {[
              { icon: Target, t: "Misyonumuz", d: "İşletmelerin teknik altyapısını kesintisiz tutmak ve operasyonel verimliliği artırmak." },
              { icon: Eye, t: "Vizyonumuz", d: "Türkiye'nin en güvenilen endüstriyel teknik servis markası olmak." },
              { icon: Heart, t: "Değerlerimiz", d: "Şeffaflık, dürüstlük, zamanında teslimat ve müşteri memnuniyeti." },
              { icon: Sparkles, t: "Yaklaşımımız", d: "Geçici tamir değil, kalıcı çözüm üreten profesyonel bakış." },
            ].map((c) => (
              <div key={c.t} className="glass card-3d rounded-2xl p-6">
                <div className="bg-gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-glow">
                  <c.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="font-display font-bold text-lg mb-1">{c.t}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="py-20 bg-secondary/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-12 reveal">
            <h2 className="font-display text-4xl font-bold">Neden FİXATECH?</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">Kurumsal müşterilerimizin bizi tercih etme sebepleri.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Award, t: "Sertifikalı Ekip", d: "Tüm teknisyenlerimiz alanında belgeli, sürekli eğitimden geçen profesyoneller." },
              { icon: ShieldCheck, t: "Garantili İşçilik", d: "Yapılan tüm bakım ve onarımlarda 6-12 ay arası işçilik garantisi sunuyoruz." },
              { icon: Sparkles, t: "Modern Ekipman", d: "Kaçak tespit kameraları, termal görüntüleyiciler ve özel ölçüm cihazları." },
            ].map((c, i) => (
              <div key={c.t} className="bg-gradient-card rounded-2xl p-7 border border-border card-3d reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="bg-gradient-accent w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-glow-accent animate-float">
                  <c.icon className="w-7 h-7 text-accent-foreground" />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">{c.t}</h3>
                <p className="text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
