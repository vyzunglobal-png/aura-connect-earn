import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Flag, Ghost, ImagePlus, MessageCircle, Phone, Send, Trash2, Video, X } from "lucide-react";
import { REACTIONS, useVyzun, type ReactionKey } from "@/lib/vyzun-store";
import { cn } from "@/lib/utils";
import { DirectChatsSheet } from "@/components/vyzun/DirectChatsSheet";

export const Route = createFileRoute("/secrets/")({
  head: () => ({
    meta: [
      { title: "VYZUN Secrets — Anonymous Inbox & Vibe Feed" },
      {
        name: "description",
        content:
          "Receive anonymous secrets, reply safely and post to the Vibe Feed on VYZUN. Moderated, mobile-first and free.",
      },
      { property: "og:title", content: "VYZUN Secrets — Anonymous Inbox & Vibe Feed" },
      {
        property: "og:description",
        content: "Anonymous messages, secret replies and the VYZUN Vibe Feed.",
      },
    ],
  }),
  component: SecretsPage,
});

function SecretsPage() {
  const { state, update } = useVyzun();
  const [tab, setTab] = useState<"inbox" | "feed">("inbox");
  const [draft, setDraft] = useState("");
  const [anon, setAnon] = useState(true);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [chatsOpen, setChatsOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function react(id: string, key: ReactionKey) {
    update((s) => ({
      feed: s.feed.map((p) => {
        if (p.id !== id) return p;
        const reactions = { ...p.reactions };
        if (p.mine) reactions[p.mine] = Math.max(0, reactions[p.mine] - 1);
        if (p.mine === key) return { ...p, reactions, mine: null };
        reactions[key] += 1;
        return { ...p, reactions, mine: key };
      }),
    }));
  }

  function pickImage(file: File | undefined) {
    setMediaError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMediaError("Please choose a photo.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setMediaError("Photo is larger than 4 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(typeof reader.result === "string" ? reader.result : null);
    reader.onerror = () => setMediaError("Could not read that photo.");
    reader.readAsDataURL(file);
  }

  function post() {
    const body = draft.trim();
    if (!body && !image) return;
    update((s) => ({
      feed: [
        {
          id: crypto.randomUUID(),
          author: anon ? "anon" : s.profile.username,
          anonymous: anon,
          body,
          image,
          createdAt: Date.now(),
          reactions: { vibe: 0, curious: 0, savage: 0, lol: 0 },
          mine: null,
        },
        ...s.feed,
      ],
    }));
    setDraft("");
    setImage(null);
    setMediaError(null);
    if (fileRef.current) fileRef.current.value = "";
  }


  return (
    <div className="pb-36">
      <header className="sticky top-0 z-30 bg-background/75 px-5 py-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <Link
            to="/secrets/chat"
            className="flex items-center gap-2 rounded-full bg-gradient-vyzun px-4 py-2 text-sm font-semibold text-primary-foreground tap active:tap-active"
          >
            <Ghost className="h-4 w-4" /> Secret Chat
          </Link>
          <h1 className="font-display text-lg font-semibold">Secrets</h1>
        </div>
        <div className="mt-4 flex gap-2">
          {(["inbox", "feed"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 rounded-xl border border-glass-border py-2 text-sm tap active:tap-active",
                tab === t && "bg-gradient-vyzun text-primary-foreground",
              )}
            >
              {t === "inbox" ? "Anonymous Inbox" : "Vibe Feed"}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-lg px-5">
        {tab === "inbox" && (
          <section className="space-y-3">
            {state.secrets.length === 0 && (
              <p className="glass-card p-6 text-center text-sm text-muted-foreground">
                No secrets yet. Share your anonymous link from Secret Chat.
              </p>
            )}
            {state.secrets.map((m) => (
              <article key={m.id} className="glass-card p-4">
                <p className="text-sm">{m.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">Hint: {m.hint}</p>
                {m.reply && (
                  <p className="mt-3 rounded-xl border border-glass-border px-3 py-2 text-sm">
                    Your reply: {m.reply}
                  </p>
                )}
                {replyTo === m.id ? (
                  <div className="mt-3 flex gap-2">
                    <input
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Reply anonymously"
                      aria-label="Reply anonymously"
                      className="w-full rounded-xl border border-glass-border bg-transparent px-3 py-2 text-sm outline-none"
                    />
                    <button
                      onClick={() => {
                        const text = reply.trim();
                        if (!text) return;
                        update((s) => ({
                          secrets: s.secrets.map((x) => (x.id === m.id ? { ...x, reply: text } : x)),
                        }));
                        setReply("");
                        setReplyTo(null);
                      }}
                      className="shrink-0 rounded-xl bg-gradient-vyzun px-3 text-primary-foreground tap active:tap-active"
                      aria-label="Send reply"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <button onClick={() => setReplyTo(m.id)} className="tap active:tap-active">
                      Reply
                    </button>
                    <button
                      onClick={async () => {
                        const text = `Someone told me: "${m.body}" — reply on VYZUN`;
                        if (navigator.share) await navigator.share({ text }).catch(() => {});
                        else await navigator.clipboard?.writeText(text);
                      }}
                      className="tap active:tap-active"
                    >
                      Share card
                    </button>
                    <button className="flex items-center gap-1 tap active:tap-active">
                      <Flag className="h-3.5 w-3.5" /> Report
                    </button>
                    <button
                      onClick={() =>
                        update((s) => ({ secrets: s.secrets.filter((x) => x.id !== m.id) }))
                      }
                      className="ml-auto flex items-center gap-1 tap active:tap-active"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                )}
              </article>
            ))}
          </section>
        )}

        {tab === "feed" && (
          <section>
            <div className="glass-card p-4">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                placeholder="Share a secret, confession or vibe…"
                aria-label="New Vibe Feed post"
                className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />

              {image && (
                <div className="relative mt-2 overflow-hidden rounded-xl border border-glass-border">
                  <img src={image} alt="Attached photo preview" className="max-h-56 w-full object-cover" />
                  <button
                    onClick={() => {
                      setImage(null);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    aria-label="Remove photo"
                    className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full border border-glass-border bg-background/80 backdrop-blur tap active:tap-active"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              {mediaError && <p className="mt-2 text-xs text-destructive">{mediaError}</p>}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => pickImage(e.target.files?.[0])}
              />

              <div className="mt-2 flex min-w-0 items-center gap-2">
                <button
                  onClick={() => setAnon((a) => !a)}
                  className={cn(
                    "min-w-0 truncate rounded-full border border-glass-border px-3 py-1.5 text-xs tap active:tap-active",
                    anon && "bg-gradient-vyzun text-primary-foreground",
                  )}
                >
                  {anon ? "Anonymous" : `@${state.profile.username}`}
                </button>
                <button
                  onClick={() => fileRef.current?.click()}
                  aria-label="Attach photo"
                  title="Attach photo"
                  className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-glass-border text-cyan tap active:tap-active"
                >
                  <ImagePlus className="h-5 w-5" />
                </button>
                <button
                  onClick={post}
                  disabled={!draft.trim() && !image}
                  className="shrink-0 rounded-xl bg-gradient-vyzun px-4 py-2 text-sm font-semibold text-primary-foreground tap active:tap-active disabled:opacity-50"
                >
                  Post
                </button>
              </div>
            </div>


            <div className="mt-4 space-y-3">
              {state.feed.map((p) => (
                <article key={p.id} className="glass-card p-4">
                  <p className="text-xs text-muted-foreground">
                    {p.anonymous ? "Anonymous" : `@${p.author}`}
                  </p>
                  <p className="mt-1.5 text-sm">{p.body}</p>
                  <div className="mt-3 flex gap-2">
                    {REACTIONS.map((r) => (
                      <button
                        key={r.key}
                        onClick={() => react(p.id, r.key)}
                        aria-label={r.label}
                        className={cn(
                          "flex items-center gap-1 rounded-full border border-glass-border px-2.5 py-1 text-xs tap active:tap-active",
                          p.mine === r.key && "bg-gradient-vyzun text-primary-foreground",
                        )}
                      >
                        <span aria-hidden>{r.emoji}</span>
                        {p.reactions[r.key]}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <button
        onClick={() => setChatsOpen(true)}
        className="fixed inset-x-6 bottom-24 z-30 mx-auto flex max-w-sm items-center justify-center gap-3 rounded-2xl bg-gradient-vyzun py-3 font-semibold text-primary-foreground shadow-lg tap active:tap-active"
      >
        <MessageCircle className="h-4 w-4" /> Direct Chats &amp; Calls
        <span className="flex items-center gap-1">
          <Phone className="h-4 w-4" />
          <Video className="h-4 w-4" />
        </span>
      </button>

      <DirectChatsSheet open={chatsOpen} onClose={() => setChatsOpen(false)} />
    </div>
  );
}
