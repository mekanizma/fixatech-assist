import { useEffect, useState } from "react";
import { Building2, Package, AlertCircle, Calendar, Camera, Video, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  PRODUCT_TYPES,
  INDIVIDUAL_PRODUCT_TYPES,
  TIME_SLOTS,
  BUSINESS_LABELS,
  CORPORATE_BUSINESS_TYPES,
  MAX_FILE_SIZE,
} from "@/lib/service-desk/constants";
import { fileToDataUrl } from "@/lib/service-desk/utils";
import type {
  BusinessType,
  Company,
  CustomerKind,
  ServiceMode,
  ServiceTicket,
  TicketInput,
  Urgency,
  WarrantyStatus,
} from "@/lib/service-desk/types";
import { cn } from "@/lib/utils";
import { waLink, PHONE_TEL } from "@/lib/site";

export type ServiceFormValues = {
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  city: string;
  businessType: BusinessType;
  productType: string;
  productName: string;
  brand: string;
  model: string;
  serialNo: string;
  quantity: number;
  issueDescription: string;
  photos: string[];
  videos: string[];
  urgency: Urgency;
  serviceDate: string;
  serviceTime: string;
  serviceMode: ServiceMode;
  warrantyStatus: WarrantyStatus;
  previousService: boolean;
  notes: string;
  location?: { lat: number; lng: number };
};

const COMPANY_FIELDS = [
  "companyName",
  "contactPerson",
  "phone",
  "email",
  "address",
  "district",
  "city",
  "businessType",
] as const satisfies readonly (keyof ServiceFormValues)[];

export function companyToFormDefaults(company: Company): Pick<ServiceFormValues, (typeof COMPANY_FIELDS)[number]> {
  return {
    companyName: company.name,
    contactPerson: company.contactPerson,
    phone: company.phone,
    email: company.email,
    address: company.address,
    district: company.district,
    city: company.city,
    businessType: company.type,
  };
}

export function ticketToFormDefaults(
  ticket: ServiceTicket,
): Pick<ServiceFormValues, (typeof COMPANY_FIELDS)[number]> {
  return {
    companyName: ticket.companyName,
    contactPerson: ticket.contactPerson,
    phone: ticket.phone,
    email: ticket.email,
    address: ticket.address,
    district: ticket.district,
    city: ticket.city,
    businessType: ticket.businessType,
  };
}

function emptyForm(kind: CustomerKind = "kurumsal"): ServiceFormValues {
  const isIndividual = kind === "bireysel";
  return {
    companyName: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    district: "",
    city: "",
    businessType: isIndividual ? "individual" : "hotel",
    productType: isIndividual ? INDIVIDUAL_PRODUCT_TYPES[0] : PRODUCT_TYPES[0],
    productName: "",
    brand: "",
    model: "",
    serialNo: "",
    quantity: 1,
    issueDescription: "",
    photos: [],
    videos: [],
    urgency: "normal",
    serviceDate: new Date().toISOString().split("T")[0],
    serviceTime: TIME_SLOTS[1],
    serviceMode: "onsite",
    warrantyStatus: "unknown",
    previousService: false,
    notes: "",
  };
}

type Props = {
  initial?: Partial<ServiceFormValues>;
  /** bireysel: kişi bilgileri; kurumsal: firma bilgileri */
  customerKind?: CustomerKind;
  /** Kayıtlı firma bilgileri gösterilir; müşteri tekrar girmek zorunda kalmaz */
  lockCompanyFields?: boolean;
  onSubmit: (values: ServiceFormValues) => void;
  submitLabel?: string;
  showWhatsApp?: boolean;
};

/** Tanımlı tüm alanları birleştirir (firma + ürün + servis planlama). */
function mergeFormInitial(
  prev: ServiceFormValues,
  initial?: Partial<ServiceFormValues>,
): ServiceFormValues {
  if (!initial) return prev;
  return { ...prev, ...initial };
}

