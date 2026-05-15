import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/lib/service-desk/constants";
import type { ServiceStatus, Urgency } from "@/lib/service-desk/types";
import { cn } from "@/lib/utils";

const statusVariant: Record<ServiceStatus, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  assigned: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  en_route: "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30",
  in_progress: "bg-primary/15 text-primary border-primary/30",
  waiting_parts: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
  completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
};

const urgencyVariant: Record<Urgency, string> = {
  normal: "bg-muted text-muted-foreground",
  urgent: "bg-amber-500/20 text-amber-800 dark:text-amber-200",
  critical: "bg-destructive/15 text-destructive border-destructive/30",
};

export function TicketStatusBadge({ status }: { status: ServiceStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", statusVariant[status])}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const labels = { normal: "Normal", urgent: "Acil", critical: "Kritik" };
  return (
    <Badge variant="outline" className={cn("font-medium", urgencyVariant[urgency])}>
      {labels[urgency]}
    </Badge>
  );
}
