import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import { COMPANY, PHONE, PHONE_TEL, EMAIL, ADDRESS } from "@/lib/site";
import { useT } from "@/lib/i18n";

function FooterLink({
  to,
  href,
  children,
  external,
}: {
  to?: string;
  href?: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className = "text-xs text-primary-foreground/70 transition hover:text-primary-glow";

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={to!} className={className}>
      {children}
    </Link>
  );
}

export function Footer() {
  const t = useT();

  return (
    <footer className="relative mt-12 overflow-hidden bg-gradient-hero text-primary-foreground">
      <div className="absolute inset-0 bg-gradient-mesh opacity-25" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-glow/50 to-transparent" />

      <div className="relative container mx-auto px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Marka */}
          <div className="flex flex-col items-center pt-8 text-center sm:col-span-2 sm:pt-10 lg:col-span-1 lg:pt-12">
            <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/80 sm:text-base">{t.footer.tag}</p>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-primary-glow">
              {t.footer.areasTitle}
            </p>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-primary-foreground/65">
              {t.footer.areas.join(" · ")}
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-primary-foreground/80 hover:bg-white/10"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-primary-foreground/80 hover:bg-white/10"
              >
                <Facebook className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Hizmetler */}
          <div>
            <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary-glow">
              {t.footer.services}
            </h4>
            <ul className="space-y-1">
              {t.footer.sLinks.map((s: string) => (
                <li key={s}>
                  <FooterLink to="/hizmetler">{s}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary-glow">
              {t.footer.corp}
            </h4>
            <ul className="space-y-1">
              <li>
                <FooterLink to="/hakkimizda">{t.nav.about}</FooterLink>
              </li>
              <li>
                <FooterLink to="/iletisim">{t.nav.contact}</FooterLink>
              </li>
              <li>
                <FooterLink to="/teknik-servis">{t.nav.techService}</FooterLink>
              </li>
              <li>
                <FooterLink to="/app/giris">{t.nav.panel}</FooterLink>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary-glow">
              {t.footer.contact}
            </h4>
            <ul className="space-y-1.5 text-xs text-primary-foreground/70">
              <li className="flex gap-2">
                <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-glow" />
                <a href={`tel:${PHONE_TEL}`} className="hover:text-primary-glow">
                  {PHONE}
                </a>
              </li>
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-glow" />
                <a href={`mailto:${EMAIL}`} className="break-all hover:text-primary-glow">
                  {EMAIL}
                </a>
              </li>
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-glow" />
                <span className="leading-snug whitespace-pre-line">{ADDRESS}</span>
              </li>
              <li className="flex gap-2">
                <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-glow" />
                <span>{t.footer.hours247}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-4 text-[10px] text-primary-foreground/45 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {COMPANY}. {t.footer.copyR}
          </p>
          <p className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-success" />
            {t.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
