import { useState } from "react";
import { BadgeCheck, Crown, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * VYZUN Prime + Prime Creator. Pricing is configurable from Admin.
 * No fake payment success: checkout requires a real payment provider,
 * and subscription state must be verified server-side.
 */
const PLANS = [
  { id: "prime-monthly", tier: "Prime", label: "₹99 / month", note: "Cancel anytime" },
  { id: "prime-yearly", tier: "Prime", label: "₹799 / year", note: "Best value" },
  { id: "creator-monthly", tier: "Prime Creator", label: "₹199 / month", note: "Creator tools" },
  { id: "creator-yearly", tier: "Prime Creator", label: "₹1,499 / year", note: "Best value" },
];

const PRIME_BENEFITS = [
  "Premium badge",
  "Ad-free where supported",
  "Premium Aura effects & card designs",
  "Advanced Aura analysis",
  "Premium themes & profile effects",
  "Advanced analytics",
  "Early feature access",
];

const CREATOR_BENEFITS = [
  "Advanced creator analytics",
  "Earnings dashboard",
  "Brand Mission access",
  "Affiliate tools",
  "Creator AI tools & audience insights",
  "Advanced Reel tools",
];

export function PrimeSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState("prime-yearly");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-background/60 backdrop-blur-sm">
      <div className="glass-card max-h-[85vh] w-full overflow-y-auto rounded-b-none p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Crown className="h-5 w-5 text-magenta" /> VYZUN Prime
          </h2>
          <button onClick={onClose} aria-label="Close" className="tap active:tap-active">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {PLANS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={cn(
                "rounded-xl border border-glass-border p-3 text-left tap active:tap-active",
                selected === p.id && "bg-gradient-vyzun text-primary-foreground",
              )}
            >
              <span className="block text-[10px] uppercase tracking-wide opacity-80">{p.tier}</span>
              <span className="block text-sm font-semibold">{p.label}</span>
              <span className="text-[11px] opacity-80">{p.note}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <section>
            <h3 className="text-sm font-semibold">Prime includes</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              {PRIME_BENEFITS.map((b) => (
                <li key={b} className="flex gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan" /> {b}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="text-sm font-semibold">Prime Creator adds</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              {CREATOR_BENEFITS.map((b) => (
                <li key={b} className="flex gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-magenta" /> {b}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <button
          disabled
          className="mt-5 w-full rounded-xl bg-gradient-vyzun py-3 font-semibold text-primary-foreground opacity-70"
        >
          Continue to secure checkout
        </button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Checkout activates once a real payment provider is connected. Prime does not grant
          VYZUN Verified — verification is a separate identity review.
        </p>
      </div>
    </div>
  );
}
