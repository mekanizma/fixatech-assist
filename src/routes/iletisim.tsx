import { createFileRoute } from "@tanstack/react-router";
import { Phone, MessageCircle, Mail, MapPin, Clock, Send, User, Building, Wrench } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PHONE, PHONE_TEL, EMAIL, ADDRESS, waLink } from "@/lib/site";
import { useLocalizedServices } from "@/lib/services";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/iletisim")({
  head: () => ({
    meta: [
      { title: "İletişim — FİXATECH Endüstriyel Teknik Servis" },
      { name: "description", content: "FİXATECH ile iletişime geçin. Telefon, WhatsApp, e-posta veya iletişim formu üzerinden 7/24 ulaşabilirsiniz." },
      { property: "og:title", content: "İletişim — FİXATECH" },
      { property: "og:description", content: "7/24 iletişim, WhatsApp hızlı teklif." },
      { property: "og:url", content: "/iletisim" },
    ],
    links: [{ rel: "canonical", href: "/iletisim" }],
  }),
  component: Contact,
});

function Contact() {
  const t = useT();
  const services = useLocalizedServices();
  const [form, setForm] = useState<{ name: string; company: string; service: string; message: string }>({ name: "", company: "", service: services[0].title, message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = t.contact.buildMsg(form.name, form.company, form.service, form.message);
    window.open(waLink(msg), "_blank");
    toast.success(t.contact.toastTitle, { description: t.contact.toastDesc });
  };

  return (
    <>
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <div className="container mx-auto px-4 relative text-center max-w-3xl reveal">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">{t.contact.label}</div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="text-gradient-primary">24/7</span> {t.contact.title1}
          </h1>
          <p className="text-lg text-muted-foreground">{t.contact.sub}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { icon: Phone, t: t.contact.cards.phone, v: PHONE, href: `tel:${PHONE_TEL}`, c: "primary" },
            { icon: MessageCircle, t: t.contact.cards.wa, v: t.contact.cards.waVal, href: waLink(), c: "success" },
            { icon: Mail, t: t.contact.cards.email, v: EMAIL, href: `mailto:${EMAIL}`, c: "primary" },
            { icon: MapPin, t: t.contact.cards.address, v: ADDRESS, href: "#harita", c: "accent" },
          ].map((c, i) => (
            <a key={c.t} href={c.href} className="bg-gradient-card rounded-2xl p-6 border border-border card-3d reveal block" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-glow ${c.c === "success" ? "bg-success" : c.c === "accent" ? "bg-gradient-accent" : "bg-gradient-primary"}`}>
                <c.icon className={`w-6 h-6 ${c.c === "success" ? "text-success-foreground" : c.c === "accent" ? "text-accent-foreground" : "text-primary-foreground"}`} />
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.t}</div>
              <div className="font-semibold mt-1">{c.v}</div>
            </a>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20 grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={submit} className="bg-gradient-card rounded-3xl p-8 border border-border space-y-5 reveal">
          <div>
            <h2 className="font-display text-3xl font-bold mb-2">{t.contact.formTitle}</h2>
            <p className="text-sm text-muted-foreground">{t.contact.formSub}</p>
          </div>

          <div className="space-y-4">
            <Field icon={User} label={t.contact.f.name} required>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input" placeholder={t.contact.f.namePh} />
            </Field>
            <Field icon={Building} label={t.contact.f.company}>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input" placeholder={t.contact.f.companyPh} />
            </Field>
            <Field icon={Wrench} label={t.contact.f.service} required>
              <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="input">
                {services.map((s) => <option key={s.slug}>{s.title}</option>)}
              </select>
            </Field>
            <Field icon={MessageCircle} label={t.contact.f.message} required>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={4} className="input resize-none" placeholder={t.contact.f.messagePh} />
            </Field>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-primary text-primary-foreground font-semibold btn-3d">
              <Send className="w-4 h-4" /> {t.common.send}
            </button>
            <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-accent text-accent-foreground font-semibold btn-3d-accent">
              <Phone className="w-4 h-4" /> {t.common.callNow}
            </a>
          </div>
        </form>

        {/* Info + Map */}
        <div className="space-y-6 reveal">
          <div className="glass rounded-3xl p-8 space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-bold text-lg">{t.contact.hours}</h3>
                <p className="text-muted-foreground text-sm mt-1">{t.contact.weekdays}</p>
                <p className="text-muted-foreground text-sm">{t.contact.weekend}</p>
                <p className="text-success font-semibold text-sm mt-2">{t.contact.emergency}</p>
              </div>
            </div>
          </div>

          <div id="harita" className="rounded-3xl overflow-hidden border border-border card-3d aspect-[4/3]">
            <iframe
              title="Harita"
              src="https://www.openstreetmap.org/export/embed.html?bbox=28.9%2C41.0%2C29.1%2C41.1&layer=mapnik"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <style>{`
        .input {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 2.6rem;
          border-radius: 0.875rem;
          background: var(--background);
          border: 1px solid var(--border);
          font-size: 0.95rem;
          transition: all 0.2s;
        }
        .input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 4px oklch(0.7 0.18 230 / 0.15); }
      `}</style>
    </>
  );
}

function Field({ icon: Icon, label, required, children }: { icon: any; label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      <div className="relative">
        <Icon className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
        {children}
      </div>
    </label>
  );
}
