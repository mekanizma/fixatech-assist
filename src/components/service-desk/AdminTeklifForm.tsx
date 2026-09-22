import { useState } from "react";
import {
  User,
  MapPin,
  FileSpreadsheet,
  ListOrdered,
  Download,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatTry } from "@/lib/service-desk/pricing";
import {
  emptyTeklifForm,
  emptyTeklifLine,
  lineAmount,
  teklifGrandTotal,
  type TeklifFormState,
  type TeklifLineItem,
} from "@/lib/form-submissions/teklif-form";

type Props = {
  saving?: boolean;
  onSaveAndDownload: (form: TeklifFormState) => void;
  onDownloadOnly: (form: TeklifFormState) => void;
};

export function AdminTeklifForm({ saving, onSaveAndDownload, onDownloadOnly }: Props) {
  const [form, setForm] = useState<TeklifFormState>(emptyTeklifForm);
  const set = <K extends keyof TeklifFormState>(key: K, value: TeklifFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateItem = <K extends keyof TeklifLineItem>(
    index: number,
    key: K,
    value: TeklifLineItem[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    }));
  };

  const addItem = () => setForm((prev) => ({ ...prev, items: [...prev.items, emptyTeklifLine()] }));

  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.length <= 1 ? [emptyTeklifLine()] : prev.items.filter((_, i) => i !== index),
    }));
  };

  const total = teklifGrandTotal(form.items);

  return (
    <form
      className="space-y-5 pb-28 sm:pb-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSaveAndDownload(form);
      }}
    >
      <Section icon={User} title="Müşteri" desc="Teklifin gönderileceği kişi / firma">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Ad Soyad *">
            <Input
              required
              className="h-10"
              autoComplete="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Yetkili adı"
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

      <Section icon={MapPin} title="Adres" desc="İşyeri veya servis adresi">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Açık Adres" className="sm:col-span-2">
            <Textarea
              rows={2}
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Mahalle, sokak, bina no..."
            />
          </Field>
          <Field label="İlçe">
            <Input
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

      <Section icon={FileSpreadsheet} title="Teklif bilgileri" desc="Konu, geçerlilik ve koşullar">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Teklif konusu *" className="sm:col-span-2">
            <Input
              required
              className="h-10"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Örn. Kombi servis ve bakım teklifi"
            />
          </Field>
          <Field label="Geçerlilik tarihi">
            <Input
              type="date"
              className="h-10"
              value={form.validUntil}
              onChange={(e) => set("validUntil", e.target.value)}
            />
          </Field>
          <Field label="Notlar" className="sm:col-span-2">
            <Textarea
              rows={2}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Kapsam, ek açıklama..."
            />
          </Field>
          <Field label="Koşullar" className="sm:col-span-2">
            <Textarea
              rows={2}
              value={form.terms}
              onChange={(e) => set("terms", e.target.value)}
              placeholder="Ödeme, KDV, garanti notları..."
            />
          </Field>
        </div>
      </Section>

      <Section icon={ListOrdered} title="Kalemler" desc="Açıklama, adet ve birim fiyat">
        <div className="space-y-3">
          {form.items.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-border/60 bg-muted/20 p-3 sm:p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Kalem {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  onClick={() => removeItem(index)}
                  title="Kalemi sil"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Field label="Açıklama">
                <Input
                  className="h-10"
                  value={item.description}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                  placeholder="İşçilik / parça / hizmet"
                />
              </Field>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Field label="Adet">
                  <Input
                    type="number"
                    min={0}
                    step="1"
                    inputMode="decimal"
                    className="h-10"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", e.target.value)}
                  />
                </Field>
                <Field label="Birim fiyat (₺)">
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    inputMode="decimal"
                    className="h-10"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                    placeholder="0.00"
                  />
                </Field>
                <Field label="Tutar" className="col-span-2 sm:col-span-1">
                  <div className="flex h-10 items-center rounded-md border border-input bg-background px-3 text-sm font-semibold">
                    {formatTry(lineAmount(item))}
                  </div>
                </Field>
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" className="w-full sm:w-auto rounded-full h-11" onClick={addItem}>
            <Plus className="h-4 w-4 mr-2" />
            Kalem ekle
          </Button>

          <div className="flex justify-end rounded-xl border border-border/60 bg-primary/5 px-4 py-3">
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Genel toplam</p>
              <p className="text-xl font-display font-bold text-foreground">{formatTry(total)}</p>
            </div>
          </div>
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
