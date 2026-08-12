import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { KeyRound, Mail } from "lucide-react";
import { useDeskData } from "@/hooks/use-desk-data";
import { BUSINESS_LABELS } from "@/lib/service-desk/constants";
import { deskKeys } from "@/lib/service-desk/query-keys";
import { CustomerCreateForm } from "@/components/service-desk/CustomerCreateForm";
import { DeleteCustomerButton } from "@/components/service-desk/DeleteCustomerButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/admin/musteriler")({
  component: AdminCustomers,
});

function AdminCustomers() {
  const qc = useQueryClient();
  const { companies, tickets, users } = useDeskData();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Müşteri Yönetimi</h1>
          <p className="text-muted-foreground text-sm">
            Kurumsal müşteriler ve portal giriş hesapları
          </p>
        </div>
        <CustomerCreateForm onCreated={() => void qc.invalidateQueries({ queryKey: deskKeys.all })} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {companies.map((c) => {
          const count = tickets.filter((t) => t.companyId === c.id).length;
          const portalUsers = users.filter((u) => u.role === "customer" && u.companyId === c.id);
          return (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle className="text-lg flex items-start justify-between gap-2">
                  <span className="min-w-0 break-words">{c.name}</span>
                  <Badge variant="secondary" className="shrink-0">
                    {BUSINESS_LABELS[c.type]}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-muted-foreground">
                <p>{c.contactPerson}</p>
                <p>{c.phone}</p>
                {c.email ? (
                  <p className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="break-all">{c.email}</span>
                  </p>
                ) : null}
                <p>
                  {c.address}, {c.district}
                </p>
                <p className="text-foreground font-medium pt-1">{count} servis kaydı</p>
                {portalUsers.length > 0 ? (
                  <div className="rounded-lg bg-muted/60 p-2.5 space-y-1 text-xs">
                    <p className="font-semibold text-foreground flex items-center gap-1">
                      <KeyRound className="h-3.5 w-3.5" /> Portal girişi
                    </p>
                    {portalUsers.map((u) => (
                      <p key={u.id} className="font-mono text-foreground break-all">
                        {u.email}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-amber-600 dark:text-amber-500">Portal hesabı yok</p>
                )}
                <div className="pt-2">
                  <DeleteCustomerButton
                    companyId={c.id}
                    companyName={c.name}
                    ticketCount={count}
                    className="w-full sm:w-auto"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {companies.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          Henüz müşteri yok. Yeni Müşteri ile ekleyin.
        </p>
      ) : null}
    </div>
  );
}
