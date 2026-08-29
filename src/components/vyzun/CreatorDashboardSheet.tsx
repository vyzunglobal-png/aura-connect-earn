import { X } from "lucide-react";

/**
 * Real-money creator accounting (INR shown here) — never a virtual wallet.
 * All figures read from the creator earnings ledger; with no ledger connected
 * yet, everything is zero. Nothing here fabricates earnings or payouts.
 */
const REVENUE_LINES = [
  "Ad revenue share",
  "Brand Missions",
  "Affiliate / shopping",
  "Fan subscriptions",
  "Paid creator interactions",
  "Creator challenges",
];

const money = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export function CreatorDashboardSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-background/60 backdrop-blur-sm">
      <div className="glass-card max-h-[85vh] w-full overflow-y-auto rounded-b-none p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Creator Dashboard</h2>
          <button onClick={onClose} aria-label="Close" className="tap active:tap-active">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { label: "Total earnings", value: money(0) },
            { label: "This month", value: money(0) },
            { label: "Pending (fraud checks)", value: money(0) },
            { label: "Available to withdraw", value: money(0) },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-glass-border p-3">
              <p className="font-display text-lg font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-5 text-sm font-semibold">Revenue sources</h3>
        <ul className="mt-2 space-y-2">
          {REVENUE_LINES.map((r) => (
            <li key={r} className="flex items-center justify-between rounded-xl border border-glass-border px-3 py-2 text-sm">
              <span>{r}</span>
              <span className="text-muted-foreground">{money(0)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 rounded-xl border border-glass-border p-4 text-xs text-muted-foreground">
          <p className="text-sm font-semibold text-foreground">Payouts</p>
          <p className="mt-1">
            Withdrawals open once you meet the configured eligibility rules and payout threshold,
            and a compliant payout provider (UPI / bank transfer) is connected. Earnings stay
            pending until fraud checks complete. VYZUN never guarantees creator income.
          </p>
          <button
            disabled
            className="mt-3 w-full rounded-xl bg-gradient-vyzun py-2.5 font-semibold text-primary-foreground opacity-70"
          >
            Withdraw earnings
          </button>
        </div>
      </div>
    </div>
  );
}
