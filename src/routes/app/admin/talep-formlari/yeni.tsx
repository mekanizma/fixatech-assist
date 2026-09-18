import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FileDown } from "lucide-react";
import { toast } from "sonner";
import { AdminTalepForm } from "@/components/service-desk/AdminTalepForm";
import { Button } from "@/components/ui/button";
import { useCreateFormSubmission } from "@/hooks/use-form-submissions";
import {
  talepFormCode,
  techFormToCreateInput,
  techFormToTalepPdf,
  type TechServiceFormState,
} from "@/lib/form-submissions/talep-form";
import { openBlankTalepFormPdf, openTalepFormPdf } from "@/lib/service-desk/pdf";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export const Route = createFileRoute("/app/admin/talep-formlari/yeni")({
  component: AdminNewTalepFormPage,
});

function AdminNewTalepFormPage() {
  const navigate = useNavigate();
  const create = useCreateFormSubmission();

  const downloadForm = (form: TechServiceFormState, code?: string) => {
    openTalepFormPdf(techFormToTalepPdf(form, code));
  };

  const goToList = () => {
    navigate({ to: "/app/admin/talep-formlari" });
  };

  const handleSaveAndDownload = (form: TechServiceFormState) => {
    if (!isSupabaseConfigured()) {
      toast.error("Supabase yapılandırılmamış — form indirildi, kaydedilemedi.");
      downloadForm(form);
      goToList();
      return;
    }

    create.mutate(
      techFormToCreateInput(form, {
        source: "admin",
        status: "read",
        notes: "Admin panelinden oluşturuldu",
      }),
      {
        onSuccess: (saved) => {
          downloadForm(form, saved ? talepFormCode(saved.id) : undefined);
          toast.success("Talep formu kaydedildi");
          goToList();
        },
        onError: () => {
          toast.error("Form kaydedilemedi. Sadece indir ile PDF alabilirsiniz.");
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
          <h1 className="text-2xl font-display font-bold">Yeni Talep Formu</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Formu doldurup kaydedin. Yazdırma penceresinden PDF alıp Talep Formları listesine dönersiniz.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => openBlankTalepFormPdf()}
        >
          <FileDown className="h-4 w-4 mr-1.5" />
          Boş form
        </Button>
      </div>

      <AdminTalepForm
        saving={create.isPending}
        onSaveAndDownload={handleSaveAndDownload}
        onDownloadOnly={(form) => {
          downloadForm(form);
          toast.success("Yazdırma penceresi açıldı");
          goToList();
        }}
      />
    </div>
  );
}
