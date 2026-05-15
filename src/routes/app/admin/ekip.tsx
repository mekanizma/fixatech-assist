import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { KeyRound, MapPin } from "lucide-react";
import { useDeskData } from "@/hooks/use-desk-data";
import { deskKeys } from "@/lib/service-desk/query-keys";
import { TechnicianCreateForm } from "@/components/service-desk/TechnicianCreateForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/admin/ekip")({
  component: AdminTeam,
});

function AdminTeam() {
  const qc = useQueryClient();
  const { technicians, tickets } = useDeskData();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Teknik Ekip</h1>
          <p className="text-muted-foreground text-sm">Saha personeli ve görev dağılımı</p>
        </div>
        <TechnicianCreateForm onCreated={() => void qc.invalidateQueries({ queryKey: deskKeys.all })} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {technicians.map((t) => {
          const activeJobs = tickets.filter(
            (tk) => tk.assignedTechnicianId === t.id && tk.status !== "completed",
          ).length;
          return (
            <Card key={t.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {t.name}
                  <Badge variant={t.active ? "default" : "secondary"}>{t.active ? "Aktif" : "Pasif"}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-muted-foreground">{t.phone}</p>
                <div className="rounded-lg bg-muted/60 p-2.5 text-xs">
                  <p className="font-semibold text-foreground flex items-center gap-1">
                    <KeyRound className="h-3.5 w-3.5" /> Panel girişi
                  </p>
                  <p className="font-mono text-foreground mt-1">{t.email}</p>
                </div>
                <p className="flex flex-wrap gap-1">
                  {t.specialties.map((s) => (
                    <Badge key={s} variant="outline" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </p>
                <p className="font-medium">{activeJobs} aktif görev</p>
                {t.location && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {t.location.label}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {technicians.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          Henüz teknisyen yok. Yeni Teknisyen ile ekleyin.
        </p>
      ) : null}
    </div>
  );
}
