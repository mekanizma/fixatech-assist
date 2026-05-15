import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/site";
import { memo } from "react";

function WhatsAppFabBase() {
  return (
    <div className="fab-root fixed bottom-6 right-6 z-50" style={{ perspective: "800px" }}>
      <div className="relative">
        <span className="pointer-events-none absolute inset-0 rounded-full bg-success animate-ping opacity-40" />
        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="fab-main relative flex items-center gap-2 pl-4 pr-5 py-4 rounded-full text-white font-semibold shadow-3d-accent"
          style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
          aria-label="WhatsApp ile iletişim"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>

      <style>{`
        .fab-root { transform: translateZ(0); }
        .fab-main {
          will-change: transform;
          transform: translate3d(0,0,0) rotateX(0deg);
          transition: transform 350ms cubic-bezier(.2,.9,.25,1.2), box-shadow 350ms ease;
        }
        .fab-main:hover { transform: translate3d(0,-3px,0) rotateX(8deg) scale(1.04); }
        .fab-main:active { transform: translate3d(0,1px,0) rotateX(-4deg) scale(.98); }
        @media (prefers-reduced-motion: reduce) {
          .fab-main { transition: opacity 150ms ease; transform: none !important; }
        }
      `}</style>
    </div>
  );
}

export const WhatsAppFab = memo(WhatsAppFabBase);
