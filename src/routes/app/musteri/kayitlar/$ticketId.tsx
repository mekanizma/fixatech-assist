import { createFileRoute, notFound } from "@tanstack/react-router";
import { TicketDetailView } from "@/components/service-desk/TicketDetailView";
import { useTicket } from "@/hooks/use-service-desk";
import { useDeskData } from "@/hooks/use-desk-data";
import { openServiceReportPdf } from "@/lib/service-desk/pdf";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/app/musteri/kayitlar/$ticketId")({
  component: CustomerTicketDetail,
});

function CustomerTicketDetail() {
  const { ticketId } = Route.useParams();
  useDeskData();
  const ticket = useTicket(ticketId);
  if (!ticket) throw notFound();

  return (
    <TicketDetailView
      ticket={ticket}
      actions={
        <Button variant="outline" onClick={() => openServiceReportPdf(ticket)}>
          <FileText className="h-4 w-4 mr-2" /> PDF İndir
        </Button>
      }
    />
  );
}
