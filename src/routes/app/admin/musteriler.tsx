import { createFileRoute } from "@tanstack/react-router";
import { useDeskData } from "@/hooks/use-desk-data";
import { BUSINESS_LABELS } from "@/lib/service-desk/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/admin/musteriler")({
  component: AdminCustomers,
});

function AdminCustomers() {
  const { companies, tickets } = useDeskData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Müşteri Yönetimi</h1>
        <p className="text-muted-foreground text-sm">Kayıtlı kurumsal müşteriler</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {companies.map((c) => {
          const count = tickets.filter((t) => t.companyId === c.id).length;
          return (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between gap-2">
                  {c.name}
                  <Badge variant="secondary">{BUSINESS_LABELS[c.type]}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1 text-muted-foreground">
                <p>{c.contactPerson}</p>
                <p>{c.phone}</p>
                <p>{c.email}</p>
                <p>
                  {c.address}, {c.district} / {c.city}
                </p>
                <p className="text-foreground font-medium pt-2">{count} servis kaydı</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
