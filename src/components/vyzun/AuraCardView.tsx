import { forwardRef } from "react";
import { BadgeCheck, Sparkles } from "lucide-react";
import type { AuraCard } from "@/lib/vyzun-store";
import { Logo, Wordmark } from "./Logo";
import { cn } from "@/lib/utils";

const RARITY_RING: Record<string, string> = {
  Common: "from-slate-400 via-slate-200 to-slate-500",
  Rare: "from-cyan via-sky-200 to-cyan",
  Epic: "from-magenta via-fuchsia-200 to-primary",
  Legendary: "from-amber-300 via-yellow-100 to-amber-500",
  Mythic: "from-magenta via-cyan to-primary",
};

export const AuraCardView = forwardRef<
  HTMLElement,
  { card: AuraCard; username: string; prime?: boolean; className?: string }
>(function AuraCardView({ card, username, prime, className }, ref) {
  const ring = RARITY_RING[card.rarity] ?? RARITY_RING["Epic"]!;

  return (
    <article
      ref={ref}
      className={cn(
        "relative mt-4 aspect-[9/16] w-full overflow-hidden rounded-[28px] border border-glass-border bg-background",
        className,
      )}
    >
      {/* ambient aura FX */}
      <div className="absolute inset-0 bg-gradient-vyzun opacity-25" />
      <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-cyan/40 blur-[70px]" />
      <div className="absolute -right-16 top-1/3 h-56 w-56 rounded-full bg-magenta/40 blur-[70px]" />
      <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-primary/40 blur-[70px]" />
      <div className="absolute inset-0 backdrop-blur-md" />

      <div className="relative flex h-full flex-col p-6">
        <header className="flex items-center justify-between">
          <p className="text-sm font-medium">@{username}</p>
          {prime && (
            <span className="flex items-center gap-1 rounded-full bg-gradient-vyzun px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">
              <BadgeCheck className="h-3 w-3" /> PRIME
            </span>
          )}
        </header>

        {/* scan portrait */}
        <div className="relative mx-auto mt-6 h-36 w-36 shrink-0">
          <div className={cn("absolute -inset-1 rounded-full bg-gradient-to-br opacity-80 blur-md", ring)} />
          <div className="relative h-full w-full overflow-hidden rounded-full border border-glass-border">
            {card.photo ? (
              <img src={card.photo} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center bg-gradient-vyzun/30">
                <Sparkles className="h-10 w-10 text-primary-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-vyzun opacity-25 mix-blend-screen" />
          </div>
        </div>

        <div className="mt-5 text-center">
          <span
            className={cn(
              "inline-block rounded-full bg-gradient-to-r p-[1.5px] text-[10px] font-bold uppercase tracking-[0.28em]",
              ring,
            )}
          >
            <span className="block rounded-full bg-background/80 px-3 py-1">{card.rarity}</span>
          </span>
          <p
            className="font-display text-7xl font-bold leading-none"
            style={{ textShadow: "0 0 24px color-mix(in oklab, var(--primary) 70%, transparent)" }}
          >
            {card.score}
          </p>
          <p className="text-gradient font-display text-2xl font-semibold">{card.headline}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Top {card.percentile}% aura percentile · personal reading only
          </p>
        </div>

        <ul className="mt-5 space-y-2 text-[13px]">
          {card.lines.map((line) => (
            <li
              key={line}
              className="rounded-full border border-glass-border bg-foreground/5 px-4 py-2 text-center leading-snug backdrop-blur-sm"
            >
              {line}
            </li>
          ))}
        </ul>

        <footer className="mt-auto flex items-center justify-between pt-6">
          <span className="text-xs font-semibold">Beat my Aura →</span>
          <span className="flex items-center gap-2">
            <span className="rounded-2xl border border-glass-border bg-foreground/10 p-1.5 backdrop-blur-sm">
              <Logo className="h-6 w-6" />
            </span>
            <Wordmark className="text-base" />
          </span>
        </footer>
      </div>
    </article>
  );
});
