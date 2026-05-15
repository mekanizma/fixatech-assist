import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type HeroTitleSegment = { text: string; emphasis?: boolean };

export function HeroHeadline({ segments }: { segments: HeroTitleSegment[] }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <h1 className="font-display text-[clamp(2rem,5.5vw,4.5rem)] font-bold leading-[1.08] tracking-tight">
      <span className="hero-title-wrap relative block">
        {segments.map((seg, i) => (
          <span
            key={`${seg.text}-${i}`}
            className={cn(
              "hero-word mr-[0.28em] inline-block last:mr-0",
              ready && "hero-word-in",
              seg.emphasis && "hero-word-emphasis text-gradient-accent",
            )}
            style={{ animationDelay: `${0.15 + i * 0.11}s` }}
          >
            {seg.text}
          </span>
        ))}
        <span
          className={cn("hero-title-line mt-4 block h-1 rounded-full", ready && "hero-title-line-in")}
          aria-hidden
        />
      </span>
    </h1>
  );
}
