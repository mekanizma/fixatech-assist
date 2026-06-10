import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Wrench, Shield, User, Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";
import { COMPANY } from "@/lib/site";
import { useAuth } from "@/lib/service-desk/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { roleHome } from "@/lib/service-desk/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/app/giris")({
  component: LoginPage,
});

const FEATURES = [
  { icon: Shield, t: "Kurumsal güvenlik", d: "Rol bazlı erişim — admin, teknisyen, müşteri" },
  { icon: Wrench, t: "Uçtan uca takip", d: "Talep → atama → saha → tamamlama" },
  { icon: User, t: "Müşteri portalı", d: "Canlı durum ve PDF servis raporu" },
] as const;

function LoginHero() {
  return (
    <div className="relative hidden min-h-screen flex-1 flex-col overflow-hidden bg-gradient-hero text-primary-foreground lg:flex">
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      <div className="pointer-events-none absolute -right-16 top-1/4 h-72 w-72 rounded-full bg-primary-glow/25 blur-3xl animate-float" />
      <div
        className="pointer-events-none absolute -left-20 bottom-1/4 h-96 w-96 rounded-full bg-accent/15 blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-glow/60 to-transparent" />

      <div className="relative flex flex-1 flex-col items-center justify-center px-10 py-14 xl:px-14">
        <div className="w-full max-w-lg space-y-8 text-center">
          <div className="mx-auto inline-flex rounded-2xl bg-white/95 p-4 shadow-[0_20px_50px_-12px_oklch(0_0_0/0.35)] ring-1 ring-white/20">
            <img src={logo} alt={COMPANY} className="h-28 w-auto object-contain sm:h-32" />
          </div>

          <div className="space-y-4">
            <div className="glass-dark mx-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide">
              <Sparkles className="h-3.5 w-3.5 text-primary-glow" />
              Servis Kontrol Paneli
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight xl:text-4xl">
              Teknik servis operasyonlarınızı{" "}
              <span className="text-gradient-accent">tek merkezden</span> yönetin
            </h1>
            <p className="mx-auto max-w-md text-base leading-relaxed text-primary-foreground/75">
              Oteller, restoranlar ve endüstriyel mutfak işletmeleri için profesyonel talep, atama ve
              raporlama akışı.
            </p>
          </div>

          <ul className="grid gap-3 text-left sm:grid-cols-1">
            {FEATURES.map((item) => (
              <li
                key={item.t}
                className="glass-dark group flex gap-4 rounded-2xl p-4 transition hover:bg-white/[0.08]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                  <item.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className="text-sm font-semibold">{item.t}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-primary-foreground/65">{item.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="relative pb-8 text-center text-[11px] tracking-wide text-primary-foreground/40">
        © {new Date().getFullYear()} {COMPANY} — Tüm hakları saklıdır
      </p>
    </div>
  );
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      toast.error(".env dosyasında VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanımlayın");
      return;
    }
    setSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.ok) {
        toast.success("Giriş başarılı");
        navigate({ to: roleHome(result.user.role) });
      } else {
        toast.error(result.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <LoginHero />

      <div className="relative flex flex-1 flex-col items-center justify-center bg-background p-6 sm:p-10">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl lg:hidden" />

        <div className="relative w-full max-w-md space-y-6">
          <div className="flex flex-col items-center text-center lg:hidden">
            <div className="mb-4 inline-flex rounded-2xl bg-card p-3 shadow-md ring-1 ring-border/60">
              <img src={logo} alt={COMPANY} className="h-20 w-auto object-contain" />
            </div>
            <p className="text-sm text-muted-foreground">{COMPANY} Servis Kontrol Paneli</p>
          </div>

          <Card className="border-border/60 shadow-xl shadow-primary/5">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="font-display text-2xl">Panele Giriş</CardTitle>
              <CardDescription>Kurumsal hesabınızla giriş yapın</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-muted/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Şifre</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-muted/30"
                  />
                </div>
                <Button type="submit" className="w-full rounded-full btn-3d" size="lg" disabled={submitting}>
                  {submitting ? "Giriş yapılıyor…" : "Giriş Yap"}
                </Button>
              </form>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                <Link to="/" className="font-medium text-primary hover:underline">
                  Ana siteye dön
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
