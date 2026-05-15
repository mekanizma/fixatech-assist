import { createFileRoute } from "@tanstack/react-router";
import { Building2, Utensils, Briefcase, Quote, Star } from "lucide-react";
import renoImg from "@/assets/service-renovation.jpg";
import kitchenImg from "@/assets/service-kitchen.jpg";

export const Route = createFileRoute("/referanslar")({
  head: () => ({
    meta: [
      { title: "Referanslarımız — Otel & Restoran Müşterilerimiz | FİXATECH" },
      { name: "description", content: "Türkiye'nin önde gelen otel zincirleri, restoranlar ve kurumsal firmaları FİXATECH ile çalışıyor. Müşteri yorumları ve öncesi/sonrası projeleri inceleyin." },
      { property: "og:title", content: "Referanslarımız — FİXATECH" },
      { property: "og:description", content: "500+ mutlu müşteri, kurumsal çözüm ortakları." },
      { property: "og:url", content: "/referanslar" },
    ],
    links: [{ rel: "canonical", href: "/referanslar" }],
  }),
  component: References,
});

const groups = [
  {
    icon: Building2,
    title: "Oteller",
    items: ["Grand Bosphorus Hotel", "Marina Suites", "Park Palace", "Sky View Otel", "Palmiye Resort", "Loft Hotel İstanbul"],
  },
  {
    icon: Utensils,
    title: "Restoranlar",
    items: ["La Cucina", "Marina Bistro", "Sky Lounge", "Park Cafe", "Loft Restaurant", "Olive Garden TR"],
  },
  {
    icon: Briefcase,
    title: "Kurumsal Firmalar",
    items: ["Mavi Gıda A.Ş.", "Anadolu Catering", "Tepe Yemek Hizmetleri", "Akdeniz Otelcilik", "Star Holding F&B", "Boğaziçi Catering"],
  },
];

const testimonials = [
  { name: "Mehmet Y.", role: "Grand Bosphorus Hotel — Teknik Müdür", text: "Endüstriyel mutfağımızda yaşadığımız bir arızada gece yarısı aradık, 45 dakika içinde sahadaydılar. Bu profesyonellik kurumsal işletmeler için paha biçilmez." },
  { name: "Ayşe K.", role: "La Cucina — İşletmeci", text: "3 yıldır periyodik bakım anlaşmamız var. Aylık raporları, şeffaf fiyatlandırmaları ve disiplinli ekipleriyle gerçek bir çözüm ortağı." },
  { name: "Can D.", role: "Mavi Gıda — Operasyon Direktörü", text: "Tek tedarikçiyle tüm teknik servisi yönetmek inanılmaz pratik. FİXATECH bizim için birden fazla firmanın yerini doldurdu." },
];

function References() {
  return (
    <>
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <div className="container mx-auto px-4 relative text-center max-w-3xl reveal">
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-xs font-semibold uppercase tracking-wider mb-4">Referanslar</div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gradient-primary">500+</span> mutlu müşteri, sayısız başarı hikayesi
          </h1>
          <p className="text-lg text-muted-foreground">
            Türkiye'nin önde gelen otel zincirleri, restoranlar ve kurumsal işletmelerinin tercih ettiği teknik servis ortağı.
          </p>
        </div>
      </section>

      {/* Groups */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {groups.map((g, i) => (
            <div key={g.title} className="bg-gradient-card rounded-2xl p-7 border border-border card-3d reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="bg-gradient-primary w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-glow">
                <g.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-4">{g.title}</h3>
              <ul className="space-y-2">
                {g.items.map((x) => (
                  <li key={x} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {x}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Before / After */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10 reveal">
          <h2 className="font-display text-4xl font-bold">Öncesi / Sonrası</h2>
          <p className="text-muted-foreground mt-2">Tamamlanmış proje örneklerinden bir kesit.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { before: kitchenImg, after: renoImg, title: "Otel Mutfak Renovasyonu" },
            { before: renoImg, after: kitchenImg, title: "Restoran Salon Tadilat" },
          ].map((p, i) => (
            <div key={i} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden card-3d">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={p.before} alt="Öncesi" loading="lazy" className="w-full h-full object-cover grayscale" />
                  <span className="absolute top-3 left-3 glass-dark text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">ÖNCESİ</span>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={p.after} alt="Sonrası" loading="lazy" className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-gradient-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full shadow-glow-accent">SONRASI</span>
                </div>
              </div>
              <h3 className="font-display font-bold text-xl mt-4">{p.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-12 reveal">
            <h2 className="font-display text-4xl font-bold">Müşteri Yorumları</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.name} className="glass rounded-2xl p-7 card-3d reveal relative" style={{ transitionDelay: `${i * 100}ms` }}>
                <Quote className="absolute top-5 right-5 w-10 h-10 text-primary/20" />
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-accent text-accent" />)}
                </div>
                <p className="text-foreground leading-relaxed mb-5">"{t.text}"</p>
                <div>
                  <div className="font-display font-bold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
