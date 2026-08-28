import { useState } from "react";
import { HeartHandshake, Lock } from "lucide-react";
import { useVyzun } from "@/lib/vyzun-store";

/**
 * Double-blind crush matcher. A selection is never revealed to the other
 * person; only a validated mutual match surfaces anything. Free — no currency.
 */
export function CrushMatcher() {
  const { state, update } = useVyzun();
  const [value, setValue] = useState("");
  const [matched, setMatched] = useState(false);

  function submit() {
    const handle = value.trim().replace(/^@/, "").toLowerCase();
    if (!handle) return;
    update({ crush: handle });
    setValue("");
    // A real mutual match is resolved server-side; nothing is revealed here.
    setMatched(false);
  }

  return (
    <section className="glass-card mt-8 p-5">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <HeartHandshake className="h-5 w-5 text-magenta" /> Double-Blind Crush
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Pick anonymously. They only ever learn if you both pick each other.
      </p>

      {state.crush ? (
        <div className="mt-4 rounded-xl border border-glass-border px-4 py-3 text-sm">
          <p className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-cyan" /> Your pick is sealed.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {matched ? "IT'S A MATCH! 💘" : "Waiting for a mutual match. Nothing is shared until then."}
          </p>
          <button
            onClick={() => update({ crush: null })}
            className="mt-3 text-xs text-muted-foreground underline tap active:tap-active"
          >
            Change my pick
          </button>
        </div>
      ) : (
        <div className="mt-4 flex gap-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="@their_username"
            aria-label="Crush username"
            className="w-full rounded-xl border border-glass-border bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={submit}
            className="shrink-0 rounded-xl bg-gradient-vyzun px-4 font-semibold text-primary-foreground tap active:tap-active"
          >
            Seal
          </button>
        </div>
      )}
    </section>
  );
}
