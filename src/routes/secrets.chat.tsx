import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Ban, Copy, Flag, Search, Send, Share2 } from "lucide-react";
import { useVyzun } from "@/lib/vyzun-store";

export const Route = createFileRoute("/secrets/chat")({
  head: () => ({
    meta: [
      { title: "Secret Chat — VYZUN" },
      {
        name: "description",
        content:
          "Share your anonymous VYZUN link, receive secret messages and reply anonymously in a moderated Secret Chat Room.",
      },
      { property: "og:title", content: "Secret Chat — VYZUN" },
      {
        property: "og:description",
        content: "Your anonymous VYZUN link: receive secrets and reply safely.",
      },
    ],
  }),
  component: SecretChatPage,
});

function SecretChatPage() {
  const { state, update } = useVyzun();
  const link = `vyzun.app/ask/@${state.profile.username}`;
  const [draft, setDraft] = useState("");
  const [target, setTarget] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  function sendSecret() {
    const body = draft.trim();
    if (!body || !target.trim()) {
      setNotice("Add a username and a message first.");
      return;
    }
    update((s) => ({
      secrets: [
        {
          id: crypto.randomUUID(),
          body,
          hint: `Sent to @${target.replace(/^@/, "")}`,
          createdAt: Date.now(),
        },
        ...s.secrets,
      ],
    }));
    setDraft("");
    setNotice("Secret sent anonymously. It stays moderated for safety.");
  }

  return (
    <div className="pb-28">
      <header className="sticky top-0 z-30 flex items-center gap-3 bg-background/75 px-5 py-4 backdrop-blur-xl">
        <Link to="/secrets" aria-label="Back to Secrets" className="tap active:tap-active">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-lg font-semibold">Secret Chat</h1>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-5">
        <section className="glass-card p-5">
          <h2 className="text-sm font-semibold">Your anonymous VYZUN link</h2>
          <p className="text-gradient mt-2 break-all font-medium">{link}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={async () => {
                await navigator.clipboard?.writeText(`https://${link}`);
                setNotice("Link copied.");
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-glass-border py-2.5 text-sm tap active:tap-active"
            >
              <Copy className="h-4 w-4" /> Copy Link
            </button>
            <button
              onClick={async () => {
                if (navigator.share)
                  await navigator.share({ title: "Send me a secret", url: `https://${link}` }).catch(() => {});
                else {
                  await navigator.clipboard?.writeText(`https://${link}`);
                  setNotice("Link copied.");
                }
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-vyzun py-2.5 text-sm font-semibold text-primary-foreground tap active:tap-active"
            >
              <Share2 className="h-4 w-4" /> Share Link
            </button>
          </div>
        </section>

        <section className="glass-card p-5">
          <h2 className="text-sm font-semibold">Send a secret message</h2>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-glass-border px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Search username"
              aria-label="Search username"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder="Say it anonymously — but keep it kind."
            aria-label="Secret message"
            className="mt-3 w-full resize-none rounded-xl border border-glass-border bg-transparent px-3 py-2 text-sm outline-none"
          />
          <button
            onClick={sendSecret}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-vyzun py-3 font-semibold text-primary-foreground tap active:tap-active"
          >
            <Send className="h-4 w-4" /> Send Secret Message
          </button>
          {notice && <p className="mt-2 text-xs text-muted-foreground">{notice}</p>}
        </section>

        <section className="glass-card p-5">
          <h2 className="text-sm font-semibold">Secret Chat Room</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Anonymous does not mean unmoderated. Reports are reviewed.
          </p>
          <div className="mt-4 space-y-3">
            {state.secrets.map((m) => (
              <div key={m.id} className="rounded-2xl border border-glass-border p-3.5">
                <p className="text-sm">{m.body}</p>
                <p className="mt-1.5 text-xs text-muted-foreground">Hint: {m.hint}</p>
                {m.reply && <p className="mt-2 text-sm text-gradient">↳ {m.reply}</p>}
                <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                  <button className="flex items-center gap-1 tap active:tap-active">
                    <Flag className="h-3.5 w-3.5" /> Report
                  </button>
                  <button className="flex items-center gap-1 tap active:tap-active">
                    <Ban className="h-3.5 w-3.5" /> Block
                  </button>
                </div>
              </div>
            ))}
            {state.secrets.length === 0 && (
              <p className="text-sm text-muted-foreground">No messages yet — share your link.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
