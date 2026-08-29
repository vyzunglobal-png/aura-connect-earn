import { useMemo, useState } from "react";
import { Bell, Globe, Lock, Moon, Search, Sun, X } from "lucide-react";
import { LANGUAGES, useVyzun } from "@/lib/vyzun-store";
import { cn } from "@/lib/utils";

export function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, update, reset } = useVyzun();
  const [query, setQuery] = useState("");

  const langs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? LANGUAGES.filter((l) => l.label.toLowerCase().includes(q) || l.code.includes(q)) : LANGUAGES;
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-background/60 backdrop-blur-sm">
      <div className="glass-card max-h-[85vh] w-full overflow-y-auto rounded-b-none p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Settings</h2>
          <button onClick={onClose} aria-label="Close" className="tap active:tap-active">
            <X className="h-5 w-5" />
          </button>
        </div>

        <h3 className="mt-4 text-sm font-semibold">Theme</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            onClick={() => update({ theme: "dark-neon" })}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border border-glass-border py-2.5 text-sm tap active:tap-active",
              state.theme === "dark-neon" && "bg-gradient-vyzun text-primary-foreground",
            )}
          >
            <Moon className="h-4 w-4" /> Dark Neon
          </button>
          <button
            onClick={() => update({ theme: "light-glass" })}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border border-glass-border py-2.5 text-sm tap active:tap-active",
              state.theme === "light-glass" && "bg-gradient-vyzun text-primary-foreground",
            )}
          >
            <Sun className="h-4 w-4" /> Light Glass
          </button>
        </div>

        <h3 className="mt-5 text-sm font-semibold">Language</h3>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-glass-border px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search languages"
            aria-label="Search languages"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <div className="mt-2 max-h-48 space-y-1.5 overflow-y-auto pr-1">
          {langs.map((l) => (
            <button
              key={l.code}
              onClick={() => update({ language: l.code })}
              className={cn(
                "flex w-full items-center gap-2 rounded-xl border border-glass-border px-3 py-2 text-sm tap active:tap-active",
                state.language === l.code && "bg-gradient-vyzun text-primary-foreground",
              )}
            >
              <Globe className="h-4 w-4 opacity-70" /> {l.label}
            </button>
          ))}
        </div>

        <h3 className="mt-5 text-sm font-semibold">Account</h3>
        <ul className="mt-2 space-y-2 text-sm">
          <li className="flex items-center gap-2 rounded-xl border border-glass-border px-3 py-2.5">
            <Bell className="h-4 w-4 text-cyan" /> Notifications
          </li>
          <li className="flex items-center gap-2 rounded-xl border border-glass-border px-3 py-2.5">
            <Lock className="h-4 w-4 text-violet" /> Privacy &amp; safety
          </li>
        </ul>

        <button
          onClick={() => {
            reset();
            onClose();
          }}
          className="mt-5 w-full rounded-xl border border-destructive/50 py-2.5 text-sm tap active:tap-active"
        >
          Reset this device &amp; restart onboarding
        </button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Guest data is stored on this device and syncs when you sign in.
        </p>
      </div>
    </div>
  );
}
