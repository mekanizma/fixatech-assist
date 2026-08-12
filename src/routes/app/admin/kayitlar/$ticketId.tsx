import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { TicketDetailView } from "@/components/service-desk/TicketDetailView";
import { TicketPricingPanel } from "@/components/service-desk/TicketPricingPanel";
import { DeleteTicketButton } from "@/components/service-desk/DeleteTicketButton";
import { useAuth } from "@/lib/service-desk/auth";
import { assignTechnician, updateTicketStatus, addTicketNote } from "@/lib/service-desk/api";
import { deskKeys } from "@/lib/service-desk/query-keys";
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/service-desk/constants";
import type { ServiceStatus } from "@/lib/service-desk/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useDeskData } from "@/hooks/use-desk-data";
import { useTicket } from "@/hooks/use-service-desk";

export const Route = createFileRoute("/app/admin/kayitlar/$ticketId")({
  component: AdminTicketDetail,
});

function AdminTicketDetail() {
  const { ticketId } = Route.useParams();
  const data = useDeskData();
  const qc = useQueryClient();
  const { user } = useAuth();
  const ticket = useTicket(ticketId);
  const [note, setNote] = useState("");

  if (!ticket || !user) throw notFound();

  const techs = data.technicians.filter((t) => t.active);
  const actor = { id: user.id, name: user.name };

  return (
    <div className="space-y-6">
      <TicketDetailView
        ticket={ticket}
        actions={
          <div className="flex flex-col gap-3 min-w-[220px] w-full sm:w-auto">
            <Select
              value={ticket.status}
              onValueChange={async (v) => {
                try {
                  await updateTicketStatus(ticket.id, v as ServiceStatus, actor);
                  await qc.invalidateQueries({ queryKey: deskKeys.all });
                  toast.success("Durum güncellendi");
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Güncellenemedi");
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_ORDER.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={ticket.assignedTechnicianId ?? ""}
              onValueChange={async (v) => {
                try {
                  await assignTechnician(ticket.id, v, actor);
                  await qc.invalidateQueries({ queryKey: deskKeys.all });
                  toast.success("Teknisyen atandı");
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Atama başarısız");
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Teknisyen ata" />
              </SelectTrigger>
              <SelectContent>
                {techs.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Admin notu..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
            <Button
              size="sm"
              onClick={async () => {
                if (!note.trim()) return;
                try {
                  await addTicketNote(ticket.id, note, actor);
                  await qc.invalidateQueries({ queryKey: deskKeys.all });
                  setNote("");
                  toast.success("Not eklendi");
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Not eklenemedi");
                }
              }}
            >
              Not Ekle
            </Button>
            <DeleteTicketButton
              ticketId={ticket.id}
              ticketCode={ticket.code}
              redirectToList
              className="w-full"
            />
          </div>
        }
      />
      <TicketPricingPanel ticket={ticket} actor={actor} />
    </div>
  );
}
