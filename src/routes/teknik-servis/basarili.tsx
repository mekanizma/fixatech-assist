import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { CheckCircle2, Home, ClipboardList, Phone, MessageCircle, ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n";
import { buildNoIndexHead } from "@/lib/seo";
import { PHONE, PHONE_TEL, waLink } from "@/lib/site";

export type TalepSuccessState = {
  productName?: string;
  contactName?: string;
  phone?: string;
};

export const Route = createFileRoute("/teknik-servis/basarili")({
  head: () => buildNoIndexHead("Talebiniz Alındı"),
  component: TalepBasarili,
});

function TalepBasarili() {
  const t = useT();
  const s = t.techService.successPage;
  const state = useRouterState({
    select: (r) => (r.location.state ?? {}) as TalepSuccessState,
  });

  const hasDetail = Boolean(state.productName || state.contactName || state.phone);

  return (
    <section className="relative min-h-[80vh] flex items-center py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-glow/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-success/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-4 relative max-w-2xl">
        <div className="glass rounded-3xl border border-border/60 p-8 md:p-12 text-center shadow-lg">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/15 ring-4 ring-success/20">
            <CheckCircle2 className="h-11 w-11 text-success" />
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">{s.title}</h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">{s.subtitle}</p>

          {hasDetail && (
            <div className="mb-8 rounded-2xl bg-muted/40 border border-border/50 px-5 py-4 text-left text-sm space-y-2">
              <p className="font-semibold text-foreground">{s.summaryTitle}</p>
              {state.contactName && (
                <p>
                  <span className="text-muted-foreground">{s.labelName}:</span> {state.contactName}
                </p>
              )}
              {state.phone && (
                <p>
                  <span className="text-muted-foreground">{s.labelPhone}:</span> {state.phone}
                </p>
              )}
              {state.productName && (
                <p>
                  <span className="text-muted-foreground">{s.labelProduct}:</span> {state.productName}
                </p>
              )}
            </div>
          )}

          <ul className="text-left space-y-3 mb-8 max-w-md mx-auto">
            {(s.steps as string[]).map((step) => (
              <li key={step} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                {step}
              </li>
            ))}
          </ul>

          <p className="text-xs text-muted-foreground mb-8">{s.note}</p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-primary text-primary-foreground font-semibold btn-3d"
            >
              <Home className="h-4 w-4" />
              {s.btnHome}
            </Link>
            <Link
              to="/teknik-servis"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border font-semibold hover:bg-muted/50 transition"
            >
              <ClipboardList className="h-4 w-4" />
              {s.btnNewRequest}
            </Link>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-accent text-accent-foreground font-semibold btn-3d-accent"
            >
              <Phone className="h-4 w-4" />
              {s.btnCall}
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-border/50 flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/iletisim" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
              {s.btnContact} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-success font-medium hover:underline"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </a>
            <span className="text-muted-foreground">{PHONE}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
