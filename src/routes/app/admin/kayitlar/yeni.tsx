import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, type ComponentType } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Building2, ChevronRight, FileText, User } from "lucide-react";
import {
  ServiceRequestForm,
  formToTicketInput,
  type ServiceFormValues,
} from "@/components/service-desk/ServiceRequestForm";
import { useAuth } from "@/lib/service-desk/auth";
import { createTicket, upsertCompany, emptyDeskData } from "@/lib/service-desk/api";
import { deskKeys } from "@/lib/service-desk/query-keys";
import { fetchFormSubmissionById, updateFormSubmissionStatus } from "@/lib/form-submissions/api";
import { formSubmissionKeys } from "@/lib/form-submissions/query-keys";
import { submissionToServiceForm } from "@/lib/form-submissions/to-service-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { CustomerKind, ServiceDeskData } from "@/lib/service-desk/types";
import { cn } from "@/lib/utils";

type Search = {
  from?: string;
  tur?: CustomerKind;
};

export const Route = createFileRoute("/app/admin/kayitlar/yeni")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    from: typeof search.from === "string" && search.from.length > 0 ? search.from : undefined,
    tur:
      search.tur === "bireysel" || search.tur === "kurumsal"
        ? search.tur
        : undefined,
  }),
  component: AdminNewTicketPage,
});

function AdminNewTicketPage() {
  const { from, tur } = Route.useSearch();
  const customerKind: CustomerKind | undefined = from ? "kurumsal" : tur;

  if (!customerKind) {
    return <CustomerKindPicker />;
  }

  return <AdminTicketForm customerKind={customerKind} from={from} />;
}

function CustomerKindPicker() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 px-1">
      <div className="flex flex-wrap items-start gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/app/admin/kayitlar">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Geri
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-display font-bold">Yeni Servis Kaydı</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Müşteri türünü seçin — kayıt ekranları farklıdır
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4">
        <KindCard
          to="/app/admin/kayitlar/yeni"
          search={{ tur: "bireysel" }}
          icon={User}
          title="Bireysel"
          description="Ev / kişisel müşteri — ad soyad, telefon ve adres bilgileri"
        />
        <KindCard
          to="/app/admin/kayitlar/yeni"
          search={{ tur: "kurumsal" }}
          icon={Building2}
          title="Kurumsal"
          description="Firma / işletme — otel, restoran, kafe ve kurumsal kayıt"
        />
      </div>
    </div>
  );
}

function KindCard({
  to,
  search,
  icon: Icon,
  title,
  description,
}: {
  to: "/app/admin/kayitlar/yeni";
  search: Search;
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      search={search}
      className={cn(
        "group flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-4 sm:p-5",
        "shadow-sm transition touch-manipulation",
        "hover:border-primary/50 hover:bg-primary/[0.03] active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-14 sm:w-14">
        <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display font-bold text-lg leading-tight">{title}</p>
        <p className="text-sm text-muted-foreground mt-1 leading-snug">{description}</p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition group-hover:text-primary group-hover:translate-x-0.5" />
    </Link>
  );
}

function AdminTicketForm({
  customerKind,
  from,
}: {
  customerKind: CustomerKind;
  from?: string;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isIndividual = customerKind === "bireysel";

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

      qc.setQueryData<ServiceDeskData>(deskKeys.all, (old) => {
        const base = old ?? emptyDeskData;
        return {
          ...base,
          tickets: [ticket, ...base.tickets.filter((t) => t.id !== ticket.id)],
        };
      });
      await qc.invalidateQueries({ queryKey: deskKeys.all });
      toast.success("Servis kaydı oluşturuldu", { description: ticket.code });
      navigate({ to: "/app/admin/kayitlar/$ticketId", params: { ticketId: ticket.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kayıt oluşturulamadı");
    }
  };

  const backLink = from ? (
    <Button variant="ghost" size="sm" asChild>
      <Link to="/app/admin/talep-formlari">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Geri
      </Link>
    </Button>
  ) : (
    <Button variant="ghost" size="sm" asChild>
      <Link to="/app/admin/kayitlar/yeni" search={{}}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Geri
      </Link>
    </Button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-1">
      <div className="flex flex-wrap items-start gap-4">
        {backLink}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-display font-bold">
              {isIndividual ? "Bireysel Servis Kaydı" : "Kurumsal Servis Kaydı"}
            </h1>
            <Badge variant="secondary">{isIndividual ? "Bireysel" : "Kurumsal"}</Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {from
              ? "Talep formundaki bilgiler otomatik dolduruldu. Kaydedince Servis Kayıtları listesine eklenir."
              : isIndividual
                ? "Bireysel müşteri için teknik servis kaydı oluşturun"
                : "Firma / işletme için teknik servis kaydı oluşturun"}
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
          key={
            from && submission
              ? `from-${submission.id}`
              : from
                ? "from-loading"
                : customerKind
          }
          initial={initial}
          customerKind={customerKind}
          lockCompanyFields={false}
          submitLabel="Servis Kaydını Oluştur"
          showWhatsApp={false}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
