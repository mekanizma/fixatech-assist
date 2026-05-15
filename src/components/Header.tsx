import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone, Globe } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/site";
import logo from "@/assets/logo.png";
import { useLang } from "@/lib/i18n";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { lang, toggle, t } = useLang();

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/hakkimizda", label: t.nav.about },
    { to: "/hizmetler", label: t.nav.services },
    { to: "/referanslar", label: t.nav.references },
    { to: "/iletisim", label: t.nav.contact },
  ] as const;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" aria-label="FİXATECH">
          <img
            src={logo}
            alt="FİXATECH logosu"
            className="h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="relative px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors group"
              activeProps={{ className: "text-primary" }}
            >
              {l.label}
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label={t.common.switchTo}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full glass text-sm font-semibold hover:text-primary transition"
          >
            <Globe className="w-4 h-4" />
            {lang === "tr" ? "EN" : "TR"}
          </button>
          <a
            href={`tel:${PHONE_TEL}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-accent text-accent-foreground font-semibold text-sm btn-3d-accent"
          >
            <Phone className="w-4 h-4" />
            {PHONE}
          </a>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition"
          onClick={() => setOpen(!open)}
          aria-label={t.nav.menu}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden glass border-t border-border/50 mt-2">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-muted font-medium"
                activeProps={{ className: "text-primary bg-muted" }}
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={() => { toggle(); setOpen(false); }}
              className="mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-full glass font-semibold"
            >
              <Globe className="w-4 h-4" /> {lang === "tr" ? "English" : "Türkçe"}
            </button>
            <a
              href={`tel:${PHONE_TEL}`}
              className="mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-accent text-accent-foreground font-semibold"
            >
              <Phone className="w-4 h-4" /> {PHONE}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
