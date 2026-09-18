import { useState } from "react";
import {
  User,
  Package,
  MapPin,
  Calendar,
  Download,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  TECH_CATEGORIES,
  TECH_DELIVERY_OPTIONS,
  TECH_TIME_SLOTS,
  TECH_URGENCY_OPTIONS,
} from "@/lib/form-submissions/display";
import {
  emptyTechServiceForm,
  type TechServiceFormState,
} from "@/lib/form-submissions/talep-form";

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 text-base md:text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

type Props = {
  saving?: boolean;
  onSaveAndDownload: (form: TechServiceFormState) => void;
  onDownloadOnly: (form: TechServiceFormState) => void;
};

export function AdminTalepForm({ saving, onSaveAndDownload, onDownloadOnly }: Props) {
  const [form, setForm] = useState<TechServiceFormState>(emptyTechServiceForm);
  const set = <K extends keyof TechServiceFormState>(key: K, value: TechServiceFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      className="space-y-5 pb-28 sm:pb-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSaveAndDownload(form);
      }}
    >
      <Section icon={User} title="İletişim" desc="Müşteri veya yetkili kişi bilgileri">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Ad Soyad *">
            <Input
              required
              className="h-10"
              autoComplete="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Adınız ve soyadınız"
            />
          </Field>
          <Field label="Firma / İşletme">
            <Input
              className="h-10"
              autoComplete="organization"
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
              placeholder="Opsiyonel"
            />
          </Field>
          <Field label="Telefon *">
            <Input
              required
              type="tel"
              inputMode="tel"
              className="h-10"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="05XX XXX XX XX"
            />
          </Field>
          <Field label="E-posta">
            <Input
              type="email"
              inputMode="email"
              className="h-10"
              autoComplete="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="ornek@firma.com"
            />
          </Field>
        </div>
      </Section>

      <Section icon={Package} title="Ürün ve arıza" desc="Ekipman ve talep açıklaması">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Kategori *">
            <select
              required
              className={selectClass}
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              <option value="">Kategori seçin</option>
              {TECH_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Adet *">
            <Input
              required
              type="number"
              min={1}
              max={999}
              inputMode="numeric"
              className="h-10"
              value={form.quantity}
              onChange={(e) => set("quantity", e.target.value)}
            />
          </Field>
          <Field label="Marka">
            <Input
              className="h-10"
              value={form.brand}
              onChange={(e) => set("brand", e.target.value)}
              placeholder="Örn. Rational, Electrolux"
            />
          </Field>
          <Field label="Model">
            <Input
              className="h-10"
              value={form.model}
              onChange={(e) => set("model", e.target.value)}
              placeholder="Model numarası"
            />
          </Field>
          <Field label="Seri No" className="sm:col-span-2">
            <Input
              className="h-10"
              value={form.serialNo}
              onChange={(e) => set("serialNo", e.target.value)}
              placeholder="Etiket üzerindeki seri numarası"
            />
          </Field>
          <Field label="Arıza / Talep *" className="sm:col-span-2">
            <Textarea
              required
              rows={3}
              value={form.issue}
              onChange={(e) => set("issue", e.target.value)}
              placeholder="Sorunu veya talebi kısaca yazın..."
            />
          </Field>
        </div>
      </Section>

      <Section icon={MapPin} title="Adres" desc="Servis veya alım adresi">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Açık Adres *" className="sm:col-span-2">
            <Textarea
              required
              rows={2}
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Mahalle, sokak, bina no..."
            />
          </Field>
          <Field label="İlçe *">
            <Input
              required
              className="h-10"
              value={form.district}
              onChange={(e) => set("district", e.target.value)}
              placeholder="Örn. Girne"
            />
          </Field>
          <Field label="Bölge">
            <Input
              className="h-10"
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="Örn. KKTC / Girne"
            />
          </Field>
        </div>
      </Section>

      <Section icon={Calendar} title="Planlama" desc="Servis tipi, tarih ve öncelik">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Servis tipi</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TECH_DELIVERY_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex flex-col rounded-xl border-2 p-3 cursor-pointer transition touch-manipulation min-h-[4.5rem]",
                    form.delivery === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <input
                    type="radio"
                    name="delivery"
                    className="sr-only"
                    checked={form.delivery === opt.value}
                    onChange={() => set("delivery", opt.value)}
                  />
                  <span className="font-semibold text-sm">{opt.label}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="İşlem tarihi">
              <Input
                type="date"
                className="h-10"
                value={form.pickupDate}
                onChange={(e) => set("pickupDate", e.target.value)}
              />
            </Field>
            <Field label="İşlem saati">
              <select
                className={selectClass}
                value={form.pickupTime}
                onChange={(e) => set("pickupTime", e.target.value)}
              >
                <option value="">Saat aralığı seçin</option>
                {TECH_TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Öncelik</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TECH_URGENCY_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex flex-col rounded-xl border-2 p-3 cursor-pointer transition touch-manipulation min-h-[4.5rem]",
                    form.urgency === opt.value
                      ? opt.value === "emergency"
                        ? "border-destructive bg-destructive/5"
                        : "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <input
                    type="radio"
                    name="urgency"
                    className="sr-only"
                    checked={form.urgency === opt.value}
                    onChange={() => set("urgency", opt.value)}
                  />
                  <span className="font-semibold text-sm">{opt.label}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          <Field label="Ek notlar">
            <Textarea
              rows={2}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Kapı kodu, yetkili kişi, özel not..."
            />
          </Field>
        </div>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/95 backdrop-blur px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <div className="mx-auto flex max-w-4xl flex-col gap-2 sm:flex-row">
          <Button type="submit" disabled={saving} className="rounded-full h-11 w-full sm:w-auto sm:flex-1">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Kaydediliyor..." : "Kaydet ve indir"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            className="rounded-full h-11 w-full sm:w-auto"
            onClick={() => onDownloadOnly(form)}
          >
            <Download className="h-4 w-4 mr-2" />
            Sadece indir
          </Button>
        </div>
      </div>
    </form>
  );
}

function Section({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-4 p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{desc}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">{children}</CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
