import { MessageCircle, Phone } from "lucide-react";
import { waLink, PHONE_TEL } from "@/lib/site";
import { useState } from "react";

export function WhatsAppFab() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <a
            href={`tel:${PHONE_TEL}`}
            className="flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-gradient-accent text-accent-foreground font-semibold shadow-3d-accent btn-3d-accent"
          >
            <Phone className="w-5 h-5" /> Ara
          </a>
        </div>
      )}
      <div className="relative">
        <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-40" />
        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="relative flex items-center gap-2 pl-4 pr-5 py-4 rounded-full text-white font-semibold shadow-3d-accent btn-3d-accent"
          style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
          aria-label="WhatsApp ile iletişim"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
