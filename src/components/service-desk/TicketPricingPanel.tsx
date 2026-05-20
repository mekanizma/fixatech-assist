import { useMemo, useState } from "react";
import { Plus, Trash2, Save, CheckCircle2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { completeTicket, updateTicket } from "@/lib/service-desk/api";
import { deskKeys } from "@/lib/service-desk/query-keys";
import {
  computeInvoiceTotal,
  emptyPart,
  emptyWorkItem,
  formatTry,
  workPerformedSummary,
} from "@/lib/service-desk/pricing";
import type { PartUsed, ServiceTicket, WorkLineItem } from "@/lib/service-desk/types";

type Props = {
  ticket: ServiceTicket;
  actor: { id: string; name: string };
  /** Tamamla butonu göster (teknisyen) */
  showComplete?: boolean;
  technicianSignature?: string;
};

export function TicketPricingPanel({ ticket, actor, showComplete, technicianSignature }: Props) {
  const qc = useQueryClient();
  const [workItems, setWorkItems] = useState<WorkLineItem[]>(
    () => (ticket.workItems?.length ? ticket.workItems : [emptyWorkItem()]),
  );
  const [parts, setParts] = useState<PartUsed[]>(
    () => (ticket.partsUsed?.length ? ticket.partsUsed : []),
  );
  const [note, setNote] = useState(ticket.workPerformed ?? "");
  const [saving, setSaving] = useState(false);

  const laborTotal = useMemo(
    () => workItems.reduce((s, w) => s + (Number(w.amount) || 0), 0),
    [workItems],
  );
  const partsTotal = useMemo(() => parts.reduce((s, p) => s + (Number(p.cost) || 0), 0), [parts]);
  const grandTotal = useMemo(() => computeInvoiceTotal(workItems, parts), [workItems, parts]);

  const buildPayload = () => {
    const cleanedWork = workItems.filter((w) => w.description.trim());
    const cleanedParts = parts.filter((p) => p.name.trim());
    const workPerformed = workPerformedSummary(note, cleanedWork);
    return {
      workItems: cleanedWork,
      partsUsed: cleanedParts.length ? cleanedParts : undefined,
      workPerformed,
      invoiceAmount: computeInvoiceTotal(cleanedWork, cleanedParts),
    };
  };

  const savePricing = async () => {
    const payload = buildPayload();
    if (!payload.workPerformed && !payload.workItems.length && !payload.partsUsed?.length) {
      toast.error("En az bir işlem veya parça girin");
      return;
    }
    setSaving(true);
    try {
      await updateTicket(ticket.id, payload, actor);
      await qc.invalidateQueries({ queryKey: deskKeys.all });
      toast.success("Fiyatlandırma kaydedildi", {
        description: payload.invoiceAmount > 0 ? formatTry(payload.invoiceAmount) : undefined,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  const completeJob = async () => {
    const payload = buildPayload();
    if (!payload.workPerformed) {
      toast.error("Yapılan işlem açıklaması veya fiyatlı kalem girin");
      return;
    }
    setSaving(true);
    try {
      await completeTicket(
        ticket.id,
        {
          ...payload,
          technicianSignature: technicianSignature || actor.name,
        },
        actor,
      );
      await qc.invalidateQueries({ queryKey: deskKeys.all });
      toast.success("İş tamamlandı", {
        description: payload.invoiceAmount > 0 ? formatTry(payload.invoiceAmount) : undefined,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Tamamlanamadı");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl rounded-2xl border bg-card p-6 space-y-6">
      <div>
        <h2 className="font-display font-bold text-lg">Fiyatlandırma</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Yapılan işlemler ve parça tutarlarını girin; teslim formunda detaylı görünür.
        </p>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold">Yapılan işlemler (işçilik)</Label>
        {workItems.map((row, i) => (
          <div key={i} className="grid sm:grid-cols-[1fr_120px_40px] gap-2 items-center">
            <Input
              placeholder="İşlem açıklaması"
              value={row.description}
              onChange={(e) => {
                const next = [...workItems];
                next[i] = { ...row, description: e.target.value };
                setWorkItems(next);
              }}
            />
            <Input
              type="number"
              min={0}
              step={0.01}
              placeholder="Tutar ₺"
              value={row.amount || ""}
              onChange={(e) => {
                const next = [...workItems];
                next[i] = { ...row, amount: Number.parseFloat(e.target.value) || 0 };
                setWorkItems(next);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              disabled={workItems.length <= 1}
              onClick={() => setWorkItems(workItems.filter((_, j) => j !== i))}
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => setWorkItems([...workItems, emptyWorkItem()])}>
          <Plus className="h-4 w-4 mr-1" /> İşlem kalemi ekle
        </Button>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold">Kullanılan parçalar</Label>
        {parts.length === 0 && (
          <p className="text-xs text-muted-foreground">Parça yoksa boş bırakabilirsiniz.</p>
        )}
        {parts.map((row, i) => (
          <div key={i} className="grid sm:grid-cols-[1fr_72px_120px_40px] gap-2 items-center">
            <Input
              placeholder="Parça adı"
              value={row.name}
              onChange={(e) => {
                const next = [...parts];
                next[i] = { ...row, name: e.target.value };
                setParts(next);
              }}
            />
            <Input
              type="number"
              min={1}
              placeholder="Adet"
              value={row.qty}
              onChange={(e) => {
                const next = [...parts];
                next[i] = { ...row, qty: Number.parseInt(e.target.value, 10) || 1 };
                setParts(next);
              }}
            />
            <Input
              type="number"
              min={0}
              step={0.01}
              placeholder="Tutar ₺"
              value={row.cost || ""}
              onChange={(e) => {
                const next = [...parts];
                next[i] = { ...row, cost: Number.parseFloat(e.target.value) || 0 };
                setParts(next);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setParts(parts.filter((_, j) => j !== i))}
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => setParts([...parts, emptyPart()])}>
          <Plus className="h-4 w-4 mr-1" /> Parça ekle
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Ek not (isteğe bağlı)</Label>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Ek açıklama" />
      </div>

      <div className="rounded-xl bg-muted/50 p-4 text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">İşçilik toplamı</span>
          <span className="font-medium">{formatTry(laborTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Parça toplamı</span>
          <span className="font-medium">{formatTry(partsTotal)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t font-semibold text-base">
          <span>Genel toplam</span>
          <span className="text-primary">{formatTry(grandTotal)}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" disabled={saving} onClick={() => void savePricing()}>
          <Save className="h-4 w-4 mr-2" /> Fiyatlandırmayı Kaydet
        </Button>
        {showComplete && ticket.status !== "completed" && (
          <Button disabled={saving} onClick={() => void completeJob()}>
            <CheckCircle2 className="h-4 w-4 mr-2" /> İş Tamamlandı
          </Button>
        )}
      </div>
    </div>
  );
}
