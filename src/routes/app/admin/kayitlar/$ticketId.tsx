import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { TicketDetailView } from "@/components/service-desk/TicketDetailView";
import { useAuth } from "@/lib/service-desk/auth";
import { assignTechnician, updateTicketStatus, addTicketNote } from "@/lib/service-desk/store";
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
  const { user } = useAuth();
  const ticket = useTicket(ticketId);
  const [note, setNote] = useState("");

  if (!ticket || !user) throw notFound();

  const techs = data.technicians.filter((t) => t.active);
  const actor = { id: user.id, name: user.name };

  return (
    <TicketDetailView
      ticket={ticket}
      actions={
        <div className="flex flex-col gap-3 min-w-[220px]">
          <Select
            value={ticket.status}
            onValueChange={(v) => {
              updateTicketStatus(ticket.id, v as ServiceStatus, actor);
              toast.success("Durum güncellendi");
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
            onValueChange={(v) => {
              assignTechnician(ticket.id, v, actor);
              toast.success("Teknisyen atandı");
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
          <Textarea placeholder="Admin notu..." value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
          <Button
            size="sm"
            onClick={() => {
              if (!note.trim()) return;
              addTicketNote(ticket.id, note, actor);
              setNote("");
              toast.success("Not eklendi");
            }}
          >
            Not Ekle
          </Button>
        </div>
      }
    />
  );
}
