/**
 * Ana sayfa hero — teknik servis / altyapı hissi veren animasyonlu arka plan katmanı.
 * prefers-reduced-motion destekli.
 */
export function HeroTechBackdrop() {
  return (
    <div className="hero-tech-bg pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="hero-tech-orb hero-tech-orb-a" />
      <div className="hero-tech-orb hero-tech-orb-b" />
      <div className="hero-tech-orb hero-tech-orb-c" />

      <div className="hero-tech-grid" />
      <div className="hero-tech-vignette" />
      <div className="hero-tech-scan" />

      <svg
        className="hero-tech-circuit absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heroCircuitStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.18 230)" stopOpacity="0" />
            <stop offset="40%" stopColor="oklch(0.7 0.18 230)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="oklch(0.78 0.18 65)" stopOpacity="0.35" />
          </linearGradient>
          <radialGradient id="heroNodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.75 0.16 230)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="oklch(0.75 0.16 230)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="hero-tech-traces" fill="none" stroke="url(#heroCircuitStroke)" strokeWidth="1.25">
          <path d="M80 120 H320 V280 H520" />
          <path d="M520 280 H720 V160 H980" />
          <path d="M200 520 H480 V400 H680 V620 H900" />
          <path d="M980 160 V360 H1100" />
          <path d="M80 620 H280 V720" />
          <path d="M720 480 H860 V640 H1040" />
          <path d="M400 80 V200 H560" />
        </g>

        <g className="hero-tech-pulses" fill="none" stroke="oklch(0.78 0.14 230)" strokeWidth="2" strokeLinecap="round">
          <path className="hero-tech-pulse" d="M80 120 H320 V280 H520" pathLength="1" />
          <path
            className="hero-tech-pulse hero-tech-pulse-delay"
            d="M200 520 H480 V400 H680 V620 H900"
            pathLength="1"
          />
          <path className="hero-tech-pulse hero-tech-pulse-delay-2" d="M980 160 V360 H1100" pathLength="1" />
          <path className="hero-tech-pulse hero-tech-pulse-delay" d="M720 480 H860 V640 H1040" pathLength="1" />
        </g>

        <g className="hero-tech-nodes">
          {[
            [320, 120],
            [520, 280],
            [720, 160],
            [480, 520],
            [680, 400],
            [900, 620],
            [980, 360],
            [860, 480],
          ].map(([x, y], i) => (
            <g key={i} className="hero-tech-node" style={{ animationDelay: `${i * 0.35}s` }}>
              <circle cx={x} cy={y} r="14" fill="url(#heroNodeGlow)" opacity="0.45" />
              <circle cx={x} cy={y} r="3.5" fill="oklch(0.85 0.12 230)" />
              <circle
                cx={x}
                cy={y}
                r="7"
                fill="none"
                stroke="oklch(0.7 0.18 230)"
                strokeOpacity="0.5"
                strokeWidth="1"
              />
            </g>
          ))}
        </g>

        <g className="hero-tech-hud" fill="none" stroke="oklch(0.7 0.18 230)" strokeOpacity="0.35" strokeWidth="1.5">
          <path d="M40 80 V40 H90" />
          <path d="M1160 80 V40 H1110" />
          <path d="M40 720 V760 H90" />
          <path d="M1160 720 V760 H1110" />
        </g>
      </svg>

      <div className="hero-tech-stream hidden md:block" />
    </div>
  );
}
