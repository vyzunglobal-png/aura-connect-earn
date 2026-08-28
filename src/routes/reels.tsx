import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  BadgeCheck,
  Bookmark,
  MessageSquare,
  Music2,
  Plus,
  Share2,
  UserRound,
} from "lucide-react";
import { REACTIONS, useVyzun, type ReactionKey } from "@/lib/vyzun-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reels")({
  head: () => ({
    meta: [
      { title: "VYZUN Reels — Vertical Video Feed" },
      {
        name: "description",
        content:
          "Watch full-screen vertical reels on VYZUN, vibe with creators and build your audience. Comedy, trending and more.",
      },
      { property: "og:title", content: "VYZUN Reels — Vertical Video Feed" },
      {
        property: "og:description",
        content: "Full-screen vertical video, VYZUN reactions and creator discovery.",
      },
    ],
  }),
  component: ReelsPage,
});

const CATEGORIES = ["Following", "For You", "Trending", "New", "Comedy"] as const;

type Reel = {
  id: string;
  creator: string;
  verified: boolean;
  caption: string;
  hashtags: string[];
  views: string;
  audio: string;
  counts: Record<ReactionKey, number>;
};

const REELS: Reel[] = [
  {
    id: "r1",
    creator: "riyavibes",
    verified: true,
    caption: "POV: your aura score comes out higher than your crush's",
    hashtags: ["#vyzunaura", "#pov"],
    views: "412K",
    audio: "Original audio — riyavibes",
    counts: { vibe: 12400, curious: 2100, savage: 890, lol: 5400 },
  },
  {
    id: "r2",
    creator: "arjun.k",
    verified: false,
    caption: "Edited this in 20 minutes on a ₹8000 phone. No excuses.",
    hashtags: ["#creator", "#editing"],
    views: "96K",
    audio: "Original audio — arjun.k",
    counts: { vibe: 5100, curious: 640, savage: 2300, lol: 410 },
  },
  {
    id: "r3",
    creator: "midnight.tales",
    verified: true,
    caption: "Reading anonymous secrets out loud, part 12 👀",
    hashtags: ["#secrets", "#storytime"],
    views: "1.2M",
    audio: "Original audio — midnight.tales",
    counts: { vibe: 88000, curious: 31000, savage: 4200, lol: 9100 },
  },
];

function ReelsPage() {
  const { state, update } = useVyzun();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("For You");
  const [reactions, setReactions] = useState<Record<string, ReactionKey | null>>({});
  const [burst, setBurst] = useState<string | null>(null);
  const [pendingVibe, setPendingVibe] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  function toggleVibeWith(creator: string) {
    const vibing = state.vibingWith.includes(creator);
    setPendingVibe(creator);
    window.setTimeout(() => {
      update((s) => ({
        vibingWith: vibing
          ? s.vibingWith.filter((c) => c !== creator)
          : [...s.vibingWith, creator],
        profile: { ...s.profile, vibing: vibing ? Math.max(0, s.profile.vibing - 1) : s.profile.vibing + 1 },
      }));
      setPendingVibe(null);
    }, 350);
  }

  return (
    <div className="fixed inset-0 bottom-0 flex flex-col bg-background">
      <div className="absolute inset-x-0 top-0 z-20 flex gap-2 overflow-x-auto bg-gradient-to-b from-background/90 to-transparent px-4 pb-6 pt-4">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "shrink-0 rounded-full border border-glass-border px-3.5 py-1.5 text-xs tap active:tap-active",
              category === c && "bg-gradient-vyzun text-primary-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div
        ref={scroller}
        className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain"
      >
        {REELS.map((reel) => {
          const mine = reactions[reel.id] ?? null;
          const vibing = state.vibingWith.includes(reel.creator);
          const pending = pendingVibe === reel.creator;
          return (
            <section
              key={reel.id}
              className="relative flex h-[calc(100dvh-4.5rem)] w-full snap-start items-end overflow-hidden"
              onDoubleClick={() => {
                setReactions((r) => ({ ...r, [reel.id]: "vibe" }));
                setBurst(reel.id);
                window.setTimeout(() => setBurst(null), 600);
              }}
            >
              <div className="absolute inset-0 bg-gradient-vyzun opacity-25" />
              <div className="absolute inset-0 bg-background/50" />
              {burst === reel.id && (
                <span className="anim-pulse-neon absolute inset-0 m-auto grid h-24 w-24 place-items-center text-5xl">
                  ❤️
                </span>
              )}

              <div className="relative z-10 w-full p-5 pb-24">
                <div className="flex items-end gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-vyzun text-sm font-bold text-primary-foreground">
                        {reel.creator[0]?.toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-semibold">
                        @{reel.creator}
                        {reel.verified && <BadgeCheck className="h-4 w-4 text-cyan" />}
                      </span>
                      <button
                        onClick={() => toggleVibeWith(reel.creator)}
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-semibold tap active:tap-active",
                          vibing
                            ? "border border-glass-border"
                            : "bg-gradient-vyzun text-primary-foreground",
                        )}
                      >
                        {pending ? (vibing ? "Unvibing" : "Vibing") : vibing ? "Vibing" : "+ Vibe With"}
                      </button>
                    </div>
                    <p className="mt-3 text-sm">{reel.caption}</p>
                    <p className="mt-1 text-xs text-cyan">{reel.hashtags.join(" ")}</p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Music2 className="anim-float h-3.5 w-3.5" /> {reel.audio} · {reel.views} views
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <button aria-label="Creator profile" className="tap active:tap-active">
                      <UserRound className="h-6 w-6" />
                    </button>
                    {REACTIONS.map((r) => (
                      <button
                        key={r.key}
                        aria-label={r.label}
                        onClick={() =>
                          setReactions((s) => ({ ...s, [reel.id]: s[reel.id] === r.key ? null : r.key }))
                        }
                        className={cn("flex flex-col items-center text-[10px] tap active:tap-active", mine === r.key && "scale-110")}
                      >
                        <span className="text-xl" aria-hidden>
                          {r.emoji}
                        </span>
                        {(reel.counts[r.key] + (mine === r.key ? 1 : 0)).toLocaleString()}
                      </button>
                    ))}
                    <button aria-label="Comments" className="tap active:tap-active">
                      <MessageSquare className="h-6 w-6" />
                    </button>
                    <button aria-label="Save" className="tap active:tap-active">
                      <Bookmark className="h-6 w-6" />
                    </button>
                    <button
                      aria-label="Share"
                      onClick={async () => {
                        const text = `Watch @${reel.creator} on VYZUN`;
                        if (navigator.share) await navigator.share({ text }).catch(() => {});
                        else await navigator.clipboard?.writeText(text);
                      }}
                      className="tap active:tap-active"
                    >
                      <Share2 className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <button
        aria-label="Create Reel"
        className="absolute right-5 top-16 z-20 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-vyzun text-primary-foreground tap active:tap-active"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
}
