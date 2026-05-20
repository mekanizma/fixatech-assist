import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Camera } from "lucide-react";
import { TicketDetailView } from "@/components/service-desk/TicketDetailView";
import { TicketPricingPanel } from "@/components/service-desk/TicketPricingPanel";
import { useAuth } from "@/lib/service-desk/auth";
import { addTicketPhoto, updateTicketStatus } from "@/lib/service-desk/api";
import { deskKeys } from "@/lib/service-desk/query-keys";
import { useDeskData } from "@/hooks/use-desk-data";
import { useTicket } from "@/hooks/use-service-desk";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { fileToDataUrl } from "@/lib/service-desk/utils";
import type { ServiceStatus } from "@/lib/service-desk/types";
import { STATUS_ORDER, STATUS_LABELS } from "@/lib/service-desk/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/app/teknik/gorev/$ticketId")({
  component: TechJobDetail,
});

function TechJobDetail() {
  const { ticketId } = Route.useParams();
  useDeskData();
  const qc = useQueryClient();
  const { user } = useAuth();
  const ticket = useTicket(ticketId);
  const [signature, setSignature] = useState("");

  if (!ticket || !user) throw notFound();
  const actor = { id: user.id, name: user.name };

  return (
    <div className="space-y-6">
      <TicketDetailView
        ticket={ticket}
        actions={
          <Select
            value={ticket.status}
            onValueChange={async (v) => {
              try {
                await updateTicketStatus(ticket.id, v as ServiceStatus, actor);
                await qc.invalidateQueries({ queryKey: deskKeys.all });
                toast.success(STATUS_LABELS[v as ServiceStatus]);
              } catch (e) {
                toast.error(e instanceof Error ? e.message : "Güncellenemedi");
              }
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_ORDER.filter((s) => s !== "pending").map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <TicketPricingPanel
        ticket={ticket}
        actor={actor}
        showComplete
        technicianSignature={signature || user.name}
      />

      <div className="max-w-3xl rounded-2xl border bg-card p-6 space-y-4">
        <h2 className="font-display font-bold text-lg">Saha İşlemleri</h2>
        <div className="space-y-2">
          <Label>Dijital imza (ad soyad)</Label>
          <Input value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Teknisyen imzası" />
        </div>
        <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
          <Camera className="h-4 w-4" />
          Fotoğraf ekle
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                const url = await fileToDataUrl(f);
                await addTicketPhoto(ticket.id, url, actor);
                await qc.invalidateQueries({ queryKey: deskKeys.all });
                toast.success("Fotoğraf eklendi");
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Fotoğraf eklenemedi");
              }
            }}
          />
        </label>
      </div>
    </div>
  );
}
