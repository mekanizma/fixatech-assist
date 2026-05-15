import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUSINESS_LABELS } from "@/lib/service-desk/constants";
import { createCustomerAccount, type CreateCustomerInput } from "@/lib/service-desk/api";
import type { BusinessType } from "@/lib/service-desk/types";
import { toast } from "sonner";

type Props = {
  onCreated: () => void;
};

const businessTypes = Object.keys(BUSINESS_LABELS) as BusinessType[];

export function CustomerCreateForm({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CreateCustomerInput>({
    companyName: "",
    contactPerson: "",
    phone: "",
    companyEmail: "",
    loginEmail: "",
    password: "",
    address: "",
    district: "",
    city: "İstanbul",
    type: "hotel",
  });

  const set = <K extends keyof CreateCustomerInput>(key: K, value: CreateCustomerInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Şifre en az 6 karakter olmalı");
      return;
    }
    setSubmitting(true);
    try {
      const result = await createCustomerAccount(form);
      toast.success("Müşteri oluşturuldu", {
        description: `Giriş: ${result.loginEmail}`,
      });
      setOpen(false);
      setForm({
        companyName: "",
        contactPerson: "",
        phone: "",
        companyEmail: "",
        loginEmail: "",
        password: "",
        address: "",
        district: "",
        city: "İstanbul",
        type: "hotel",
      });
      onCreated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Müşteri oluşturulamadı");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full gap-2">
          <UserPlus className="h-4 w-4" />
          Yeni Müşteri
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Yeni Müşteri & Portal Hesabı</DialogTitle>
          <DialogDescription>
            Firma kaydı ve müşteri paneli giriş bilgileri oluşturulur. Müşteri{" "}
            <strong>/app/giris</strong> üzerinden giriş yapabilir.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Firma</p>
            <div className="space-y-2">
              <Label>Firma adı</Label>
              <Input
                value={form.companyName}
                onChange={(e) => set("companyName", e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>İşletme tipi</Label>
                <Select value={form.type} onValueChange={(v) => set("type", v as BusinessType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {BUSINESS_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>İl</Label>
                <Input value={form.city} onChange={(e) => set("city", e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>İlçe</Label>
              <Input
                value={form.district}
                onChange={(e) => set("district", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Açık adres</Label>
              <Input
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Yetkili & iletişim</p>
            <div className="space-y-2">
              <Label>Yetkili adı</Label>
              <Input
                value={form.contactPerson}
                onChange={(e) => set("contactPerson", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Telefon</Label>
              <Input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+90 5XX XXX XX XX"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Firma e-posta (opsiyonel)</Label>
              <Input
                type="email"
                value={form.companyEmail}
                onChange={(e) => set("companyEmail", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Panel girişi</p>
            <div className="space-y-2">
              <Label>Giriş e-postası</Label>
              <Input
                type="email"
                value={form.loginEmail}
                onChange={(e) => set("loginEmail", e.target.value)}
                placeholder="ornek@otel.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Şifre</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="En az 6 karakter"
                minLength={6}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full rounded-full" disabled={submitting}>
            {submitting ? "Oluşturuluyor…" : "Müşteri ve hesabı oluştur"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
