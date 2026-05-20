import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useDeskData } from "@/hooks/use-desk-data";
import { TicketStatusBadge, UrgencyBadge } from "@/components/service-desk/TicketStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { STATUS_LABELS } from "@/lib/service-desk/constants";
import type { ServiceStatus } from "@/lib/service-desk/types";

export const Route = createFileRoute("/app/admin/kayitlar/")({
  component: AdminTickets,
});

function AdminTickets() {
  const { tickets } = useDeskData();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<ServiceStatus | "all">("all");

  const filtered = tickets.filter((t) => {
    const matchQ =
      !q ||
      t.code.toLowerCase().includes(q.toLowerCase()) ||
      t.companyName.toLowerCase().includes(q.toLowerCase());
    const matchS = status === "all" || t.status === status;
    return matchQ && matchS;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Servis Kayıtları</h1>
          <p className="text-muted-foreground text-sm">{filtered.length} kayıt</p>
        </div>
        <Button asChild className="rounded-full">
          <Link to="/app/admin/kayitlar/yeni">
            <Plus className="h-4 w-4 mr-2" /> Yeni Kayıt
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input placeholder="Ara..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <select
          className="rounded-lg border border-input bg-background px-3 text-sm h-10"
          value={status}
          onChange={(e) => setStatus(e.target.value as ServiceStatus | "all")}
        >
          <option value="all">Tüm durumlar</option>
          {(Object.keys(STATUS_LABELS) as ServiceStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kod</TableHead>
              <TableHead>Firma</TableHead>
              <TableHead>Ürün</TableHead>
              <TableHead>Öncelik</TableHead>
              <TableHead>Durum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((t) => (
              <TableRow key={t.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <Link to="/app/admin/kayitlar/$ticketId" params={{ ticketId: t.id }} className="font-semibold text-primary">
                    {t.code}
                  </Link>
                </TableCell>
                <TableCell>{t.companyName}</TableCell>
                <TableCell className="max-w-[200px] truncate">{t.productName}</TableCell>
                <TableCell>
                  <UrgencyBadge urgency={t.urgency} />
                </TableCell>
                <TableCell>
                  <TicketStatusBadge status={t.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