export function ServiceRequestForm({
  initial,
  customerKind = "kurumsal",
  lockCompanyFields = false,
  onSubmit,
  submitLabel = "Servis Talebi Oluştur",
  showWhatsApp = true,
}: Props) {
  const isIndividual = customerKind === "bireysel";
  const productOptions = isIndividual ? INDIVIDUAL_PRODUCT_TYPES : PRODUCT_TYPES;

  const [form, setForm] = useState<ServiceFormValues>(() =>
    mergeFormInitial(emptyForm(customerKind), initial),
  );

  useEffect(() => {
    setForm((prev) => mergeFormInitial(prev, initial));
  }, [
    initial?.companyName,
    initial?.contactPerson,
    initial?.phone,
    initial?.email,
    initial?.address,
    initial?.district,
    initial?.city,
    initial?.businessType,
    initial?.productType,
    initial?.productName,
    initial?.brand,
    initial?.model,
    initial?.serialNo,
    initial?.quantity,
    initial?.issueDescription,
    initial?.urgency,
    initial?.serviceDate,
    initial?.serviceTime,
    initial?.serviceMode,
    initial?.notes,
  ]);

  const set = <K extends keyof ServiceFormValues>(k: K, v: ServiceFormValues[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const setFullName = (name: string) => {
    setForm((p) => ({ ...p, contactPerson: name, companyName: name, businessType: "individual" }));
  };

  const handleFiles = async (files: FileList | null, kind: "photos" | "videos") => {
    if (!files) return;
    const list = [...files].slice(0, 4);
    for (const file of list) {
      if (file.size > MAX_FILE_SIZE) continue;
      const url = await fileToDataUrl(file);
      set(kind, [...form[kind], url] as ServiceFormValues[typeof kind]);
    }
  };

  const shareLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      set("location", { lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  };

  const prepareSubmit = (values: ServiceFormValues): ServiceFormValues => {
    if (!isIndividual) return values;
    const name = values.contactPerson.trim();
    return {
      ...values,
      contactPerson: name,
      companyName: name || values.companyName,
      businessType: "individual",
    };
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(prepareSubmit(form));
      }}
    >
      {isIndividual ? (
        <Section icon={User} title="Müşteri Bilgileri" desc="Bireysel müşteri iletişim ve adres bilgileri">
          {lockCompanyFields ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 bg-muted/40 p-4 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <ReadonlyField label="Ad Soyad" value={form.contactPerson || form.companyName} />
                <ReadonlyField label="Telefon" value={form.phone} />
                <ReadonlyField label="E-posta" value={form.email || "—"} />
                <ReadonlyField label="İlçe" value={form.district || "—"} />
                <ReadonlyField label="Adres" value={form.address} className="sm:col-span-2" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={shareLocation}>
                  <MapPin className="h-4 w-4 mr-2" /> Konum Paylaş
                </Button>
                {form.location && (
                  <span className="text-xs text-muted-foreground self-center">
                    Konum alındı ({form.location.lat.toFixed(4)}, {form.location.lng.toFixed(4)})
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Ad Soyad *" className="sm:col-span-2">
                <Input
                  required
                  value={form.contactPerson}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Örn. Ayşe Yılmaz"
                  autoComplete="name"
                />
              </Field>
              <Field label="Telefon *">
                <Input
                  required
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  autoComplete="tel"
                />
              </Field>
              <Field label="E-posta">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  autoComplete="email"
                />
              </Field>
              <Field label="İlçe *" className="sm:col-span-2">
                <Input required value={form.district} onChange={(e) => set("district", e.target.value)} />
              </Field>
              <Field label="Adres *" className="sm:col-span-2">
                <Textarea
                  required
                  rows={2}
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Mahalle, sokak, bina no..."
                />
              </Field>
              <div className="sm:col-span-2 flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={shareLocation}>
                  <MapPin className="h-4 w-4 mr-2" /> Konum Paylaş
                </Button>
                {form.location && (
                  <span className="text-xs text-muted-foreground self-center">
                    Konum alındı ({form.location.lat.toFixed(4)}, {form.location.lng.toFixed(4)})
                  </span>
                )}
              </div>
            </div>
          )}
        </Section>
      ) : (
      <Section
        icon={Building2}
        title="Firma Bilgileri"
        desc={
          lockCompanyFields
            ? "Kayıtlı işletme bilgileriniz otomatik kullanılıyor"
            : "Otel, restoran veya işletme bilgileriniz"
        }
      >
        {lockCompanyFields ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border/60 bg-muted/40 p-4 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <ReadonlyField label="Firma" value={form.companyName} />
              <ReadonlyField label="Yetkili" value={form.contactPerson} />
              <ReadonlyField label="Telefon" value={form.phone} />
              <ReadonlyField label="E-posta" value={form.email || "—"} />
              <ReadonlyField label="İşletme türü" value={BUSINESS_LABELS[form.businessType]} />
              <ReadonlyField label="İlçe" value={form.district || "—"} />
              <ReadonlyField label="Adres" value={form.address} className="sm:col-span-2" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={shareLocation}>
                <MapPin className="h-4 w-4 mr-2" /> Konum Paylaş
              </Button>
              {form.location && (
                <span className="text-xs text-muted-foreground self-center">
                  Konum alındı ({form.location.lat.toFixed(4)}, {form.location.lng.toFixed(4)})
                </span>
              )}
            </div>
          </div>
        ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Firma Adı *">
            <Input required value={form.companyName} onChange={(e) => set("companyName", e.target.value)} />
          </Field>
          <Field label="Yetkili Kişi *">
            <Input required value={form.contactPerson} onChange={(e) => set("contactPerson", e.target.value)} />
          </Field>
          <Field label="Telefon *">
            <Input required type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="E-posta">
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="İşletme Türü *">
            <Select value={form.businessType} onValueChange={(v) => set("businessType", v as BusinessType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CORPORATE_BUSINESS_TYPES.map((k) => (
                  <SelectItem key={k} value={k}>
                    {BUSINESS_LABELS[k]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="İlçe *">
            <Input required value={form.district} onChange={(e) => set("district", e.target.value)} />
          </Field>
          <Field label="Adres *" className="sm:col-span-2">
            <Textarea required rows={2} value={form.address} onChange={(e) => set("address", e.target.value)} />
          </Field>
          <div className="sm:col-span-2 flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={shareLocation}>
              <MapPin className="h-4 w-4 mr-2" /> Konum Paylaş
            </Button>
            {form.location && (
              <span className="text-xs text-muted-foreground self-center">
                Konum alındı ({form.location.lat.toFixed(4)}, {form.location.lng.toFixed(4)})
              </span>
            )}
          </div>
        </div>
        )}
      </Section>
      )}

      <Section
        icon={Package}
        title="Ürün Bilgileri"
        desc={isIndividual ? "Arızalı cihaz detayları" : "Arızalı ekipman detayları"}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Ürün Türü *">
            <Select value={form.productType} onValueChange={(v) => set("productType", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {productOptions.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Ürün Adı *">
            <Input required value={form.productName} onChange={(e) => set("productName", e.target.value)} />
          </Field>
          <Field label="Marka">
            <Input value={form.brand} onChange={(e) => set("brand", e.target.value)} />
          </Field>
          <Field label="Model">
            <Input value={form.model} onChange={(e) => set("model", e.target.value)} />
          </Field>
          <Field label="Seri Numarası">
            <Input value={form.serialNo} onChange={(e) => set("serialNo", e.target.value)} />
          </Field>
          <Field label="Adet *">
            <Input
              type="number"
              min={1}
              required
              value={form.quantity}
              onChange={(e) => set("quantity", parseInt(e.target.value, 10) || 1)}
            />
          </Field>
        </div>
      </Section>

      <Section icon={AlertCircle} title="Arıza Bilgileri" desc="Sorunu detaylı anlatın, görsel ekleyin">
        <div className="space-y-4">
          <Field label="Arıza Açıklaması *">
            <Textarea
              required
              rows={4}
              value={form.issueDescription}
              onChange={(e) => set("issueDescription", e.target.value)}
              placeholder="Belirtiler, hata kodları, ne zaman başladı..."
            />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Arıza Fotoğrafı">
              <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-6 cursor-pointer hover:bg-muted/50 transition">
                <Camera className="h-8 w-8 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Kamera / galeri ({form.photos.length}/4)</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  multiple
                  onChange={(e) => handleFiles(e.target.files, "photos")}
                />
              </label>
            </Field>
            <Field label="Video (opsiyonel)">
              <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-6 cursor-pointer hover:bg-muted/50 transition">
                <Video className="h-8 w-8 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Video yükle</span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files, "videos")}
                />
              </label>
            </Field>
          </div>
          <Field label="Aciliyet *">
            <div className="grid grid-cols-3 gap-2">
              {(["normal", "urgent", "critical"] as Urgency[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => set("urgency", u)}
                  className={cn(
                    "rounded-xl border-2 p-3 text-sm font-semibold transition",
                    form.urgency === u
                      ? u === "critical"
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-primary bg-primary/10 text-primary"
                      : "border-border",
                  )}
                >
                  {u === "normal" ? "Normal" : u === "urgent" ? "Acil" : "Kritik"}
                </button>
              ))}
            </div>
          </Field>
        </div>
      </Section>

      <Section icon={Calendar} title="Servis Planlama" desc="Tarih, saat ve servis tipi">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Servis Tarihi *">
            <Input
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              value={form.serviceDate}
              onChange={(e) => set("serviceDate", e.target.value)}
            />
          </Field>
          <Field label="Servis Saati *">
            <Select value={form.serviceTime} onValueChange={(v) => set("serviceTime", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Servis Tipi *" className="sm:col-span-2">
            <div className="grid sm:grid-cols-2 gap-2">
              {(
                [
                  {
                    v: "onsite" as ServiceMode,
                    l: "Yerinde Servis",
                    d: isIndividual ? "Teknisyen adresinize gelir" : "Teknisyen işletmenize gelir",
                  },
                  {
                    v: "workshop" as ServiceMode,
                    l: "Atölye Servisi",
                    d: "Ürün atölyeye alınır",
                  },
                ] as const
              ).map((o) => (
                <button
                  key={o.v}
                  type="button"
                  onClick={() => set("serviceMode", o.v)}
                  className={cn(
                    "rounded-xl border-2 p-4 text-left transition touch-manipulation",
                    form.serviceMode === o.v ? "border-primary bg-primary/5" : "border-border",
                  )}
                >
                  <p className="font-semibold text-sm">{o.l}</p>
                  <p className="text-xs text-muted-foreground">{o.d}</p>
                </button>
              ))}
            </div>
          </Field>
          <Field label="Garanti Durumu">
            <Select value={form.warrantyStatus} onValueChange={(v) => set("warrantyStatus", v as WarrantyStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Garanti kapsamında</SelectItem>
                <SelectItem value="no">Garanti dışı</SelectItem>
                <SelectItem value="unknown">Bilinmiyor</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="flex items-center gap-3 rounded-xl border border-border p-4">
            <Switch checked={form.previousService} onCheckedChange={(c) => set("previousService", c)} />
            <Label className="text-sm">Daha önce servis gördü mü?</Label>
          </div>
          <Field label="Notlar" className="sm:col-span-2">
            <Textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </Field>
        </div>
      </Section>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg" className="rounded-full px-8">
          {submitLabel}
        </Button>
        {showWhatsApp && (
          <Button type="button" variant="outline" size="lg" className="rounded-full" asChild>
            <a href={waLink(`Acil teknik destek — ${form.companyName}`)} target="_blank" rel="noreferrer">
              WhatsApp Destek
            </a>
          </Button>
        )}
        <Button type="button" variant="ghost" size="lg" className="rounded-full" asChild>
          <a href={`tel:${PHONE_TEL}`}>Hemen Ara</a>
        </Button>
      </div>
    </form>
  );
}

export function formToTicketInput(form: ServiceFormValues, companyId = ""): TicketInput {
  return {
    companyId,
    companyName: form.companyName,
    contactPerson: form.contactPerson,
    phone: form.phone,
    email: form.email,
    address: form.address,
    district: form.district,
    city: form.city,
    businessType: form.businessType,
    productType: form.productType,
    productName: form.productName,
    brand: form.brand,
    model: form.model,
    serialNo: form.serialNo,
    quantity: form.quantity,
    issueDescription: form.issueDescription,
    photos: form.photos,
    videos: form.videos,
    urgency: form.urgency,
    serviceDate: form.serviceDate,
    serviceTime: form.serviceTime,
    serviceMode: form.serviceMode,
    warrantyStatus: form.warrantyStatus,
    previousService: form.previousService,
    notes: form.notes,
    location: form.location,
  };
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
    <Card className="border-border/60 shadow-sm bg-card/80 backdrop-blur">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{desc}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
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

function ReadonlyField({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}

