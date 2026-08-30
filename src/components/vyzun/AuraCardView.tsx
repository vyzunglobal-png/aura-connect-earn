import { BadgeCheck, X } from "lucide-react";
import type { AuraCard } from "@/lib/vyzun-store";
import { Logo, Wordmark } from "./Logo";
import { cn } from "@/lib/utils";

/**
 * Sleek vertical Aura Card: deep navy surface + neon gradient border.
 * Logo top-left, rarity badge top-right, big glowing score, percentile pill.
 */
export function AuraCardView({
  card,
  username,
  prime,
  className,
  compact = false,
}: {
  card: AuraCard;
  username: string;
  prime?: boolean;
  className?: string;
  compact?: boolean;
}) {
  return (
    <article
      className={cn(
        "neon-frame relative w-full overflow-hidden",
        compact ? "aspect-[3/4] p-4" : "aspect-[9/16] p-6",
        className,
      )}
    >
      <div className="absolute inset-x-0 -top-16 h-40 bg-gradient-vyzun opacity-20 blur-3xl" />
      <div className="absolute -bottom-20 -right-10 h-48 w-48 rounded-full bg-gradient-vyzun opacity-15 blur-3xl" />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-2">
          <Logo className={compact ? "h-7 w-7" : "h-9 w-9"} />
          <span
            className={cn(
              "rounded-full bg-gradient-vyzun font-semibold uppercase tracking-wide text-primary-foreground",
              compact ? "px-2 py-0.5 text-[9px]" : "px-3 py-1 text-[10px]",
            )}
          >
            {card.rarity}
          </span>
        </div>

        <p className={cn("mt-3 text-muted-foreground", compact ? "text-[11px]" : "text-sm")}>
          @{username}
          {prime && (
            <span className="ml-1.5 inline-flex items-center gap-1 align-middle text-cyan">
              <BadgeCheck className={compact ? "h-3 w-3" : "h-4 w-4"} /> PRIME
            </span>
          )}
        </p>

        <p
          className={cn(
            "text-gradient font-display font-bold leading-none",
            compact ? "mt-2 text-5xl" : "mt-4 text-7xl",
          )}
        >
          {card.score}
        </p>

        <span
          className={cn(
            "mt-3 self-start rounded-full border border-glass-border font-semibold text-cyan",
            compact ? "px-2.5 py-1 text-[10px]" : "px-3.5 py-1.5 text-xs",
          )}
        >
          Top {card.percentile}% worldwide
        </span>

        {!compact && (
          <ul className="mt-5 space-y-2 text-sm">
            {card.lines.map((line) => (
              <li key={line} className="rounded-xl border border-glass-border px-3 py-2">
                {line}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-4">
          <p className={cn("font-display font-semibold", compact ? "text-sm" : "text-lg")}>
            {card.headline}
          </p>
          <div className="mt-1 flex items-center justify-between">
            <p className={cn("text-muted-foreground", compact ? "text-[10px]" : "text-xs")}>
              {card.lines[0] ?? "You are hiding a plan"}
            </p>
            {!compact && <Wordmark className="text-base" />}
          </div>
        </div>
      </div>
    </article>
  );
}

/** Full-screen detail view for a tapped Aura Card. */
export function AuraCardModal({
  card,
  username,
  prime,
  onClose,
}: {
  card: AuraCard | null;
  username: string;
  prime?: boolean;
  onClose: () => void;
}) {
  if (!card) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Aura Card details"
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-background/95 px-5 pb-10 pt-6 backdrop-blur-xl"
    >
      <button
        onClick={onClose}
        aria-label="Close Aura Card"
        className="ml-auto grid h-10 w-10 place-items-center rounded-full border border-glass-border tap active:tap-active"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="anim-rise mx-auto mt-3 w-full max-w-sm">
        <AuraCardView card={card} username={username} prime={prime ?? false} />
        <button
          onClick={async () => {
            const text = `My VYZUN aura is ${card.score} (${card.rarity}). Beat my Aura → VYZUN`;
            if (navigator.share) await navigator.share({ title: "VYZUN Aura", text }).catch(() => {});
            else await navigator.clipboard?.writeText(text);
          }}
          className="mt-4 w-full rounded-2xl bg-gradient-vyzun py-3.5 font-bold text-primary-foreground tap active:tap-active"
        >
          Share this Aura Card
        </button>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          Scanned {new Date(card.createdAt).toLocaleString()} · entertainment reading only
        </p>
      </div>
    </div>
  );
}
