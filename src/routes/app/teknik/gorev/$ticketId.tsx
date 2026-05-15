import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Camera } from "lucide-react";
import { TicketDetailView } from "@/components/service-desk/TicketDetailView";
import { useAuth } from "@/lib/service-desk/auth";
import {
  completeTicket,
  addTicketPhoto,
  updateTicketStatus,
  addTicketNote,
} from "@/lib/service-desk/store";
import { useDeskData } from "@/hooks/use-desk-data";
import { useTicket } from "@/hooks/use-service-desk";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  const { user } = useAuth();
  const ticket = useTicket(ticketId);
  const [work, setWork] = useState(ticket?.workPerformed ?? "");
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
            onValueChange={(v) => {
              updateTicketStatus(ticket.id, v as ServiceStatus, actor);
              toast.success(STATUS_LABELS[v as ServiceStatus]);
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

      <div className="max-w-2xl rounded-2xl border bg-card p-6 space-y-4">
        <h2 className="font-display font-bold text-lg">Saha İşlemleri</h2>
        <div className="space-y-2">
          <Label>Yapılan işlem</Label>
          <Textarea value={work} onChange={(e) => setWork(e.target.value)} rows={3} />
        </div>
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
              const url = await fileToDataUrl(f);
              addTicketPhoto(ticket.id, url, actor);
              toast.success("Fotoğraf eklendi");
            }}
          />
        </label>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => {
              if (!work.trim()) return;
              addTicketNote(ticket.id, work, actor);
              toast.success("İşlem kaydedildi");
            }}
          >
            İşlemi Kaydet
          </Button>
          <Button
            className="rounded-full"
            onClick={() => {
              if (!work.trim()) {
                toast.error("Yapılan işlemi girin");
                return;
              }
              completeTicket(
                ticket.id,
                { workPerformed: work, technicianSignature: signature || user.name },
                actor,
              );
              toast.success("İş tamamlandı");
            }}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" /> İş Tamamlandı
          </Button>
        </div>
      </div>
    </div>
  );
}
