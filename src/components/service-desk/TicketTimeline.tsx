import { CheckCircle2, Circle, Wrench, UserPlus, Camera, Package } from "lucide-react";
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/service-desk/constants";
import type { ServiceStatus, TicketEvent } from "@/lib/service-desk/types";
import { formatDateTime } from "@/lib/service-desk/utils";
import { cn } from "@/lib/utils";

const eventIcon = {
  status: Circle,
  note: Circle,
  assignment: UserPlus,
  photo: Camera,
  work: Wrench,
  part: Package,
  invoice: Package,
} as const;

export function StatusStepper({ status }: { status: ServiceStatus }) {
  const current = STATUS_ORDER.indexOf(status);
  return (
    <div className="flex flex-wrap gap-1">
      {STATUS_ORDER.map((s, i) => (
        <div
          key={s}
          className={cn(
            "flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
            i <= current ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
          )}
        >
          {i < current ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
          <span className="hidden sm:inline">{STATUS_LABELS[s]}</span>
        </div>
      ))}
    </div>
  );
}

export function TicketTimeline({ events }: { events: TicketEvent[] }) {
  if (!events.length) {
    return <p className="text-sm text-muted-foreground">Henüz kayıt yok.</p>;
  }
  return (
    <ol className="relative border-l border-border ml-3 space-y-6">
      {events.map((e) => {
        const Icon = eventIcon[e.type] ?? Circle;
        return (
          <li key={e.id} className="ml-6">
            <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 ring-4 ring-background">
              <Icon className="h-3 w-3 text-primary" />
            </span>
            <time className="text-xs text-muted-foreground">{formatDateTime(e.createdAt)}</time>
            <p className="text-sm font-medium mt-0.5">{e.message}</p>
            <p className="text-xs text-muted-foreground">{e.createdByName}</p>
          </li>
        );
      })}
    </ol>
  );
}

