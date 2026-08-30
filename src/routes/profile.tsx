import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BadgeCheck,
  BarChart3,
  Camera,
  Crown,
  Globe,
  Lock,
  Plus,
  QrCode,
  Settings,
} from "lucide-react";
import { useVyzun, type AuraCard } from "@/lib/vyzun-store";
import { AuraCardModal, AuraCardView } from "@/components/vyzun/AuraCardView";
import { CreatorDashboardSheet } from "@/components/vyzun/CreatorDashboardSheet";
import { PrimeSheet } from "@/components/vyzun/PrimeSheet";
import { SettingsSheet } from "@/components/vyzun/SettingsSheet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your VYZUN Profile — Vibers, Reels & Creator Tools" },
      {
        name: "description",
        content:
          "Manage your VYZUN identity: Vibers, Vibing, Reels, Aura Cards, Scan history, Prime and the Creator Dashboard.",
      },
      { property: "og:title", content: "Your VYZUN Profile" },
      {
        property: "og:description",
        content: "Vibers, Reels, Aura Cards, Prime and real-money creator earnings on VYZUN.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { state, update } = useVyzun();
  const [tab, setTab] = useState<"reels" | "aura" | "scans">("reels");
  const [sheet, setSheet] = useState<null | "prime" | "creator" | "settings">(null);
  const [openCard, setOpenCard] = useState<AuraCard | null>(null);
  const [editing, setEditing] = useState(false);
  const p = state.profile;

  const hearts = 1_400_000 + p.vibers * 12;

  return (
    <div className="pb-28">
      <header className="mx-auto max-w-lg px-5 pt-6">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-vyzun text-2xl font-bold text-primary-foreground">
              {p.username[0]?.toUpperCase()}
            </span>
            <button
              aria-label="Change photo"
              className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border border-glass-border bg-background tap active:tap-active"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <h1 className="flex items-center gap-1.5 text-xl font-semibold">
                  <span className="truncate">{p.displayName}</span>
                  {p.verified && <BadgeCheck className="h-5 w-5 shrink-0 text-cyan" />}
                </h1>
                <p className="text-sm text-muted-foreground">@{p.username}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  aria-label="Profile QR code"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-glass-border tap active:tap-active"
                >
                  <QrCode className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSheet("settings")}
                  aria-label="Settings"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-glass-border tap active:tap-active"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-1.5 text-sm">{p.bio}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2.5 text-center">
          {[
            { label: "Vibers", value: compact(p.vibers) },
            { label: "Vibing With", value: compact(p.vibing) },
            { label: "Hearts", value: compact(hearts) },
          ].map((s) => (
            <div key={s.label} className="rounded-full border border-glass-border bg-card/60 py-2.5">
              <p className="font-display text-base font-bold">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2.5">
          <button
            onClick={() => setEditing((e) => !e)}
            className="flex-1 rounded-xl border border-glass-border py-2.5 text-sm font-semibold tap active:tap-active"
          >
            Edit Profile
          </button>
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-vyzun py-2.5 text-sm font-bold text-primary-foreground tap active:tap-active">
            <Plus className="h-4 w-4" /> Vibe With
          </button>
        </div>

        {editing && (
          <div className="anim-rise mt-3 space-y-2 rounded-2xl border border-glass-border p-4">
            {(
              [
                ["displayName", "Display name"],
                ["username", "Username"],
                ["bio", "Bio"],
              ] as const
            ).map(([field, label]) => (
              <label key={field} className="block text-xs text-muted-foreground">
                {label}
                <input
                  value={p[field]}
                  onChange={(e) =>
                    update((s) => ({ profile: { ...s.profile, [field]: e.target.value } }))
                  }
                  className="mt-1 w-full rounded-xl border border-glass-border bg-transparent px-3 py-2 text-sm text-foreground outline-none"
                />
              </label>
            ))}
            <button
              onClick={() => setEditing(false)}
              className="w-full rounded-xl bg-gradient-vyzun py-2.5 text-sm font-semibold text-primary-foreground tap active:tap-active"
            >
              Save
            </button>
          </div>
        )}

        <button
          onClick={() => setSheet("prime")}
          className="neon-frame mt-4 flex w-full items-center gap-3 p-4 text-left tap active:tap-active"
        >
          <span className="absolute inset-0 bg-gradient-vyzun opacity-15" aria-hidden />
          <Crown className="relative h-5 w-5 text-magenta" />
          <span className="relative">
            <span className="block text-sm font-bold">Go VYZUN Premium</span>
            <span className="text-xs text-muted-foreground">
              {p.prime ? "Prime active" : "Premium aura, themes & creator tools"}
            </span>
          </span>
        </button>

        <button
          onClick={() => setSheet("creator")}
          className="glass-card mt-3 flex w-full items-center gap-3 p-4 text-left tap active:tap-active"
        >
          <BarChart3 className="h-5 w-5 text-cyan" />
          <span>
            <span className="block text-sm font-semibold">Creator Dashboard &amp; Earnings</span>
            <span className="text-xs text-muted-foreground">
              Ad revenue, brand missions, affiliate & subscriptions in real currency
            </span>
          </span>
        </button>
      </header>

      <main className="mx-auto mt-6 max-w-lg px-5">
        <div className="flex gap-2">
          {(["reels", "aura", "scans"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 rounded-xl border border-glass-border py-2 text-sm tap active:tap-active",
                tab === t && "bg-gradient-vyzun text-primary-foreground",
              )}
            >
              {t === "aura" ? "Aura Cards" : t === "scans" ? "Scan History" : "Reels"}
            </button>
          ))}
        </div>

        {tab === "reels" && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[9/16] rounded-xl border border-glass-border" />
            ))}
            <p className="col-span-3 mt-2 text-center text-xs text-muted-foreground">
              Upload your first original Reel to start building Vibers.
            </p>
          </div>
        )}

        {tab === "aura" && (
          <div className="mt-4">
            {state.auraCards.length === 0 ? (
              <p className="glass-card p-6 text-center text-sm text-muted-foreground">
                No Aura Cards yet — run a scan.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {state.auraCards.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setOpenCard(c)}
                    aria-label={`Open Aura Card ${c.headline}`}
                    className="text-left tap active:tap-active"
                  >
                    <AuraCardView card={c} username={p.username} prime={p.prime} compact />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "scans" && (
          <div className="mt-4 space-y-2">
            {state.scans.length === 0 && (
              <p className="glass-card p-6 text-center text-sm text-muted-foreground">No scans yet.</p>
            )}
            {state.scans.map((s) => (
              <div key={s.id} className="glass-card flex items-center justify-between p-4 text-sm">
                <span className="capitalize">{s.mode} scan</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(s.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-muted-foreground">
          <div className="glass-card py-3">
            <BarChart3 className="mx-auto mb-1 h-4 w-4" /> Analytics
          </div>
          <div className="glass-card py-3">
            <Globe className="mx-auto mb-1 h-4 w-4" /> Language
          </div>
          <div className="glass-card py-3">
            <Lock className="mx-auto mb-1 h-4 w-4" /> Privacy
          </div>
        </div>
        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          VYZUN Verified and VYZUN Premium are separate.
        </p>
      </main>

      <AuraCardModal
        card={openCard}
        username={p.username}
        prime={p.prime}
        onClose={() => setOpenCard(null)}
      />
      <PrimeSheet open={sheet === "prime"} onClose={() => setSheet(null)} />
      <CreatorDashboardSheet open={sheet === "creator"} onClose={() => setSheet(null)} />
      <SettingsSheet open={sheet === "settings"} onClose={() => setSheet(null)} />
    </div>
  );
}

function compact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}
