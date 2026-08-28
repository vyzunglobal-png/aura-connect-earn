import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Camera, Heart, ImageUp, RefreshCcw, Share2, Sparkles, Wand2 } from "lucide-react";
import { AppHeader } from "@/components/vyzun/AppHeader";
import { AuraCardView } from "@/components/vyzun/AuraCardView";
import { CrushMatcher } from "@/components/vyzun/CrushMatcher";
import { useVyzun, type AuraCard } from "@/lib/vyzun-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VYZUN Scan — AI Aura Scanner" },
      {
        name: "description",
        content:
          "Scan your vibe with the VYZUN AI scanner, generate an Aura Card and share it. Watch. Create. Vibe. Earn.",
      },
      { property: "og:title", content: "VYZUN Scan — AI Aura Scanner" },
      {
        property: "og:description",
        content: "Generate your AI Aura Card on VYZUN and share your vibe with the world.",
      },
    ],
  }),
  component: ScanPage,
});

const MODES = [
  { key: "secrets", label: "Secrets", icon: Sparkles, blurb: "Hidden feelings & mystery" },
  { key: "love", label: "Love & Crush", icon: Heart, blurb: "Crush energy for fun" },
  { key: "future", label: "Future & Vibe", icon: Wand2, blurb: "Personality & vibe read" },
] as const;

const RARITIES = ["Common", "Rare", "Epic", "Legendary", "Mythic"];

function generateAura(mode: AuraCard["mode"]): AuraCard {
  const score = 40 + Math.floor(Math.random() * 60);
  const rarity = RARITIES[Math.min(RARITIES.length - 1, Math.floor(score / 21))];
  const copy: Record<AuraCard["mode"], { headline: string; lines: string[] }> = {
    secrets: {
      headline: "Quiet Storm Aura",
      lines: [
        "You keep more than you say — and people feel it.",
        "Someone has been meaning to tell you something.",
        "Your calm is read as confidence.",
      ],
    },
    love: {
      headline: "Magnetic Heart Aura",
      lines: [
        "You attract people who like depth over noise.",
        "A slow start suits you better than a spark.",
        "Someone rereads your messages.",
      ],
    },
    future: {
      headline: "Neon Momentum Aura",
      lines: [
        "The next 90 days reward consistency, not intensity.",
        "Your creative streak is early, not late.",
        "You do best when you build in public.",
      ],
    },
  };
  return {
    id: crypto.randomUUID(),
    mode,
    score,
    rarity: rarity ?? "Rare",
    percentile: Math.max(1, 100 - score),
    createdAt: Date.now(),
    ...copy[mode],
  };
}

function ScanPage() {
  const { state, update } = useVyzun();
  const [mode, setMode] = useState<AuraCard["mode"]>("secrets");
  const [scanning, setScanning] = useState(false);
  const [card, setCard] = useState<AuraCard | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function requestCamera() {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      stream.getTracks().forEach((t) => t.stop());
      runScan();
    } catch {
      setCameraError("Camera unavailable. You can upload a photo from your gallery instead.");
    }
  }

  function runScan() {
    setScanning(true);
    window.setTimeout(() => {
      const next = generateAura(mode);
      setCard(next);
      setScanning(false);
      update((s) => ({
        auraCards: [next, ...s.auraCards].slice(0, 30),
        scans: [{ id: next.id, mode, createdAt: next.createdAt }, ...s.scans].slice(0, 50),
      }));
    }, 1400);
  }

  return (
    <div className="pb-28">
      <AppHeader />

      <main className="mx-auto max-w-lg px-5">
        <h1 className="sr-only">VYZUN AI Scanner</h1>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {MODES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border border-glass-border px-4 py-2 text-sm tap active:tap-active",
                mode === key && "bg-gradient-vyzun text-primary-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {MODES.find((m) => m.key === mode)?.blurb} · AI entertainment experience, not a prediction.
        </p>

        <div className="glass-card relative mt-5 aspect-[3/4] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-vyzun opacity-10" />
          <div className="absolute inset-6 rounded-3xl border border-glass-border" />
          {["left-4 top-4", "right-4 top-4", "left-4 bottom-4", "right-4 bottom-4"].map((pos) => (
            <span
              key={pos}
              className={cn("absolute h-8 w-8 rounded-lg border-2 border-cyan/70", pos)}
              aria-hidden
            />
          ))}
          <div className="absolute inset-0 grid place-items-center">
            <div className="anim-float h-40 w-32 rounded-[50%] border border-magenta/50 neon-ring" />
          </div>
          {scanning && (
            <div className="anim-scanline absolute inset-x-6 top-1/2 h-16 bg-gradient-vyzun opacity-40 blur-md" />
          )}
          <p className="absolute inset-x-0 bottom-6 text-center text-xs text-muted-foreground">
            {scanning ? "Reading your aura…" : "Align your face inside the frame"}
          </p>
        </div>

        {cameraError && (
          <p className="mt-3 rounded-xl border border-destructive/40 px-4 py-3 text-sm text-muted-foreground">
            {cameraError}
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={requestCamera}
            disabled={scanning}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-vyzun py-3 font-semibold text-primary-foreground tap active:tap-active disabled:opacity-60"
          >
            <Camera className="h-4 w-4" /> {scanning ? "Scanning…" : "Start Scan"}
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={scanning}
            className="flex items-center justify-center gap-2 rounded-xl border border-glass-border py-3 font-semibold tap active:tap-active disabled:opacity-60"
          >
            <ImageUp className="h-4 w-4" /> Upload
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={() => runScan()}
          />
        </div>

        {card && (
          <section className="anim-rise mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your Aura Card</h2>
              <button
                onClick={runScan}
                className="flex items-center gap-1.5 text-xs text-muted-foreground tap active:tap-active"
              >
                <RefreshCcw className="h-3.5 w-3.5" /> Regenerate
              </button>
            </div>
            <AuraCardView card={card} username={state.profile.username} prime={state.profile.prime} />
            <button
              onClick={async () => {
                const text = `My VYZUN aura is ${card.score} (${card.rarity}). Beat my Aura → VYZUN`;
                if (navigator.share) await navigator.share({ title: "VYZUN Aura", text }).catch(() => {});
                else await navigator.clipboard?.writeText(text);
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-vyzun py-3 font-semibold text-primary-foreground tap active:tap-active"
            >
              <Share2 className="h-4 w-4" /> Share “Beat my Aura → VYZUN”
            </button>
          </section>
        )}

        <CrushMatcher />
      </main>
    </div>
  );
}
