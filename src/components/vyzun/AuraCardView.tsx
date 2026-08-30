import { BadgeCheck } from "lucide-react";
import type { AuraCard } from "@/lib/vyzun-store";
import { Wordmark } from "./Logo";

export function AuraCardView({
  card,
  username,
  prime,
}: {
  card: AuraCard;
  username: string;
  prime?: boolean;
}) {
  return (
    <article className="glass-card relative mt-4 aspect-[9/16] overflow-hidden p-6">
      <div className="absolute inset-0 bg-gradient-vyzun opacity-20" />
      {prime && (
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-vyzun opacity-40 blur-3xl" />
      )}
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between">
          <p className="font-medium">@{username}</p>
          {prime && (
            <span className="flex items-center gap-1 rounded-full bg-gradient-vyzun px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">
              <BadgeCheck className="h-3 w-3" /> PRIME
            </span>
          )}
        </div>

        <div className="mt-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{card.rarity}</p>
          <p className="font-display text-6xl font-bold">{card.score}</p>
          <p className="text-gradient font-display text-2xl font-semibold">{card.headline}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Top {card.percentile}% aura percentile · personal reading only
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {card.lines.map((line) => (
              <li key={line} className="rounded-xl border border-glass-border px-3 py-2">
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>Beat my Aura →</span>
          <Wordmark className="text-base" />
        </div>
      </div>
    </article>
  );
}
