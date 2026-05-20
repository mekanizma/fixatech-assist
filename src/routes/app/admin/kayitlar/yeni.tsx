import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FileText } from "lucide-react";
import {
  ServiceRequestForm,
  formToTicketInput,
  type ServiceFormValues,
} from "@/components/service-desk/ServiceRequestForm";
import { useAuth } from "@/lib/service-desk/auth";
import { createTicket, upsertCompany } from "@/lib/service-desk/api";
import { deskKeys } from "@/lib/service-desk/query-keys";
import { fetchFormSubmissionById, updateFormSubmissionStatus } from "@/lib/form-submissions/api";
import { formSubmissionKeys } from "@/lib/form-submissions/query-keys";
import { submissionToServiceForm } from "@/lib/form-submissions/to-service-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Search = {
  from?: string;
};

export const Route = createFileRoute("/app/admin/kayitlar/yeni")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    from: typeof search.from === "string" && search.from.length > 0 ? search.from : undefined,
  }),
  component: AdminNewTicketPage,
});

function AdminNewTicketPage() {
  const { from } = Route.useSearch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: submission, isLoading, isError } = useQuery({
    queryKey: [...formSubmissionKeys.all, "one", from] as const,
    queryFn: () => fetchFormSubmissionById(from!),
    enabled: !!from,
  });

  const initial = useMemo(
    () => (submission ? submissionToServiceForm(submission) : undefined),
    [submission],
  );

  const handleSubmit = async (form: ServiceFormValues) => {
    if (!user) return;
    try {
      const companyId = crypto.randomUUID();
      await upsertCompany({
        id: companyId,
        name: form.companyName,
        contactPerson: form.contactPerson,
        phone: form.phone,
        email: form.email,
        address: form.address,
        district: form.district,
        city: form.city,
        type: form.businessType,
      });

      const ticket = await createTicket(
        { ...formToTicketInput(form, companyId), createdByUserId: user.id },
        { id: user.id, name: user.name },
      );

      if (from) {
        await updateFormSubmissionStatus(
          from,
          "converted",
          `Servis kaydı oluşturuldu: ${ticket.code}`,
        );
        await qc.invalidateQueries({ queryKey: formSubmissionKeys.all });
      }

      await qc.invalidateQueries({ queryKey: deskKeys.all });
      toast.success("Servis kaydı oluşturuldu", { description: ticket.code });
      navigate({ to: "/app/admin/kayitlar/$ticketId", params: { ticketId: ticket.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kayıt oluşturulamadı");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-start gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to={from ? "/app/admin/talep-formlari" : "/app/admin/kayitlar"}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Geri
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-display font-bold">Servis Kaydı Oluştur</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {from
              ? "Talep formundaki bilgiler otomatik dolduruldu. Kaydedince Servis Kayıtları listesine eklenir."
              : "Yeni teknik servis kaydı oluşturun"}
          </p>
        </div>
        {from && submission && (
          <Badge variant="outline" className="gap-1">
            <FileText className="h-3.5 w-3.5" />
            Talep formundan
          </Badge>
        )}
      </div>

      {from && isLoading && <p className="text-sm text-muted-foreground">Talep formu yükleniyor...</p>}
      {from && isError && (
        <p className="text-sm text-destructive">Talep formu yüklenemedi. Manuel doldurup kaydedebilirsiniz.</p>
      )}

      {(!from || submission || isError) && (
        <ServiceRequestForm
          key={from && submission ? `from-${submission.id}` : from ? "from-loading" : "manual"}
          initial={initial}
          lockCompanyFields={false}
          submitLabel="Servis Kaydını Oluştur"
          showWhatsApp={false}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
