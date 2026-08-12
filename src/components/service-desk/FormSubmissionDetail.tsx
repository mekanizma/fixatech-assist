import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  User,
  Building2,
  Phone,
  Mail,
  Package,
  MapPin,
  Calendar,
  Clock,
  Truck,
  AlertTriangle,
  MessageSquare,
  Wrench,
  MessageCircle,
  CheckCircle2,
  Archive,
  ClipboardList,
  Copy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { PHONE_TEL, waLink } from "@/lib/site";
import {
  asContactPayload,
  asTechPayload,
  deliveryLabel,
  payloadDisplay,
  payloadStr,
  urgencyLabel,
} from "@/lib/form-submissions/display";
import type { FormSubmission, FormSubmissionStatus, FormSubmissionType } from "@/lib/form-submissions/types";
import { toast } from "sonner";

const TYPE_LABELS: Record<FormSubmissionType, string> = {
  tech_service: "Teknik Servis",
  contact: "İletişim",
};

const STATUS_LABELS: Record<FormSubmissionStatus, string> = {
  new: "Yeni",
  read: "Okundu",
  converted: "Kayda dönüştürüldü",
  archived: "Arşiv",
};

const STATUS_VARIANT: Record<FormSubmissionStatus, "default" | "secondary" | "outline" | "destructive"> = {
  new: "default",
  read: "secondary",
  converted: "outline",
  archived: "secondary",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function FieldRow({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  if (!value || value === "—") return null;
  return (
    <div className="grid grid-cols-[minmax(0,7.5rem)_1fr] gap-2 py-2 border-b border-border/40 last:border-0">
      <dt className="flex items-start gap-1.5 text-xs font-medium text-muted-foreground pt-0.5">
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0 mt-0.5" />}
        {label}
      </dt>
      <dd className={`text-sm ${highlight ? "font-medium text-foreground" : "text-foreground/90"}`}>{value}</dd>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border/60 bg-muted/20 overflow-hidden">
      <h3 className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary bg-primary/5 border-b border-border/40">
        {title}
      </h3>
      <dl className="px-4 py-1">{children}</dl>
    </section>
  );
}

type Props = {
  submission: FormSubmission;
  onStatusChange: (status: FormSubmissionStatus, notes?: string) => void;
  onNotesSave: (notes: string) => void;
  isUpdating?: boolean;
};

export function FormSubmissionDetail({ submission, onStatusChange, onNotesSave, isUpdating }: Props) {
  const [notes, setNotes] = useState(submission.notes);
  const [status, setStatus] = useState(submission.status);

  useEffect(() => {
    setNotes(submission.notes);
    setStatus(submission.status);
  }, [submission.id, submission.notes, submission.status]);

  const phone = submission.contactPhone || payloadStr(submission.payload, "phone");
  const telHref = phone ? `tel:${phone.replace(/\s/g, "")}` : undefined;

  const copyPhone = () => {
    if (!phone) return;
    void navigator.clipboard.writeText(phone);
    toast.success("Telefon kopyalandı");
  };

  const applyStatus = (next: FormSubmissionStatus) => {
    setStatus(next);
    onStatusChange(next);
  };

  const p = submission.payload;
  const isTech = submission.type === "tech_service";
  const tech = asTechPayload(p);
  const contact = asContactPayload(p);

  return (
    <div className="space-y-5 pb-6">
      {/* Üst: durum ve hızlı işlemler */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABELS[status]}</Badge>
        <Badge variant="outline">{TYPE_LABELS[submission.type]}</Badge>
        <span className="text-xs text-muted-foreground ml-auto">{formatDate(submission.createdAt)}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {telHref && (
          <Button size="sm" variant="default" className="rounded-full" asChild>
            <a href={telHref}>
              <Phone className="h-4 w-4 mr-1" /> Ara
            </a>
          </Button>
        )}
        <Button size="sm" variant="outline" className="rounded-full" asChild>
          <a href={waLink(submission.whatsappMessage)} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4 mr-1 text-success" /> WhatsApp
          </a>
        </Button>
        {phone && (
          <Button size="sm" variant="ghost" className="rounded-full" type="button" onClick={copyPhone}>
            <Copy className="h-4 w-4 mr-1" /> Kopyala
          </Button>
        )}
        {isTech && (
          <Button size="sm" variant="outline" className="rounded-full" asChild>
            <Link to="/app/admin/kayitlar/yeni" search={{ from: submission.id, tur: "kurumsal" }}>
              <ClipboardList className="h-4 w-4 mr-1" /> Servis kaydı aç
            </Link>
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="submission-status" className="text-xs font-semibold">
          Talep durumu
        </Label>
        <select
          id="submission-status"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm h-10"
          value={status}
          disabled={isUpdating}
          onChange={(e) => applyStatus(e.target.value as FormSubmissionStatus)}
        >
          {(Object.keys(STATUS_LABELS) as FormSubmissionStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <Separator />

      {isTech ? (
        <>
          <SectionCard title="İletişim Bilgileri">
            <FieldRow icon={User} label="Ad Soyad" value={payloadDisplay(p, "name")} highlight />
            <FieldRow icon={Building2} label="Firma" value={payloadDisplay(p, "company")} />
            <FieldRow icon={Phone} label="Telefon" value={payloadDisplay(p, "phone")} highlight />
            <FieldRow icon={Mail} label="E-posta" value={payloadDisplay(p, "email")} />
          </SectionCard>

          <SectionCard title="Ürün Bilgileri">
            <FieldRow icon={Package} label="Ürün Adı" value={payloadDisplay(p, "productName")} highlight />
            <FieldRow icon={Wrench} label="Kategori" value={payloadDisplay(p, "category")} />
            <FieldRow icon={Package} label="Adet" value={payloadDisplay(p, "quantity")} />
            <FieldRow icon={Building2} label="Marka" value={payloadDisplay(p, "brand")} />
            <FieldRow icon={Package} label="Model" value={payloadDisplay(p, "model")} />
            <FieldRow icon={Package} label="Seri No" value={payloadDisplay(p, "serialNo")} />
          </SectionCard>

          <SectionCard title="Arıza / Talep">
            <div className="py-3">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                {tech.issue || "—"}
              </p>
            </div>
          </SectionCard>

          <SectionCard title="Adres Bilgileri">
            <FieldRow icon={MapPin} label="Açık Adres" value={payloadDisplay(p, "address")} />
            <FieldRow icon={MapPin} label="İlçe" value={payloadDisplay(p, "district")} />
          </SectionCard>

          <SectionCard title="Servis Planlama">
            <FieldRow
              icon={Truck}
              label="Servis Tipi"
              value={tech.delivery ? deliveryLabel(tech.delivery) : "—"}
              highlight
            />
            <FieldRow icon={Calendar} label="İşlem Tarihi" value={payloadDisplay(p, "pickupDate")} />
            <FieldRow icon={Clock} label="İşlem Saati" value={payloadDisplay(p, "pickupTime")} />
            <FieldRow
              icon={AlertTriangle}
              label="Öncelik"
              value={tech.urgency ? urgencyLabel(tech.urgency) : "—"}
              highlight={tech.urgency === "emergency" || tech.urgency === "urgent"}
            />
          </SectionCard>

          {payloadStr(p, "notes") && (
            <SectionCard title="Ek Notlar">
              <div className="py-3">
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">{tech.notes}</p>
              </div>
            </SectionCard>
          )}
        </>
      ) : (
        <>
          <SectionCard title="İletişim Formu">
            <FieldRow icon={User} label="Ad Soyad" value={payloadDisplay(p, "name")} highlight />
            <FieldRow icon={Building2} label="Firma" value={payloadDisplay(p, "company")} />
            <FieldRow icon={Wrench} label="Hizmet" value={payloadDisplay(p, "service")} highlight />
          </SectionCard>
          <SectionCard title="Mesaj">
            <div className="py-3">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{contact.message || "—"}</p>
            </div>
          </SectionCard>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="admin-notes" className="text-xs font-semibold">
          Dahili not (sadece panel)
        </Label>
        <Textarea
          id="admin-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Görüşme notu, atanan teknisyen, randevu onayı..."
          className="resize-none text-sm"
        />
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={isUpdating}
          onClick={() => onNotesSave(notes)}
        >
          Notu kaydet
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          size="sm"
          variant="outline"
          disabled={isUpdating || status === "read"}
          onClick={() => applyStatus("read")}
        >
          <CheckCircle2 className="h-4 w-4 mr-1" /> Okundu
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={isUpdating || status === "converted"}
          onClick={() => applyStatus("converted")}
        >
          Kayda dönüştürüldü
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={isUpdating || status === "archived"}
          onClick={() => applyStatus("archived")}
        >
          <Archive className="h-4 w-4 mr-1" /> Arşivle
        </Button>
      </div>

      <details className="rounded-lg border border-border/40 bg-muted/10 text-xs">
        <summary className="cursor-pointer px-3 py-2 text-muted-foreground font-medium">WhatsApp metni (ham)</summary>
        <pre className="px-3 pb-3 whitespace-pre-wrap text-muted-foreground">{submission.whatsappMessage}</pre>
      </details>
    </div>
  );
}
