import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FileDown } from "lucide-react";
import { toast } from "sonner";
import { AdminTeklifForm } from "@/components/service-desk/AdminTeklifForm";
import { Button } from "@/components/ui/button";
import { useCreateFormSubmission } from "@/hooks/use-form-submissions";
import {
  ADMIN_TEKLIF_DRAFT_KEY,
  clearPersistedFormDraft,
} from "@/hooks/use-persisted-form-state";
import {
  teklifFormCode,
  teklifFormToCreateInput,
  teklifFormToPdf,
  type TeklifFormState,
} from "@/lib/form-submissions/teklif-form";
import { openBlankTeklifFormPdf, openTeklifFormPdf } from "@/lib/service-desk/pdf";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export const Route = createFileRoute("/app/admin/talep-formlari/teklif")({
  component: AdminTeklifFormPage,
});

function AdminTeklifFormPage() {
  const navigate = useNavigate();
  const create = useCreateFormSubmission();

  const downloadForm = (form: TeklifFormState, code?: string) => {
    openTeklifFormPdf(teklifFormToPdf(form, code));
  };

  const finish = () => {
    clearPersistedFormDraft(ADMIN_TEKLIF_DRAFT_KEY);
    navigate({ to: "/app/admin/talep-formlari" });
  };

  const handleSaveAndDownload = (form: TeklifFormState) => {
    if (!isSupabaseConfigured()) {
      toast.error("Supabase yapılandırılmamış — teklif indirildi, kaydedilemedi.");
      downloadForm(form);
      finish();
      return;
    }

    create.mutate(
      teklifFormToCreateInput(form, {
        source: "admin",
        status: "read",
        notes: "Admin panelinden oluşturuldu",
      }),
      {
        onSuccess: (saved) => {
          downloadForm(form, saved ? teklifFormCode(saved.id) : undefined);
          toast.success("Teklif formu kaydedildi");
          finish();
        },
        onError: () => {
          toast.error("Teklif kaydedilemedi. Sadece indir ile PDF alabilirsiniz.");
        },
      },
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-1">
      <div className="flex flex-wrap items-start gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/app/admin/talep-formlari">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Geri
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-display font-bold">Teklif Formu</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Kalemleri doldurup kaydedin veya yazdırma penceresinden PDF indirin.
            Yazdığınız bilgiler otomatik saklanır.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full min-h-10"
          onClick={() => openBlankTeklifFormPdf()}
        >
          <FileDown className="h-4 w-4 mr-1.5" />
          Boş teklif
        </Button>
      </div>

      <AdminTeklifForm
        saving={create.isPending}
        onSaveAndDownload={handleSaveAndDownload}
        onDownloadOnly={(form) => {
          downloadForm(form);
          toast.success("Yazdırma penceresi açıldı");
          finish();
        }}
      />
    </div>
  );
}
