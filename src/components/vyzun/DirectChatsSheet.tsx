import { useState } from "react";
import { Phone, Send, Video, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { id: string; from: "me" | "them"; body: string };

const THREADS = [
  { id: "riyavibes", name: "riyavibes", last: "sent you a reel" },
  { id: "arjun", name: "arjun.k", last: "typing…" },
];

export function DirectChatsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [active, setActive] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([{ id: "m1", from: "them", body: "Yo, that aura card 🔥" }]);
  const [draft, setDraft] = useState("");
  const [call, setCall] = useState<null | "audio" | "video">(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-background/60 backdrop-blur-sm">
      <div className="glass-card max-h-[85vh] w-full overflow-y-auto rounded-b-none p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] animate-in slide-in-from-bottom">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Direct Chats &amp; Calls</h2>
          <button onClick={onClose} aria-label="Close" className="tap active:tap-active">
            <X className="h-5 w-5" />
          </button>
        </div>

        {call && (
          <div className="mt-4 rounded-xl border border-glass-border p-4 text-sm">
            <p className="font-medium">{call === "audio" ? "Audio" : "Video"} call — connecting…</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Real-time calling requires a media provider to be configured.
            </p>
            <button
              onClick={() => setCall(null)}
              className="mt-3 rounded-lg border border-destructive/50 px-3 py-1.5 text-xs tap active:tap-active"
            >
              End call
            </button>
          </div>
        )}

        {!active ? (
          <ul className="mt-4 space-y-2">
            {THREADS.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => setActive(t.id)}
                  className="flex w-full items-center gap-3 rounded-xl border border-glass-border px-4 py-3 text-left tap active:tap-active"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-vyzun text-sm font-bold text-primary-foreground">
                    {t.name[0]?.toUpperCase()}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">@{t.name}</span>
                    <span className="text-xs text-muted-foreground">{t.last}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <button onClick={() => setActive(null)} className="text-xs text-muted-foreground tap active:tap-active">
                ← All chats
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setCall("audio")}
                  aria-label="Audio call"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-glass-border tap active:tap-active"
                >
                  <Phone className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCall("video")}
                  aria-label="Video call"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-glass-border tap active:tap-active"
                >
                  <Video className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {msgs.map((m) => (
                <p
                  key={m.id}
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
                    m.from === "me"
                      ? "ml-auto bg-gradient-vyzun text-primary-foreground"
                      : "border border-glass-border",
                  )}
                >
                  {m.body}
                </p>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Message…"
                aria-label="Message"
                className="w-full rounded-xl border border-glass-border bg-transparent px-3 py-2 text-sm outline-none"
              />
              <button
                onClick={() => {
                  const body = draft.trim();
                  if (!body) return;
                  setMsgs((m) => [...m, { id: crypto.randomUUID(), from: "me", body }]);
                  setDraft("");
                }}
                aria-label="Send"
                className="shrink-0 rounded-xl bg-gradient-vyzun px-3 text-primary-foreground tap active:tap-active"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
