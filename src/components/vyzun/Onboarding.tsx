import { useMemo, useState } from "react";
import { Check, Globe, Moon, Search, Shield, Smartphone, Sun, User } from "lucide-react";
import { LANGUAGES, useVyzun, type ThemeName } from "@/lib/vyzun-store";
import { Logo, Wordmark } from "./Logo";
import { cn } from "@/lib/utils";

type Step = "theme" | "language" | "auth" | "profile";

export function Onboarding() {
  const { state, update } = useVyzun();
  const [step, setStep] = useState<Step>("theme");
  const [query, setQuery] = useState("");
  const [username, setUsername] = useState("");

  const langs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? LANGUAGES.filter((l) => l.label.toLowerCase().includes(q) || l.code.includes(q)) : LANGUAGES;
  }, [query]);

  function pickTheme(theme: ThemeName) {
    update({ theme });
    setStep("language");
  }

  function finish(authMode: "guest" | "google" | "phone") {
    update((s) => ({ profile: { ...s.profile, authMode } }));
    setStep("profile");
  }

  function saveProfile() {
    const handle = (username || "vyzuner").replace(/[^a-z0-9_.]/gi, "").toLowerCase() || "vyzuner";
    update((s) => ({
      onboarded: true,
      profile: { ...s.profile, username: handle, displayName: handle },
    }));
  }

  return (
    <div className="min-h-screen px-6 pb-16 pt-14">
      <header className="flex items-center gap-3">
        <Logo className="h-11 w-11" />
        <div>
          <Wordmark className="text-2xl" />
          <p className="text-xs text-muted-foreground">Your Vibe. Your Identity. Your Opportunity.</p>
        </div>
      </header>

      <div className="mx-auto mt-10 max-w-md">
        {step === "theme" && (
          <section className="anim-rise">
            <h1 className="text-2xl font-semibold">Choose your theme</h1>
            <p className="mt-1 text-sm text-muted-foreground">You can change this anytime in Settings.</p>
            <div className="mt-6 grid gap-4">
              <button onClick={() => pickTheme("dark-neon")} className="glass-card tap active:tap-active p-5 text-left">
                <Moon className="mb-3 h-6 w-6 text-cyan" />
                <p className="font-display text-lg font-semibold">🌙 Dark Neon</p>
                <p className="text-sm text-muted-foreground">Obsidian glass, cyan → purple → pink glow.</p>
              </button>
              <button onClick={() => pickTheme("light-glass")} className="glass-card tap active:tap-active p-5 text-left">
                <Sun className="mb-3 h-6 w-6 text-magenta" />
                <p className="font-display text-lg font-semibold">☀️ Light Glass</p>
                <p className="text-sm text-muted-foreground">Bright frosted surfaces, same VYZUN gradient.</p>
              </button>
            </div>
          </section>
        )}

        {step === "language" && (
          <section className="anim-rise">
            <h1 className="text-2xl font-semibold">Choose your language</h1>
            <div className="glass-card mt-4 flex items-center gap-2 px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search languages"
                aria-label="Search languages"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="mt-4 max-h-[46vh] space-y-2 overflow-y-auto pr-1">
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => update({ language: l.code })}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border border-glass-border px-4 py-3 text-sm tap active:tap-active",
                    state.language === l.code && "bg-gradient-vyzun text-primary-foreground",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Globe className="h-4 w-4 opacity-70" />
                    {l.label}
                  </span>
                  {state.language === l.code && <Check className="h-4 w-4" />}
                </button>
              ))}
              {langs.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">No language matches “{query}”.</p>
              )}
            </div>
            <button
              onClick={() => setStep("auth")}
              className="mt-6 w-full rounded-xl bg-gradient-vyzun py-3 font-semibold text-primary-foreground tap active:tap-active"
            >
              Continue
            </button>
          </section>
        )}

        {step === "auth" && (
          <section className="anim-rise">
            <h1 className="text-2xl font-semibold">Join VYZUN</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in later if you prefer — guest mode works fully on this device.
            </p>
            <div className="mt-6 space-y-3">
              <button
                onClick={() => finish("google")}
                className="glass-card flex w-full items-center gap-3 px-5 py-4 text-left tap active:tap-active"
              >
                <Shield className="h-5 w-5 text-cyan" />
                <span>
                  <span className="block font-medium">Continue with Google</span>
                  <span className="text-xs text-muted-foreground">Needs Cloud auth configuration</span>
                </span>
              </button>
              <button
                onClick={() => finish("phone")}
                className="glass-card flex w-full items-center gap-3 px-5 py-4 text-left tap active:tap-active"
              >
                <Smartphone className="h-5 w-5 text-violet" />
                <span>
                  <span className="block font-medium">Continue with Phone / OTP</span>
                  <span className="text-xs text-muted-foreground">Needs Cloud auth configuration</span>
                </span>
              </button>
              <button
                onClick={() => finish("guest")}
                className="w-full rounded-xl bg-gradient-vyzun py-3 font-semibold text-primary-foreground tap active:tap-active"
              >
                Continue as Guest
              </button>
            </div>
          </section>
        )}

        {step === "profile" && (
          <section className="anim-rise">
            <h1 className="text-2xl font-semibold">Pick your username</h1>
            <div className="glass-card mt-4 flex items-center gap-2 px-4 py-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">@</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourname"
                aria-label="Username"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              onClick={saveProfile}
              className="mt-6 w-full rounded-xl bg-gradient-vyzun py-3 font-semibold text-primary-foreground tap active:tap-active"
            >
              Enter SCAN
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
