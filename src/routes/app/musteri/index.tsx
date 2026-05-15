import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusCircle, Search } from "lucide-react";
import { useAuth } from "@/lib/service-desk/auth";
import { useDeskData } from "@/hooks/use-desk-data";
import { StatCard } from "@/components/service-desk/DashboardStats";
import { TicketStatusBadge } from "@/components/service-desk/TicketStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Clock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/app/musteri/")({
  component: CustomerHome,
});

function CustomerHome() {
  const { user } = useAuth();
  const { tickets } = useDeskData();
  const mine = tickets.filter((t) => t.companyId === user?.companyId || t.createdByUserId === user?.id);

  const active = mine.filter((t) => t.status !== "completed").length;
  const done = mine.filter((t) => t.status === "completed").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Müşteri Paneli</h1>
          <p className="text-muted-foreground">Hoş geldiniz, {user?.name}</p>
        </div>
        <Button asChild className="rounded-full">
          <Link to="/app/musteri/yeni">
            <PlusCircle className="h-4 w-4 mr-2" /> Yeni Servis Talebi
          </Link>
        </Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard title="Toplam Servis" value={mine.length} icon={ClipboardList} />
        <StatCard title="Aktif" value={active} icon={Clock} accent="amber" />
        <StatCard title="Tamamlanan" value={done} icon={CheckCircle2} accent="emerald" />
      </div>

      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>Son Servisleriniz</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/app/musteri/kayitlar">Tümü</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {mine.slice(0, 5).map((t) => (
            <Link
              key={t.id}
              to="/app/musteri/kayitlar/$ticketId"
              params={{ ticketId: t.id }}
              className="flex items-center justify-between rounded-xl border p-3 hover:bg-muted/50"
            >
              <div>
                <p className="font-semibold text-sm">{t.code}</p>
                <p className="text-xs text-muted-foreground">{t.productName}</p>
              </div>
              <TicketStatusBadge status={t.status} />
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6 flex flex-wrap items-center gap-4">
          <Search className="h-8 w-8 text-primary" />
          <div className="flex-1">
            <p className="font-semibold">Servis takip kodunuz var mı?</p>
            <p className="text-sm text-muted-foreground">Kayıt numaranızla durumu kontrol edin</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/takip">Takip Sayfası</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
