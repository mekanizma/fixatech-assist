import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import { COMPANY, PHONE, PHONE_TEL, EMAIL, ADDRESS, waLink } from "@/lib/site";
import logo from "@/assets/logo.png";
import { useT } from "@/lib/i18n";

export function Footer() {
  const t = useT();
  return (
    <footer className="relative mt-24 bg-gradient-hero text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-glow to-transparent" />
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="mb-4 inline-flex items-center">
              <img src={logo} alt={`${COMPANY} logosu`} className="h-14 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              {t.footer.tag}
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" className="p-2 rounded-lg glass-dark hover-lift" aria-label="Instagram"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="p-2 rounded-lg glass-dark hover-lift" aria-label="Facebook"><Facebook className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">{t.footer.services}</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {t.footer.sLinks.map((s: string) => (
                <li key={s}><Link to="/hizmetler" className="hover:text-primary-glow transition">{s}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">{t.footer.corp}</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/hakkimizda" className="hover:text-primary-glow transition">{t.nav.about}</Link></li>
              <li><Link to="/referanslar" className="hover:text-primary-glow transition">{t.nav.references}</Link></li>
              <li><Link to="/iletisim" className="hover:text-primary-glow transition">{t.nav.contact}</Link></li>
              <li><Link to="/teknik-servis" className="hover:text-primary-glow transition">{t.nav.techService}</Link></li>
              <li><Link to="/app/giris" className="hover:text-primary-glow transition">{t.nav.panel}</Link></li>
              <li><a href={waLink()} className="hover:text-primary-glow transition">{t.common.whatsappOffer}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">{t.footer.contact}</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 text-primary-glow" /><a href={`tel:${PHONE_TEL}`} className="hover:text-primary-glow">{PHONE}</a></li>
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 text-primary-glow" /><a href={`mailto:${EMAIL}`} className="hover:text-primary-glow">{EMAIL}</a></li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-primary-glow" />{ADDRESS}</li>
              <li className="flex items-start gap-2"><Clock className="w-4 h-4 mt-0.5 text-primary-glow" />{t.footer.hours247}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between gap-3 text-xs text-primary-foreground/50">
          <p>© {new Date().getFullYear()} {COMPANY}. {t.footer.copyR}</p>
          <p>{t.footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
