import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FileText, Eye, Plus, Download, FileDown, FileSpreadsheet } from "lucide-react";
import { useFormSubmissions, useUpdateFormSubmissionStatus } from "@/hooks/use-form-submissions";
import { FormSubmissionDetail } from "@/components/service-desk/FormSubmissionDetail";
import { DeleteFormSubmissionButton } from "@/components/service-desk/DeleteFormSubmissionButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { FormSubmission, FormSubmissionStatus, FormSubmissionType } from "@/lib/form-submissions/types";
import { toast } from "sonner";
import {
  openBlankTalepFormPdf,
  openBlankTeklifFormPdf,
  openTalepFormPdf,
  openTeklifFormPdf,
} from "@/lib/service-desk/pdf";
import { submissionToTalepPdf } from "@/lib/form-submissions/talep-form";
import { submissionToTeklifPdf } from "@/lib/form-submissions/teklif-form";

export const Route = createFileRoute("/app/admin/talep-formlari/")({
  component: AdminFormSubmissions,
});

const TYPE_LABELS: Record<FormSubmissionType, string> = {
  tech_service: "Teknik Servis",
  contact: "İletişim",
  quote: "Teklif",
};

const STATUS_LABELS: Record<FormSubmissionStatus, string> = {
  new: "Yeni",
  read: "Okundu",
  converted: "Kayda dönüştürüldü",
  archived: "Arşiv",
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

function downloadSubmissionPdf(s: FormSubmission) {
  if (s.type === "quote") {
    openTeklifFormPdf(submissionToTeklifPdf(s));
    return;
  }
  openTalepFormPdf(submissionToTalepPdf(s));
}

function AdminFormSubmissions() {
  const { data: submissions = [], isLoading, isError } = useFormSubmissions();
  const updateStatus = useUpdateFormSubmissionStatus();
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<FormSubmissionType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<FormSubmissionStatus | "all">("all");
  const [selected, setSelected] = useState<FormSubmission | null>(null);

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      const matchQ =
        !q ||
        s.summary.toLowerCase().includes(q.toLowerCase()) ||
        s.contactName.toLowerCase().includes(q.toLowerCase()) ||
        s.contactPhone.includes(q) ||
        s.companyName.toLowerCase().includes(q.toLowerCase());
      const matchType = typeFilter === "all" || s.type === typeFilter;
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchQ && matchType && matchStatus;
    });
  }, [submissions, q, typeFilter, statusFilter]);

  const newCount = submissions.filter((s) => s.status === "new").length;

  const patchSelected = (patch: Partial<FormSubmission>) => {
    setSelected((prev) => (prev ? { ...prev, ...patch } : null));
  };

  const handleStatusChange = (status: FormSubmissionStatus, notes?: string) => {
    if (!selected) return;
    updateStatus.mutate(
      { id: selected.id, status, notes },
      {
        onSuccess: () => {
          patchSelected({ status, ...(notes !== undefined ? { notes } : {}) });
          toast.success(`Durum: ${STATUS_LABELS[status]}`);
        },
        onError: () => toast.error("Durum güncellenemedi"),
      },
    );
  };

  const handleNotesSave = (notes: string) => {
    if (!selected) return;
    updateStatus.mutate(
      { id: selected.id, status: selected.status, notes },
      {
        onSuccess: () => {
          patchSelected({ notes });
          toast.success("Not kaydedildi");
        },
        onError: () => toast.error("Not kaydedilemedi"),
      },
    );
  };

  const openDetail = (s: FormSubmission) => {
    const next = s.status === "new" ? { ...s, status: "read" as const } : s;
    setSelected(next);
    if (s.status === "new") {
      updateStatus.mutate(
        { id: s.id, status: "read" },
        { onError: () => patchSelected({ status: "new" }) },
      );
    }
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className="space-y-6">
        <TalepFormlariHeader newCount={0} />
        <TeklifFormuSection />
        <div className="rounded-xl border border-border/60 bg-card p-8 text-center">
          <p className="font-semibold">Supabase yapılandırılmamış</p>
          <p className="text-sm text-muted-foreground mt-2">
            Form kaydı için .env içinde VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY gerekir. Boş formu yine indirebilirsiniz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TalepFormlariHeader newCount={newCount} />
      <TeklifFormuSection />

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="İsim, firma, telefon ara..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs w-full sm:w-auto"
        />
        <select
          className="rounded-lg border border-input bg-background px-3 text-sm h-10 w-full sm:w-auto"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as FormSubmissionType | "all")}
        >
          <option value="all">Tüm türler</option>
          <option value="tech_service">Teknik Servis</option>
          <option value="contact">İletişim</option>
          <option value="quote">Teklif</option>
        </select>
        <select
          className="rounded-lg border border-input bg-background px-3 text-sm h-10 w-full sm:w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as FormSubmissionStatus | "all")}
        >
          <option value="all">Tüm durumlar</option>
          {(Object.keys(STATUS_LABELS) as FormSubmissionStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-muted-foreground text-sm">Yükleniyor...</p>}
      {isError && (
        <p className="text-destructive text-sm">
          Formlar yüklenemedi. Supabase migration 004_form_submissions.sql çalıştırıldı mı kontrol edin.
        </p>
      )}

      <div className="rounded-xl border border-border/60 overflow-x-auto bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarih</TableHead>
              <TableHead>Tür</TableHead>
              <TableHead>Özet</TableHead>
              <TableHead>İletişim</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="w-[148px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  Henüz kayıtlı talep formu yok.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow
                  key={s.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => openDetail(s)}
                >
                  <TableCell className="text-xs whitespace-nowrap">{formatDate(s.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1">
                      <Badge variant="outline">{TYPE_LABELS[s.type]}</Badge>
                      {s.payload?.source === "admin" && (
                        <Badge variant="secondary">Panel</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate font-medium">{s.summary}</TableCell>
                  <TableCell className="text-sm">
                    <div>{s.contactName || "—"}</div>
                    {s.contactPhone && <div className="text-muted-foreground text-xs">{s.contactPhone}</div>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={s.status === "new" ? "default" : "secondary"}>{STATUS_LABELS[s.status]}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-0.5" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        title="PDF indir"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadSubmissionPdf(s);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        title="Detay"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(s);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DeleteFormSubmissionButton
                        variant="icon"
                        submissionId={s.id}
                        summary={s.summary || s.contactName}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto p-0">
          {selected && (
            <>
              <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/60 sticky top-0 bg-background z-10">
                <SheetTitle className="font-display text-left text-xl pr-8">{selected.summary}</SheetTitle>
                <p className="text-sm text-muted-foreground text-left">
                  {selected.type === "quote" ? "Teklif detayı — işlem yapın" : "Talep detayı — işlem yapın"}
                </p>
              </SheetHeader>
              <div className="px-6">
                <FormSubmissionDetail
                  submission={selected}
                  onStatusChange={handleStatusChange}
                  onNotesSave={handleNotesSave}
                  onDeleted={() => setSelected(null)}
                  isUpdating={updateStatus.isPending}
                />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function TalepFormlariHeader({ newCount }: { newCount: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-display font-bold flex items-center gap-2">
          <FileText className="h-7 w-7 text-primary" />
          Talep Formları
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gelen talepleri inceleyin, form oluşturun ve indirin
          {newCount > 0 && (
            <Badge variant="default" className="ml-2">
              {newCount} yeni
            </Badge>
          )}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
        <Button
          type="button"
          variant="outline"
          className="rounded-full flex-1 sm:flex-none min-h-11"
          onClick={() => openBlankTalepFormPdf()}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Boş form
        </Button>
        <Button asChild className="rounded-full flex-1 sm:flex-none min-h-11">
          <Link to="/app/admin/talep-formlari/yeni">
            <Plus className="h-4 w-4 mr-2" /> Yeni Form
          </Link>
        </Button>
      </div>
    </div>
  );
}

function TeklifFormuSection() {
  return (
    <section className="rounded-xl border border-border/60 bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
            <FileSpreadsheet className="h-5 w-5 text-amber-700" />
          </div>
          <div className="min-w-0">
            <h2 className="font-display font-bold text-lg">Teklif Formu</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Boş teklif indirin veya kalemleri doldurup PDF olarak kaydedin.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            className="rounded-full flex-1 sm:flex-none min-h-11"
            onClick={() => openBlankTeklifFormPdf()}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Boş teklif
          </Button>
          <Button asChild className="rounded-full flex-1 sm:flex-none min-h-11">
            <Link to="/app/admin/talep-formlari/teklif">
              <Plus className="h-4 w-4 mr-2" /> Yeni teklif
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
