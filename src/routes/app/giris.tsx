import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Wrench, Shield, User, HardHat } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/lib/service-desk/auth";
import { findUserByEmail } from "@/lib/service-desk/store";
import { DEMO_ACCOUNTS } from "@/lib/service-desk/constants";
import { roleHome } from "@/lib/service-desk/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/app/giris")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@fixatech.com");
  const [password, setPassword] = useState("admin123");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      const u = findUserByEmail(email);
      toast.success("Giriş başarılı");
      navigate({ to: u ? roleHome(u.role) : "/app/admin" });
    } else {
      toast.error("E-posta veya şifre hatalı");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero text-primary-foreground p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        <div className="relative">
          <img src={logo} alt="FİXATECH" className="h-14 brightness-0 invert mb-8" />
          <h1 className="font-display text-4xl font-bold leading-tight">Teknik Servis Kontrol Paneli</h1>
          <p className="mt-4 text-primary-foreground/80 max-w-md text-lg">
            Oteller, restoranlar ve endüstriyel mutfak işletmeleri için profesyonel servis yönetimi.
          </p>
        </div>
        <ul className="relative space-y-4 text-sm">
          {[
            { icon: Shield, t: "Kurumsal güvenlik", d: "Rol bazlı erişim — admin, teknisyen, müşteri" },
            { icon: Wrench, t: "Uçtan uca takip", d: "Talep → atama → saha → tamamlama" },
            { icon: User, t: "Müşteri portalı", d: "Canlı durum ve PDF servis raporu" },
          ].map((item) => (
            <li key={item.t} className="flex gap-3">
              <item.icon className="h-5 w-5 text-primary-glow shrink-0" />
              <div>
                <p className="font-semibold">{item.t}</p>
                <p className="text-primary-foreground/70">{item.d}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md border-border/60 shadow-xl">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Panele Giriş</CardTitle>
            <CardDescription>FİXATECH servis yönetim sistemine hoş geldiniz</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label>E-posta</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Şifre</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full rounded-full" size="lg">
                Giriş Yap
              </Button>
            </form>

            <div className="mt-6 rounded-xl bg-muted/50 p-4 space-y-2">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Demo hesaplar</p>
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.email}
                  type="button"
                  className="w-full text-left text-xs rounded-lg px-3 py-2 hover:bg-background transition flex items-center gap-2"
                  onClick={() => {
                    setEmail(a.email);
                    setPassword(a.password);
                  }}
                >
                  <HardHat className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium">{a.hint}</span>
                  <span className="text-muted-foreground ml-auto">{a.email}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
