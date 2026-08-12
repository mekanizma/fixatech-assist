import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ServiceRequestForm,
  companyToFormDefaults,
  formToTicketInput,
  ticketToFormDefaults,
} from "@/components/service-desk/ServiceRequestForm";
import { useAuth } from "@/lib/service-desk/auth";
import { createTicket, getCompany, linkProfileToCompany, upsertCompany, emptyDeskData } from "@/lib/service-desk/api";
import { deskKeys } from "@/lib/service-desk/query-keys";
import { useDeskData } from "@/hooks/use-desk-data";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { ServiceDeskData } from "@/lib/service-desk/types";

export const Route = createFileRoute("/app/musteri/yeni")({
  component: NewTicketPage,
});

function NewTicketPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const desk = useDeskData();

  const companyFromDesk = user?.companyId
    ? desk.companies.find((c) => c.id === user.companyId)
    : undefined;

  const { data: companyFetched } = useQuery({
    queryKey: ["desk", "company", user?.companyId],
    queryFn: () => getCompany(user!.companyId!),
    enabled: !!user?.companyId && isSupabaseConfigured() && !companyFromDesk,
  });

  const company = companyFromDesk ?? companyFetched;

  const lastTicket = useMemo(() => {
    if (!user) return undefined;
    return desk.tickets.find(
      (t) => t.companyId === user.companyId || t.createdByUserId === user.id,
    );
  }, [desk.tickets, user]);

  const companyInitial = useMemo(() => {
    if (company) return companyToFormDefaults(company);
    if (lastTicket) return ticketToFormDefaults(lastTicket);
    if (user) {
      return {
        contactPerson: user.name,
        email: user.email,
        phone: user.phone ?? "",
      };
    }
    return undefined;
  }, [company, lastTicket, user]);

  const lockCompanyFields = !!company;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Yeni Servis Talebi</h1>
        <p className="text-muted-foreground text-sm">
          Otel, restoran veya işletmeniz için teknik servis kaydı oluşturun
        </p>
      </div>
      <ServiceRequestForm
        key={company?.id ?? user?.companyId ?? user?.id ?? "guest"}
        initial={companyInitial}
        lockCompanyFields={lockCompanyFields}
        submitLabel="Talebi Kaydet"
        showWhatsApp
        onSubmit={async (form) => {
          if (!user) return;
          try {
            const companyId = user.companyId ?? company?.id ?? crypto.randomUUID();
            if (!user.companyId && !company) {
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
              await linkProfileToCompany(user.id, companyId);
            }
            const ticket = await createTicket(
              { ...formToTicketInput(form, companyId), createdByUserId: user.id },
              { id: user.id, name: user.name },
            );
            qc.setQueryData<ServiceDeskData>(deskKeys.all, (old) => {
              const base = old ?? emptyDeskData;
              return {
                ...base,
                tickets: [ticket, ...base.tickets.filter((t) => t.id !== ticket.id)],
              };
            });
            await qc.invalidateQueries({ queryKey: deskKeys.all });
            toast.success("Servis kaydı oluşturuldu", { description: ticket.code });
            navigate({ to: "/app/musteri/kayitlar/$ticketId", params: { ticketId: ticket.id } });
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Kayıt oluşturulamadı");
          }
        }}
      />
    </div>
  );
}
