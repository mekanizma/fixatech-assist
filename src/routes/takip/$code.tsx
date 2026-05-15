import { createFileRoute, notFound } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { TicketDetailView } from "@/components/service-desk/TicketDetailView";
import { ClientOnly } from "@/components/service-desk/ClientOnly";
import { useTicketByCode } from "@/hooks/use-service-desk";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/takip/$code")({
  component: PublicTrack,
});

function PublicTrack() {
  const { code } = Route.useParams();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/80 backdrop-blur sticky top-0 z-10 px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/takip">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <p className="font-semibold text-sm">Servis Takip — {code}</p>
      </div>
      <ClientOnly>
        <TrackContent code={code} />
      </ClientOnly>
    </div>
  );
}

function TrackContent({ code }: { code: string }) {
  const ticket = useTicketByCode(code);
  if (!ticket) throw notFound();
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <TicketDetailView ticket={ticket} />
    </div>
  );
}
