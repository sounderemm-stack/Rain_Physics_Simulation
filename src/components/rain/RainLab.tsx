import { useEffect, useRef, useState } from "react";
import { Pause, Play, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ControlDock, LiveStrip } from "@/components/rain/ControlDock";
import { RainEngine } from "@/lib/rain/engine";
import { PRESETS, PRESET_ORDER } from "@/lib/rain/presets";
import { useRainStore } from "@/lib/rain/store";
import type { RainStats } from "@/lib/rain/types";
import { cn } from "@/lib/utils";

const ZERO_STATS: RainStats = {
  aloft: 0,
  impacts: 0,
  impactsPerSec: 0,
  meanWe: 0,
  fps: 0,
};

export function RainLab() {
  const hostRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<RainEngine | null>(null);
  const [stats, setStats] = useState<RainStats>(ZERO_STATS);
  const [ready, setReady] = useState(false);
  const [hint, setHint] = useState(true);

  const paused = useRainStore((s) => s.paused);
  const panelOpen = useRainStore((s) => s.panelOpen);
  const params = useRainStore((s) => s.params);
  const togglePause = useRainStore((s) => s.togglePause);
  const setPanelOpen = useRainStore((s) => s.setPanelOpen);
  const applyPreset = useRainStore((s) => s.applyPreset);
  const fireDropOne = useRainStore((s) => s.fireDropOne);
  const fireClear = useRainStore((s) => s.fireClear);
  const setView = useRainStore((s) => s.setView);

  useEffect(() => {
    const gl = glRef.current;
    const fx = fxRef.current;
    const host = hostRef.current;
    if (!gl || !fx || !host) return;

    const engine = new RainEngine(gl, fx);
    engineRef.current = engine;
    engine.resize();
    engine.start();
    setReady(true);

    const ro = new ResizeObserver(() => engine.resize());
    ro.observe(host);

    let poll = 0;
    const pump = () => {
      setStats({ ...engine.stats });
      poll = window.setTimeout(pump, 180);
    };
    poll = window.setTimeout(pump, 180);

    return () => {
      window.clearTimeout(poll);
      ro.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePause();
      } else if (e.key === "d" || e.key === "D") {
        fireDropOne();
      } else if (e.key === "r" || e.key === "R") {
        fireClear();
      } else if (e.key === "1" || e.key === "2" || e.key === "3" || e.key === "4" || e.key === "5") {
        applyPreset(PRESET_ORDER[Number(e.key) - 1]!);
      } else if (e.key === "h" || e.key === "H") {
        const order = ["cinematic", "height", "energy"] as const;
        const cur = useRainStore.getState().view;
        setView(order[(order.indexOf(cur) + 1) % order.length]!);
      } else if (e.key === "Escape") {
        setPanelOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [applyPreset, fireClear, fireDropOne, setPanelOpen, setView, togglePause]);

  const onPointer = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-ui]")) return;
    engineRef.current?.pointer(e.clientX, e.clientY);
    setHint(false);
  };

  return (
    <main
      ref={hostRef}
      className="relative h-dvh w-full overflow-hidden bg-background text-foreground"
      onPointerDown={onPointer}
    >
      <canvas ref={glRef} className="absolute inset-0 h-full w-full" />
      <canvas ref={fxRef} className="absolute inset-0 h-full w-full" />

      <div
        data-ui
        className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] md:p-6"
      >
        <header className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-2xs tracking-[0.28em] text-foreground/70 uppercase">
              Rain physics lab
            </p>
            <h1 className="font-display text-4xl leading-none tracking-wide text-foreground md:text-5xl">
              Three AM Pavement
            </h1>
            <p className="mt-2 max-w-sm text-sm text-foreground/70">
              Ballistic drops, capillary-gravity ripples, splash crowns. Tap the asphalt.
            </p>
          </div>
          <div className="pointer-events-auto flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              aria-label={paused ? "Play" : "Pause"}
              onClick={togglePause}
            >
              {paused ? <Play /> : <Pause />}
            </Button>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="lg:hidden"
              aria-label={panelOpen ? "Close controls" : "Open controls"}
              onClick={() => setPanelOpen(!panelOpen)}
            >
              {panelOpen ? <X /> : <SlidersHorizontal />}
            </Button>
          </div>
        </header>

        <div className="flex items-end justify-between gap-4">
          <div className="pointer-events-none">
            <LiveStrip stats={stats} params={params} />
            {hint ? (
              <p className="mt-2 text-xs text-foreground/60">
                Click a puddle · Space pauses · D drops one
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <aside
        data-ui
        className="pointer-events-auto absolute top-4 right-4 bottom-4 hidden w-80 lg:flex"
      >
        <div className="flex h-full w-full flex-col rounded-2xl border border-border bg-card p-5 text-card-foreground">
          <ControlDock stats={stats} />
        </div>
      </aside>

      <div
        data-ui
        className={cn(
          "pointer-events-auto absolute inset-x-0 bottom-0 lg:hidden",
          panelOpen ? "flex" : "hidden",
        )}
      >
        <div className="flex max-h-[78dvh] w-full flex-col rounded-t-2xl border border-border bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-card-foreground">
          <ControlDock stats={stats} />
        </div>
      </div>

      {!ready ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <p className="font-display text-3xl tracking-wide">Loading plate</p>
        </div>
      ) : null}

      <p className="sr-only">
        Presets {PRESETS["three-am"].label}. Simulation running at {stats.fps.toFixed(0)} frames per
        second.
      </p>
    </main>
  );
}
