import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/service-desk/auth";
import { useDeskData } from "@/hooks/use-desk-data";
import { useTechnicianByUserId } from "@/hooks/use-service-desk";
import { TicketStatusBadge, UrgencyBadge } from "@/components/service-desk/TicketStatusBadge";

export const Route = createFileRoute("/app/teknik/gorevler")({
  component: TechJobs,
});

function TechJobs() {
  const { user } = useAuth();
  const { tickets } = useDeskData();
  const tech = useTechnicianByUserId(user?.id);
  const jobs = tickets.filter((t) => t.assignedTechnicianId === tech?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Tüm Görevler</h1>
        <p className="text-muted-foreground text-sm">{jobs.length} kayıt</p>
      </div>
      <div className="space-y-3">
        {jobs.map((t) => (
          <Link
            key={t.id}
            to="/app/teknik/gorev/$ticketId"
            params={{ ticketId: t.id }}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 hover:bg-muted/50"
          >
            <div>
              <p className="font-semibold">{t.code}</p>
              <p className="text-sm text-muted-foreground">{t.companyName}</p>
            </div>
            <div className="flex gap-2">
              <UrgencyBadge urgency={t.urgency} />
              <TicketStatusBadge status={t.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
