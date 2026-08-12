import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ClipboardList, Clock, Users, Wrench } from "lucide-react";
import { StatCard } from "@/components/service-desk/DashboardStats";
import { TicketStatusBadge } from "@/components/service-desk/TicketStatusBadge";
import { useDeskData } from "@/hooks/use-desk-data";
import { useDashboardStats } from "@/hooks/use-service-desk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/service-desk/utils";

export const Route = createFileRoute("/app/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const data = useDeskData();
  const stats = useDashboardStats();
  const recent = [...data.tickets].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6);
  const critical = data.tickets.filter((t) => t.urgency === "critical" && t.status !== "completed");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Yönetim Paneli</h1>
        <p className="text-muted-foreground mt-1">Günlük operasyon özeti ve acil arızalar</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Bugünkü Servis" value={stats.today} icon={Clock} />
        <StatCard title="Bekleyen" value={stats.pending} icon={ClipboardList} accent="amber" />
        <StatCard title="Kritik Arıza" value={stats.critical} icon={AlertTriangle} accent="destructive" />
        <StatCard title="Aktif Teknisyen" value={stats.technicians} icon={Wrench} accent="emerald" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Son Kayıtlar</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/app/admin/kayitlar">Tümü</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recent.map((t) => (
              <Link
                key={t.id}
                to="/app/admin/kayitlar/$ticketId"
                params={{ ticketId: t.id }}
                className="flex items-center justify-between rounded-xl border border-border/60 p-3 hover:bg-muted/50 transition"
              >
                <div>
                  <p className="font-semibold text-sm">{t.code}</p>
                  <p className="text-xs text-muted-foreground">{t.companyName}</p>
                </div>
                <TicketStatusBadge status={t.status} />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" /> Kritik Arızalar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {critical.length === 0 ? (
              <p className="text-sm text-muted-foreground">Kritik bekleyen kayıt yok.</p>
            ) : (
              critical.map((t) => (
                <Link
                  key={t.id}
                  to="/app/admin/kayitlar/$ticketId"
                  params={{ ticketId: t.id }}
                  className="block rounded-xl border border-destructive/20 bg-destructive/5 p-3 hover:bg-destructive/10"
                >
                  <p className="font-semibold text-sm">{t.companyName}</p>
                  <p className="text-xs text-muted-foreground">{t.productType || t.productName}</p>
                  <p className="text-xs mt-1">{formatDateTime(t.updatedAt)}</p>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Button asChild variant="outline" className="h-auto py-4 flex-col gap-1">
          <Link to="/app/admin/kayitlar">
            <ClipboardList className="h-5 w-5" />
            Servis Kayıtları
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4 flex-col gap-1">
          <Link to="/app/admin/musteriler">
            <Users className="h-5 w-5" />
            Müşteriler
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4 flex-col gap-1">
          <Link to="/app/admin/ekip">
            <Wrench className="h-5 w-5" />
            Teknik Ekip
          </Link>
        </Button>
      </div>
    </div>
  );
}
