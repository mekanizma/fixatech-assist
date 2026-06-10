import { useState } from "react";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createTechnicianAccount } from "@/lib/service-desk/api";
import { toast } from "sonner";

type Props = {
  onCreated: () => void;
};

function parseSpecialties(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function TechnicianCreateForm({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [specialtiesRaw, setSpecialtiesRaw] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState(true);

  const reset = () => {
    setName("");
    setPhone("");
    setSpecialtiesRaw("");
    setLoginEmail("");
    setPassword("");
    setActive(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Şifre en az 6 karakter olmalı");
      return;
    }
    const specialties = parseSpecialties(specialtiesRaw);
    if (specialties.length === 0) {
      toast.error("En az bir uzmanlık alanı girin");
      return;
    }
    setSubmitting(true);
    try {
      const result = await createTechnicianAccount({
        name,
        phone,
        loginEmail,
        password,
        specialties,
        active,
      });
      toast.success("Teknisyen oluşturuldu", {
        description: `Giriş: ${result.loginEmail}`,
      });
      setOpen(false);
      reset();
      onCreated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Teknisyen oluşturulamadı");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full gap-2">
          <Wrench className="h-4 w-4" />
          Yeni Teknisyen
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Yeni Teknisyen & Panel Hesabı</DialogTitle>
          <DialogDescription>
            Saha personeli kaydı ve teknik panel giriş bilgileri oluşturulur. Teknisyen{" "}
            <strong>/app/giris</strong> üzerinden giriş yapabilir.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Kişisel bilgiler</p>
            <div className="space-y-2">
              <Label>Ad soyad</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Telefon</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+90 5XX XXX XX XX"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Uzmanlık alanları</Label>
              <Input
                value={specialtiesRaw}
                onChange={(e) => setSpecialtiesRaw(e.target.value)}
                placeholder="Endüstriyel Mutfak, Soğutma"
                required
              />
              <p className="text-xs text-muted-foreground">Virgülle ayırın</p>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="tech-active"
                checked={active}
                onCheckedChange={(v) => setActive(v === true)}
              />
              <Label htmlFor="tech-active" className="font-normal cursor-pointer">
                Aktif (görev atanabilir)
              </Label>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Panel girişi</p>
            <div className="space-y-2">
              <Label>Giriş e-postası</Label>
              <Input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="teknisyen@pragmatechnical.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Şifre</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="En az 6 karakter"
                minLength={6}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full rounded-full" disabled={submitting}>
            {submitting ? "Oluşturuluyor…" : "Teknisyen ve hesabı oluştur"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
