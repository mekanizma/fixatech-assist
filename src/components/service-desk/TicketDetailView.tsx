import { Link } from "@tanstack/react-router";
import { ClipboardList, MapPin, Package, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketStatusBadge, UrgencyBadge } from "@/components/service-desk/TicketStatusBadge";
import { StatusStepper, TicketTimeline } from "@/components/service-desk/TicketTimeline";
import { openDeliveryFormPdf, openServiceApplicationPdf } from "@/lib/service-desk/pdf";
import { useTechnician, useTicketEvents } from "@/hooks/use-service-desk";
import { formatDate, statusProgress } from "@/lib/service-desk/utils";
import { BUSINESS_LABELS } from "@/lib/service-desk/constants";
import { computeInvoiceTotal, formatTry } from "@/lib/service-desk/pricing";
import type { ServiceTicket } from "@/lib/service-desk/types";
import { Progress } from "@/components/ui/progress";

export function TicketDetailView({
  ticket,
  actions,
}: {
  ticket: ServiceTicket;
  actions?: React.ReactNode;
}) {
  const events = useTicketEvents(ticket.id);
  const tech = useTechnician(ticket.assignedTechnicianId);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Kayıt No</p>
          <h1 className="text-2xl md:text-3xl font-display font-bold">{ticket.code}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <TicketStatusBadge status={ticket.status} />
            <UrgencyBadge urgency={ticket.urgency} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => openServiceApplicationPdf(ticket, { events, technician: tech })}
          >
            <ClipboardList className="h-4 w-4 mr-2" /> Başvuru Formu
          </Button>
          <Button
            variant="outline"
            onClick={() => openDeliveryFormPdf(ticket, { events, technician: tech })}
          >
            <Package className="h-4 w-4 mr-2" /> Teslim Formu
          </Button>
          {actions}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">İlerleme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={statusProgress(ticket.status)} className="h-2" />
          <StatusStepper status={ticket.status} />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Firma & İletişim</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row icon={User} label={ticket.companyName} sub={`${BUSINESS_LABELS[ticket.businessType]} · ${ticket.contactPerson}`} />
            <Row icon={Phone} label={ticket.phone} sub={ticket.email} />
            <Row icon={MapPin} label={`${ticket.address}, ${ticket.district}`} sub={ticket.city} />
            {ticket.location && (
              <a
                className="text-primary text-xs hover:underline"
                target="_blank"
                rel="noreferrer"
                href={`https://www.google.com/maps?q=${ticket.location.lat},${ticket.location.lng}`}
              >
                Haritada aç →
              </a>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ürün & Servis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Ürün:</span> {ticket.productName} ({ticket.productType})
            </p>
            <p>
              <span className="text-muted-foreground">Marka/Model:</span> {ticket.brand} {ticket.model}
            </p>
            <p>
              <span className="text-muted-foreground">Seri:</span> {ticket.serialNo || "—"} · Adet: {ticket.quantity}
            </p>
            <p>
              <span className="text-muted-foreground">Randevu:</span> {formatDate(ticket.serviceDate)} — {ticket.serviceTime}
            </p>
            <p>
              <span className="text-muted-foreground">Teknisyen:</span> {tech?.name ?? "Atanmadı"}
            </p>
            {ticket.estimatedCompletion && (
              <p>
                <span className="text-muted-foreground">Tahmini bitiş:</span> {formatDate(ticket.estimatedCompletion)}
              </p>
            )}
            <p className="pt-2 border-t">{ticket.issueDescription}</p>
          </CardContent>
        </Card>
      </div>

      {ticket.photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fotoğraflar</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {ticket.photos.map((src, i) => (
              <img key={i} src={src} alt="" className="h-24 w-24 rounded-lg object-cover border" />
            ))}
          </CardContent>
        </Card>
      )}

      {(ticket.workItems?.length || ticket.partsUsed?.length || ticket.invoiceAmount) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fiyatlandırma</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            {ticket.workItems?.length ? (
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">İşçilik</p>
                <ul className="space-y-1">
                  {ticket.workItems.map((w, i) => (
                    <li key={i} className="flex justify-between gap-4">
                      <span>{w.description}</span>
                      <span className="font-medium shrink-0">{formatTry(Number(w.amount) || 0)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {ticket.partsUsed?.length ? (
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Parçalar</p>
                <ul className="space-y-1">
                  {ticket.partsUsed.map((p, i) => (
                    <li key={i} className="flex justify-between gap-4">
                      <span>
                        {p.name} × {p.qty}
                      </span>
                      <span className="font-medium shrink-0">{formatTry(Number(p.cost) || 0)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="flex justify-between pt-2 border-t font-semibold">
              <span>Toplam</span>
              <span className="text-primary">
                {formatTry(ticket.invoiceAmount ?? computeInvoiceTotal(ticket.workItems, ticket.partsUsed))}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {ticket.workPerformed && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Yapılan İşlemler</CardTitle>
          </CardHeader>
          <CardContent className="text-sm whitespace-pre-wrap">{ticket.workPerformed}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Servis Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          <TicketTimeline events={events} />
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        Kamuya açık takip:{" "}
        <Link to="/takip/$code" params={{ code: ticket.code }} className="text-primary font-semibold hover:underline">
          /takip/{ticket.code}
        </Link>
      </p>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sub?: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
      <div>
        <p className="font-medium">{label}</p>
        {sub && <p className="text-muted-foreground text-xs">{sub}</p>}
      </div>
    </div>
  );
}
