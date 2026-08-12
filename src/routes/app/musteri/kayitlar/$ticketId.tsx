import { createFileRoute, notFound } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { TicketDetailView } from "@/components/service-desk/TicketDetailView";
import { useTicket } from "@/hooks/use-service-desk";

export const Route = createFileRoute("/app/musteri/kayitlar/$ticketId")({
  component: CustomerTicketDetail,
});

function CustomerTicketDetail() {
  const { ticketId } = Route.useParams();
  const { ticket, isLoading } = useTicket(ticketId);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!ticket) throw notFound();

  return <TicketDetailView ticket={ticket} />;
}
