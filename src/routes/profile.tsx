import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BadgeCheck,
  BarChart3,
  Camera,
  Crown,
  Globe,
  Lock,
  QrCode,
  Settings,
  Sparkles,
  TrendingUp,
  Wallet2,
} from "lucide-react";
import { useVyzun } from "@/lib/vyzun-store";
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
  const { state } = useVyzun();
  const [tab, setTab] = useState<"reels" | "aura" | "scans">("reels");
  const [sheet, setSheet] = useState<null | "prime" | "creator" | "settings">(null);
  const p = state.profile;

  return (
    <div className="pb-28">
      <header className="mx-auto max-w-lg px-5 pt-6">
        <div className="flex items-center gap-4">
          <div className="relative">
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
          <div className="min-w-0">
            <h1 className="flex items-center gap-1.5 text-xl font-semibold">
              {p.displayName}
              {p.verified && <BadgeCheck className="h-5 w-5 text-cyan" />}
            </h1>
            <p className="text-sm text-muted-foreground">@{p.username}</p>
            <p className="mt-1 text-sm">{p.bio}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          {[
            { label: "Vibers", value: p.vibers },
            { label: "Vibing", value: p.vibing },
            { label: "Aura Cards", value: state.auraCards.length },
          ].map((s) => (
            <div key={s.label} className="glass-card py-3">
              <p className="font-display text-lg font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button className="flex-1 rounded-xl border border-glass-border py-2.5 text-sm tap active:tap-active">
            Edit Profile
          </button>
          <button
            aria-label="Share QR"
            className="grid w-11 place-items-center rounded-xl border border-glass-border tap active:tap-active"
          >
            <QrCode className="h-4 w-4" />
          </button>
          <button
            onClick={() => setSheet("settings")}
            aria-label="Settings"
            className="grid w-11 place-items-center rounded-xl border border-glass-border tap active:tap-active"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          <button
            onClick={() => setSheet("prime")}
            className="glass-card flex items-center gap-3 p-4 text-left tap active:tap-active"
          >
            <Crown className="h-5 w-5 text-magenta" />
            <span>
              <span className="block text-sm font-semibold">VYZUN Prime</span>
              <span className="text-xs text-muted-foreground">
                {p.prime ? "Active" : "Premium aura, themes & creator tools"}
              </span>
            </span>
          </button>
          <button
            onClick={() => setSheet("creator")}
            className="glass-card flex items-center gap-3 p-4 text-left tap active:tap-active"
          >
            <Wallet2 className="h-5 w-5 text-cyan" />
            <span>
              <span className="block text-sm font-semibold">Creator Dashboard &amp; Earnings</span>
              <span className="text-xs text-muted-foreground">Real-money earnings, payouts & analytics</span>
            </span>
          </button>
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-lg px-5">
        <div className="flex gap-2">
          {(["reels", "aura", "scans"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 rounded-xl border border-glass-border py-2 text-sm capitalize tap active:tap-active",
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
              <div key={i} className="aspect-[9/16] rounded-xl border border-glass-border bg-gradient-vyzun/10" />
            ))}
            <p className="col-span-3 mt-2 text-center text-xs text-muted-foreground">
              Upload your first original Reel to start building Vibers.
            </p>
          </div>
        )}

        {tab === "aura" && (
          <div className="mt-4 space-y-2">
            {state.auraCards.length === 0 && (
              <p className="glass-card p-6 text-center text-sm text-muted-foreground">
                No Aura Cards yet — run a scan.
              </p>
            )}
            {state.auraCards.map((c) => (
              <div key={c.id} className="glass-card flex items-center gap-3 p-4">
                <Sparkles className="h-5 w-5 text-magenta" />
                <div>
                  <p className="text-sm font-medium">{c.headline}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.rarity} · score {c.score} · top {c.percentile}%
                  </p>
                </div>
              </div>
            ))}
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
        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
          <TrendingUp className="h-3.5 w-3.5" /> Verification and Prime are separate on VYZUN.
        </p>
      </main>

      <PrimeSheet open={sheet === "prime"} onClose={() => setSheet(null)} />
      <CreatorDashboardSheet open={sheet === "creator"} onClose={() => setSheet(null)} />
      <SettingsSheet
        open={sheet === "settings"}
        onClose={() => setSheet(null)}
        onOpenPrime={() => setSheet("prime")}
        onOpenCreator={() => setSheet("creator")}
      />

    </div>
  );
}
