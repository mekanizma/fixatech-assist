import { useEffect, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

export function ClientOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) {
    return (
      fallback ?? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    );
  }
  return children;
}
