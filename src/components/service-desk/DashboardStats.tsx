import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  accent = "primary",
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  accent?: "primary" | "amber" | "destructive" | "emerald";
}) {
  const ring = {
    primary: "from-primary/20 to-primary/5 text-primary",
    amber: "from-amber-500/20 to-amber-500/5 text-amber-600",
    destructive: "from-destructive/20 to-destructive/5 text-destructive",
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-600",
  }[accent];

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur overflow-hidden relative">
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", ring)} />
      <CardHeader className="relative flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn("rounded-lg p-2 bg-background/80", ring.split(" ").pop())}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <p className="text-3xl font-bold font-display tracking-tight">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}
