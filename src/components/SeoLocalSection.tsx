import { MapPin, HelpCircle, Wrench } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useT } from "@/lib/i18n";

export function SeoLocalSection() {
  const t = useT();
  const s = t.seo;

  return (
    <section
      id="kktc-teknik-servis"
      className="py-20 bg-muted/30 border-y border-border/50"
      aria-labelledby="seo-local-heading"
    >
      <div className="container mx-auto px-4 max-w-5xl space-y-16">
        <div className="text-center max-w-3xl mx-auto reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <MapPin className="h-3.5 w-3.5" />
            {s.areasLabel}
          </div>
          <h2 id="seo-local-heading" className="font-display text-3xl md:text-4xl font-bold mb-4">
            {s.areasTitle}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">{s.areasSub}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 reveal">
          {s.areas.map((area: string) => (
            <div
              key={area}
              className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-3 text-sm font-medium shadow-sm"
            >
              <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              {area}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start reveal">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Wrench className="h-3.5 w-3.5" />
              {s.servicesLabel}
            </div>
            <h3 className="font-display text-2xl font-bold mb-4">{s.servicesTitle}</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">{s.servicesSub}</p>
            <ul className="space-y-3">
              {s.serviceBullets.map((item: string) => (
                <li key={item} className="flex gap-3 text-sm text-foreground/90">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <HelpCircle className="h-3.5 w-3.5" />
              {s.faqLabel}
            </div>
            <h3 className="font-display text-2xl font-bold mb-4">{s.faqTitle}</h3>
            <Accordion type="single" collapsible className="rounded-2xl border border-border/60 bg-card px-4">
              {s.faqs.map((faq: { q: string; a: string }, i: number) => (
                <AccordionItem key={faq.q} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
