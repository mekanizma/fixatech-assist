import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ServiceRequestForm, formToTicketInput } from "@/components/service-desk/ServiceRequestForm";
import { useAuth } from "@/lib/service-desk/auth";
import { createTicket, getCompany, upsertCompany } from "@/lib/service-desk/store";
import { toast } from "sonner";
import { uid } from "@/lib/service-desk/utils";

export const Route = createFileRoute("/app/musteri/yeni")({
  component: NewTicketPage,
});

function NewTicketPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const company = user?.companyId ? getCompany(user.companyId) : undefined;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Yeni Servis Talebi</h1>
        <p className="text-muted-foreground text-sm">Otel, restoran veya işletmeniz için teknik servis kaydı oluşturun</p>
      </div>
      <ServiceRequestForm
        initial={
          company
            ? {
                companyName: company.name,
                contactPerson: company.contactPerson,
                phone: company.phone,
                email: company.email,
                address: company.address,
                district: company.district,
                city: company.city,
                businessType: company.type,
              }
            : undefined
        }
        submitLabel="Talebi Kaydet"
        showWhatsApp
        onSubmit={(form) => {
          if (!user) return;
          const companyId = user.companyId ?? uid("c");
          if (!user.companyId) {
            upsertCompany({
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
          }
          const ticket = createTicket(
            { ...formToTicketInput(form, companyId), createdByUserId: user.id },
            { id: user.id, name: user.name },
          );
          toast.success("Servis kaydı oluşturuldu", { description: ticket.code });
          navigate({ to: "/app/musteri/kayitlar/$ticketId", params: { ticketId: ticket.id } });
        }}
      />
    </div>
  );
}
