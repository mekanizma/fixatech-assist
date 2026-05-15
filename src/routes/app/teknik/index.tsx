import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Navigation } from "lucide-react";
import { useAuth } from "@/lib/service-desk/auth";
import { useDeskData } from "@/hooks/use-desk-data";
import { useTechnicianByUserId } from "@/hooks/use-service-desk";
import { TicketStatusBadge } from "@/components/service-desk/TicketStatusBadge";
import { StatCard } from "@/components/service-desk/DashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, CheckCircle2, Truck } from "lucide-react";

export const Route = createFileRoute("/app/teknik/")({
  component: TechHome,
});

function TechHome() {
  const { user } = useAuth();
  const { tickets } = useDeskData();
  const tech = useTechnicianByUserId(user?.id);
  const jobs = tickets.filter((t) => t.assignedTechnicianId === tech?.id && t.status !== "completed");
  const today = new Date().toISOString().split("T")[0];
  const todayJobs = jobs.filter((t) => t.serviceDate === today);
  const completed = tickets.filter((t) => t.assignedTechnicianId === tech?.id && t.status === "completed").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold">Günlük Görevler</h1>
        <p className="text-muted-foreground">Merhaba {user?.name}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard title="Bugün" value={todayJobs.length} icon={Truck} />
        <StatCard title="Aktif Görev" value={jobs.length} icon={ClipboardList} accent="amber" />
        <StatCard title="Tamamlanan" value={completed} icon={CheckCircle2} accent="emerald" />
      </div>

      {tech?.location && (
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Son konum</p>
              <p className="text-sm text-muted-foreground">{tech.location.label}</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto" asChild>
              <a
                href={`https://www.google.com/maps?q=${tech.location.lat},${tech.location.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                <Navigation className="h-4 w-4 mr-1" /> Harita
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Bugünkü İşler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayJobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Bugün için atanmış görev yok.</p>
          ) : (
            todayJobs.map((t) => (
              <Link
                key={t.id}
                to="/app/teknik/gorev/$ticketId"
                params={{ ticketId: t.id }}
                className="block rounded-xl border p-4 hover:bg-muted/50"
              >
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="font-semibold">{t.companyName}</p>
                    <p className="text-sm text-muted-foreground">{t.productName}</p>
                    <p className="text-xs text-muted-foreground">{t.serviceTime}</p>
                  </div>
                  <TicketStatusBadge status={t.status} />
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
