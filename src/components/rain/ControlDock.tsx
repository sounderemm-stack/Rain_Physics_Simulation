import type { ReactNode } from "react";
import { Droplet, Gauge, Pause, Play, RotateCcw, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { PARAM_META, type ParamKey } from "@/lib/rain/notes";
import { PRESETS, PRESET_ORDER } from "@/lib/rain/presets";
import { useRainStore } from "@/lib/rain/store";
import type { RainParams, RainStats, ViewMode } from "@/lib/rain/types";
import { cn } from "@/lib/utils";

const GROUPS: { title: string; keys: ParamKey[] }[] = [
  { title: "Atmosphere", keys: ["rainRate", "dropMm", "wind"] },
  { title: "Flight", keys: ["gravity", "drag", "timeScale"] },
  { title: "Surface", keys: ["waveSpeed", "damping", "tension", "splashGain"] },
];

const VIEWS: { id: ViewMode; label: string }[] = [
  { id: "cinematic", label: "Plate" },
  { id: "height", label: "Height" },
  { id: "energy", label: "Weber" },
];

function formatValue(key: ParamKey, value: number) {
  if (key === "damping") return value.toFixed(3);
  if (key === "gravity" || key === "rainRate") return value.toFixed(1);
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(2);
}

function ParamSlider({ k, value }: { k: ParamKey; value: number }) {
  const meta = PARAM_META[k];
  const setParam = useRainStore((s) => s.setParam);
  const setActiveNote = useRainStore((s) => s.setActiveNote);
  const active = useRainStore((s) => s.activeNote) === k;

  return (
    <label
      className={cn("block py-2", active && "rounded-md bg-secondary/80 px-2")}
      onPointerDown={() => setActiveNote(k)}
    >
      <span className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-xs font-medium text-foreground">{meta.label}</span>
        <span className="font-mono text-2xs tabular-nums text-muted-foreground">
          {formatValue(k, value)}
          {meta.unit ? ` ${meta.unit}` : ""}
        </span>
      </span>
      <Slider
        min={meta.min}
        max={meta.max}
        step={meta.step}
        value={[value]}
        onValueChange={(v) => setParam(k, v[0] ?? value)}
        aria-label={meta.label}
      />
    </label>
  );
}

export function ControlDock({ stats }: { stats: RainStats }) {
  const params = useRainStore((s) => s.params);
  const preset = useRainStore((s) => s.preset);
  const view = useRainStore((s) => s.view);
  const paused = useRainStore((s) => s.paused);
  const activeNote = useRainStore((s) => s.activeNote);
  const applyPreset = useRainStore((s) => s.applyPreset);
  const setView = useRainStore((s) => s.setView);
  const togglePause = useRainStore((s) => s.togglePause);
  const fireDropOne = useRainStore((s) => s.fireDropOne);
  const fireClear = useRainStore((s) => s.fireClear);
  const note = activeNote ? PARAM_META[activeNote as ParamKey] : PARAM_META.rainRate;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div>
        <p className="font-mono text-2xs tracking-widest text-muted-foreground uppercase">
          Field notes
        </p>
        <h2 className="mt-1 font-display text-3xl leading-none tracking-wide text-foreground">
          {note.label}
        </h2>
        <p className="mt-2 font-mono text-2xs leading-relaxed text-accent">{note.formula}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{note.body}</p>
      </div>

      <Separator />

      <div className="flex flex-wrap gap-1.5">
        {PRESET_ORDER.map((id) => (
          <Button
            key={id}
            type="button"
            size="sm"
            variant={preset === id ? "default" : "outline"}
            onClick={() => applyPreset(id)}
          >
            {PRESETS[id].label}
          </Button>
        ))}
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {preset === "custom" ? "Custom mix." : PRESETS[preset as Exclude<typeof preset, "custom">].blurb}
      </p>

      <div className="grid grid-cols-3 gap-1.5">
        {VIEWS.map((v) => (
          <Button
            key={v.id}
            type="button"
            size="sm"
            variant={view === v.id ? "default" : "secondary"}
            onClick={() => setView(v.id)}
          >
            {v.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        <Button type="button" size="sm" variant="secondary" onClick={togglePause}>
          {paused ? <Play /> : <Pause />}
          {paused ? "Play" : "Pause"}
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={fireDropOne}>
          <Droplet />
          Drop
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={fireClear}>
          <RotateCcw />
          Reset
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {GROUPS.map((g) => (
          <section key={g.title} className="mb-3">
            <p className="font-mono text-2xs tracking-widest text-muted-foreground uppercase">
              {g.title}
            </p>
            {g.keys.map((k) => (
              <ParamSlider key={k} k={k} value={params[k]} />
            ))}
          </section>
        ))}
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-border pt-3 font-mono text-2xs tabular-nums">
        <Stat icon={<Waves className="size-3" />} label="Aloft" value={String(stats.aloft)} />
        <Stat
          icon={<Droplet className="size-3" />}
          label="Impacts"
          value={`${stats.impactsPerSec.toFixed(1)}/s`}
        />
        <Stat icon={<Gauge className="size-3" />} label="We" value={stats.meanWe.toFixed(0)} />
        <Stat label="Frame" value={`${stats.fps.toFixed(0)} fps`} />
      </dl>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}

export function LiveStrip({ stats, params }: { stats: RainStats; params: RainParams }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-2xs tabular-nums text-foreground/80">
      <span>R {params.rainRate.toFixed(1)} mm/h</span>
      <span>D {params.dropMm.toFixed(1)} mm</span>
      <span>We {stats.meanWe.toFixed(0)}</span>
      <span>{stats.aloft} aloft</span>
    </div>
  );
}
