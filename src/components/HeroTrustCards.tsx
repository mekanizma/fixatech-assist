import { useCallback, useRef, type ComponentType, type CSSProperties } from "react";

export type TrustBadge = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  desc: string;
};

const ACCENT_CLASS = ["trust-card-3d--cyan", "trust-card-3d--amber", "trust-card-3d--cyan", "trust-card-3d--amber"] as const;

function TrustCard3D({ badge, index }: { badge: TrustBadge; index: number }) {
  const tiltRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--rx", `${-y * 16}deg`);
    el.style.setProperty("--ry", `${x * 16}deg`);
  }, []);

  const resetTilt = useCallback(() => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);

  const Icon = badge.icon;
  const style = {
    "--trust-delay": `${index * 110}ms`,
    "--trust-float-delay": `${index * 0.65}s`,
  } as CSSProperties;

  return (
    <div className="trust-card-wrap" style={style}>
      <div
        ref={tiltRef}
        className={`trust-card-3d ${ACCENT_CLASS[index % ACCENT_CLASS.length]}`}
        onMouseMove={handleMove}
        onMouseLeave={resetTilt}
      >
        <div className="trust-card-border" aria-hidden />
        <div className="trust-card-shine" aria-hidden />
        <div className="trust-card-glow" aria-hidden />

        <div className="trust-card-body">
          <div className="trust-card-icon-wrap">
            <span className="trust-card-icon-ring" aria-hidden />
            <span className="trust-card-icon">
              <Icon className="h-6 w-6 text-primary-foreground" />
            </span>
          </div>
          <div className="trust-card-copy">
            <h3 className="trust-card-title">{badge.label}</h3>
            <p className="trust-card-desc">{badge.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroTrustCards({ badges }: { badges: TrustBadge[] }) {
  return (
    <div className="trust-cards-stage">
      <div className="trust-cards-aura" aria-hidden />
      <div className="trust-cards-grid">
        {badges.map((badge, i) => (
          <TrustCard3D key={badge.label} badge={badge} index={i} />
        ))}
      </div>
    </div>
  );
}
