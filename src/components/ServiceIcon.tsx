import { AirVent, ChefHat, Zap, Droplets, Hammer, Siren, type LucideIcon } from "lucide-react";

const map: Record<string, LucideIcon> = { AirVent, ChefHat, Zap, Droplets, Hammer, Siren };

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = map[name] ?? Hammer;
  return <Icon className={className} />;
}
