import { createFileRoute, notFound } from "@tanstack/react-router";
import { TicketDetailView } from "@/components/service-desk/TicketDetailView";
import { useTicket } from "@/hooks/use-service-desk";
import { useDeskData } from "@/hooks/use-desk-data";

export const Route = createFileRoute("/app/musteri/kayitlar/$ticketId")({
  component: CustomerTicketDetail,
});

function CustomerTicketDetail() {
  const { ticketId } = Route.useParams();
  useDeskData();
  const ticket = useTicket(ticketId);
  if (!ticket) throw notFound();

  return <TicketDetailView ticket={ticket} />;
}
