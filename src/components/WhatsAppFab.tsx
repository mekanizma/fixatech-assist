import { MessageCircle, Phone } from "lucide-react";
import { waLink, PHONE_TEL } from "@/lib/site";
import { memo, useCallback, useState } from "react";

function WhatsAppFabBase() {
  const [open, setOpen] = useState(false);

  const handleEnter = useCallback(() => setOpen(true), []);
  const handleLeave = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  return (
    <div
      className="fab-root fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ perspective: "800px" }}
    >
      <a
        href={`tel:${PHONE_TEL}`}
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        className={`fab-child flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-gradient-accent text-accent-foreground font-semibold shadow-3d-accent ${
          open ? "fab-child--open" : "fab-child--closed"
        }`}
      >
        <Phone className="w-5 h-5" /> Ara
      </a>

      <div className="relative">
        <span className="pointer-events-none absolute inset-0 rounded-full bg-success animate-ping opacity-40" />
        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={toggle}
          className="fab-main relative flex items-center gap-2 pl-4 pr-5 py-4 rounded-full text-white font-semibold shadow-3d-accent"
          style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
          aria-label="WhatsApp ile iletişim"
          aria-expanded={open}
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

        .fab-child {
          will-change: transform, opacity;
          transform-origin: bottom right;
          backface-visibility: hidden;
          transition:
            transform 380ms cubic-bezier(.2,.9,.25,1.2),
            opacity 220ms ease;
        }
        .fab-child--closed {
          opacity: 0;
          pointer-events: none;
          transform: translate3d(0,16px,-40px) rotateX(-35deg) scale(.85);
        }
        .fab-child--open {
          opacity: 1;
          pointer-events: auto;
          transform: translate3d(0,0,0) rotateX(0deg) scale(1);
        }
        @media (prefers-reduced-motion: reduce) {
          .fab-main, .fab-child { transition: opacity 150ms ease; transform: none !important; }
        }
      `}</style>
    </div>
  );
}

export const WhatsAppFab = memo(WhatsAppFabBase);
