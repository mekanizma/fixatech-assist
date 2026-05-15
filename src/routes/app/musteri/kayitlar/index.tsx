import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/service-desk/auth";
import { useDeskData } from "@/hooks/use-desk-data";
import { TicketStatusBadge } from "@/components/service-desk/TicketStatusBadge";
import { formatDate } from "@/lib/service-desk/utils";
import { openServiceReportPdf } from "@/lib/service-desk/pdf";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/app/musteri/kayitlar/")({
  component: CustomerTickets,
});

function CustomerTickets() {
  const { user } = useAuth();
  const { tickets } = useDeskData();
  const mine = tickets.filter((t) => t.companyId === user?.companyId || t.createdByUserId === user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Servis Geçmişim</h1>
        <p className="text-muted-foreground text-sm">{mine.length} kayıt</p>
      </div>
      <div className="space-y-3">
        {mine.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border border-border/60 bg-card p-4 flex flex-wrap items-center justify-between gap-3"
          >
            <div>
              <Link
                to="/app/musteri/kayitlar/$ticketId"
                params={{ ticketId: t.id }}
                className="font-semibold text-primary hover:underline"
              >
                {t.code}
              </Link>
              <p className="text-sm text-muted-foreground">{t.productName}</p>
              <p className="text-xs text-muted-foreground">{formatDate(t.serviceDate)}</p>
            </div>
            <div className="flex items-center gap-2">
              <TicketStatusBadge status={t.status} />
              <Button variant="outline" size="sm" onClick={() => openServiceReportPdf(t)}>
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
