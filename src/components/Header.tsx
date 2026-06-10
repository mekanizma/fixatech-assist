import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Menu,
  X,
  Phone,
  Globe,
  LayoutDashboard,
  Wrench,
  ChevronRight,
} from "lucide-react";
import { COMPANY, PHONE, PHONE_TEL } from "@/lib/site";
import logo from "@/assets/logo.png";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const mainNav = [
  { to: "/", labelKey: "home" as const, exact: true },
  { to: "/hakkimizda", labelKey: "about" as const },
  { to: "/hizmetler", labelKey: "services" as const },
  { to: "/iletisim", labelKey: "contact" as const },
] as const;

function NavItem({
  to,
  label,
  exact,
  onNavigate,
}: {
  to: string;
  label: string;
  exact?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      activeOptions={{ exact: !!exact }}
      className={cn(
        "relative whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium tracking-wide transition-all duration-200 xl:px-3.5 xl:py-2 xl:text-[13px]",
        "text-foreground/75 hover:bg-foreground/[0.06] hover:text-foreground",
      )}
      activeProps={{
        className: cn(
          "bg-primary/12 text-primary font-semibold shadow-[inset_0_0_0_1px_oklch(0.45_0.18_250/0.15)]",
          "hover:bg-primary/12 hover:text-primary",
        ),
      }}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { lang, toggle, t } = useLang();

  const labels = {
    home: t.nav.home,
    about: t.nav.about,
    services: t.nav.services,
    contact: t.nav.contact,
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMobile = () => setOpen(false);

  const mobileMenu =
    open && typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 z-[100] flex flex-col bg-background lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.menu}
          >
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 shrink-0">
              <Link to="/" onClick={closeMobile} className="flex items-center" aria-label={COMPANY}>
                <img src={logo} alt="" className="h-11 w-auto origin-left object-contain scale-[1.7]" />
              </Link>
              <button
                type="button"
                onClick={closeMobile}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-muted/50 text-foreground"
                aria-label="Menüyü kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav
              className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 space-y-6"
              aria-label="Mobil menü"
            >
              <section className="space-y-1">
                <p className="px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Kurumsal
                </p>
                {mainNav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeMobile}
                    activeOptions={{ exact: "exact" in item ? item.exact : false }}
                    className="flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-medium text-foreground transition-colors hover:bg-muted"
                    activeProps={{ className: "bg-primary/10 text-primary font-semibold" }}
                  >
                    {labels[item.labelKey]}
                    <ChevronRight className="h-4 w-4 shrink-0 opacity-35" aria-hidden />
                  </Link>
                ))}
              </section>

              <section className="space-y-2">
                <p className="px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Servis
                </p>
                <Link
                  to="/teknik-servis"
                  onClick={closeMobile}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 font-semibold text-foreground shadow-sm"
                  activeProps={{ className: "border-primary/40 bg-primary/5 text-primary" }}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Wrench className="h-5 w-5" />
                  </span>
                  <span>{t.nav.techService}</span>
                </Link>
                <Link
                  to="/app/giris"
                  onClick={closeMobile}
                  className="flex items-center gap-3 rounded-xl bg-gradient-primary px-4 py-3.5 font-semibold text-primary-foreground shadow-md"
                  activeProps={{ className: "ring-2 ring-primary/30" }}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
                    <LayoutDashboard className="h-5 w-5" />
                  </span>
                  <span>{t.nav.panel}</span>
                </Link>
              </section>

              <section className="space-y-2 border-t border-border/60 pt-5 pb-2">
                <button
                  type="button"
                  onClick={() => {
                    toggle();
                    closeMobile();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold"
                >
                  <Globe className="h-4 w-4" />
                  {lang === "tr" ? "English" : "Türkçe"}
                </button>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-accent py-3.5 text-sm font-semibold text-accent-foreground shadow-glow-accent"
                >
                  <Phone className="h-4 w-4" />
                  {PHONE}
                </a>
              </section>
            </nav>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 overflow-visible transition-[background,box-shadow,padding,border-color] duration-300",
        open && "bg-background border-b border-border/60 shadow-sm",
        !open &&
          (scrolled
            ? "glass border-b border-border/60 py-2 shadow-[0_8px_32px_-12px_oklch(0.18_0.04_250/0.25)]"
            : "border-b border-white/20 bg-background/25 py-3 backdrop-blur-xl backdrop-saturate-150"),
        open ? "py-2" : scrolled ? "py-2" : "py-3",
      )}
    >
      <div className="container mx-auto grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 overflow-visible px-4 lg:gap-3">
        <Link
          to="/"
          className="relative z-20 block h-12 w-36 shrink-0 overflow-visible sm:w-40 md:w-44 group"
          aria-label={COMPANY}
        >
          <img
            src={logo}
            alt={`${COMPANY} logosu`}
            className={cn(
              "pointer-events-none absolute left-0 top-1/2 w-auto -translate-y-1/2 object-contain transition-opacity duration-300",
              "h-[210px] w-auto",
              "group-hover:opacity-90",
            )}
          />
        </Link>

        <nav className="hidden lg:flex min-w-0 justify-center px-1" aria-label="Ana menü">
          <div className="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-2xl border border-border/50 bg-card/70 p-1 shadow-elegant backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {mainNav.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                label={labels[item.labelKey]}
                exact={"exact" in item ? item.exact : false}
              />
            ))}
          </div>
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-1.5 md:gap-2">
          <div className="hidden md:flex items-center gap-1.5 xl:gap-2">
          <Link
            to="/teknik-servis"
            title={t.nav.techService}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-background/80 p-2 xl:px-3.5 xl:py-2",
              "text-[13px] font-semibold text-foreground/90 shadow-sm transition-all duration-200",
              "hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
            )}
            activeProps={{
              className: "border-primary/40 bg-primary/10 text-primary",
            }}
          >
            <Wrench className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
            <span className="hidden xl:inline">{t.nav.techService}</span>
          </Link>

          <Link
            to="/app/giris"
            title={t.nav.panel}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl bg-gradient-primary p-2 xl:px-4 xl:py-2",
              "text-[13px] font-semibold text-primary-foreground shadow-3d btn-3d",
            )}
            activeProps={{ className: "ring-2 ring-primary/40 ring-offset-2 ring-offset-background" }}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden xl:inline">{t.nav.panel}</span>
          </Link>

          <div className="mx-0.5 hidden h-8 w-px bg-border/80 xl:block" aria-hidden />

          <button
            type="button"
            onClick={toggle}
            aria-label={t.common.switchTo}
            className={cn(
              "hidden xl:inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-muted/50 px-3 py-2",
              "text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary hover:border-primary/30",
            )}
          >
            <Globe className="h-3.5 w-3.5" aria-hidden />
            {lang === "tr" ? "EN" : "TR"}
          </button>

          <a
            href={`tel:${PHONE_TEL}`}
            title={PHONE}
            className="hidden xl:inline-flex items-center gap-2 rounded-xl bg-gradient-accent px-4 py-2 text-[13px] font-semibold text-accent-foreground btn-3d-accent shadow-glow-accent"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {PHONE}
          </a>
        </div>

        <button
          type="button"
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-card/80 lg:hidden",
            "text-foreground shadow-sm transition-colors hover:bg-muted",
          )}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={t.nav.menu}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        </div>
      </div>

    </header>
    {mobileMenu}
    </>
  );
}
