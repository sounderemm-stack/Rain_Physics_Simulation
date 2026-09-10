import { DropSystem } from "./drops";
import { isRoad, perspectiveScale, screenToGround } from "./mapping";
import { StreetRenderer } from "./renderer";
import { useRainStore } from "./store";
import type { RainParams, RainStats, ViewMode } from "./types";
import { WaveField } from "./wave";

const MODE_INDEX: Record<ViewMode, number> = {
  cinematic: 0,
  height: 1,
  energy: 2,
};

export class RainEngine {
  private glCanvas: HTMLCanvasElement;
  private fx: HTMLCanvasElement;
  private fxCtx: CanvasRenderingContext2D;
  private renderer: StreetRenderer | null = null;
  private waves = new WaveField(192, 128);
  private drops = new DropSystem();
  private raf = 0;
  private last = 0;
  private acc = 0;
  private running = false;
  private fpsEma = 60;
  private lastDrop = 0;
  private lastClear = 0;
  private reduced = false;
  readonly stats: RainStats = {
    aloft: 0,
    impacts: 0,
    impactsPerSec: 0,
    meanWe: 0,
    fps: 60,
  };

  constructor(glCanvas: HTMLCanvasElement, fx: HTMLCanvasElement) {
    this.glCanvas = glCanvas;
    this.fx = fx;
    const ctx = fx.getContext("2d");
    if (!ctx) throw new Error("2d canvas");
    this.fxCtx = ctx;
    try {
      this.renderer = new StreetRenderer(glCanvas);
    } catch {
      this.renderer = null;
    }
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      const raw = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.fpsEma = this.fpsEma * 0.9 + (raw > 0 ? 1 / raw : 60) * 0.1;
      this.tick(raw);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.stop();
    this.renderer?.destroy();
  }

  resize() {
    const parent = this.glCanvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.renderer?.resize(rect.width, rect.height, dpr);
    this.glCanvas.style.width = `${rect.width}px`;
    this.glCanvas.style.height = `${rect.height}px`;
    this.fx.width = Math.max(1, Math.floor(rect.width * dpr));
    this.fx.height = Math.max(1, Math.floor(rect.height * dpr));
    this.fx.style.width = `${rect.width}px`;
    this.fx.style.height = `${rect.height}px`;
  }

  pointer(clientX: number, clientY: number) {
    const rect = this.fx.getBoundingClientRect();
    const u = (clientX - rect.left) / rect.width;
    const vTop = (clientY - rect.top) / rect.height;
    const vBottom = 1 - vTop;
    if (!isRoad(u, vBottom)) return;
    const { gx, gz } = screenToGround(u, vBottom);
    this.waves.impulse(gx, gz, 0.05, 0.1);
    this.drops.splashAt(u, vTop, 160, 9, 1.2);
  }

  private consumeTokens() {
    const s = useRainStore.getState();
    if (s.dropToken !== this.lastDrop) {
      this.lastDrop = s.dropToken;
      const params = s.params;
      this.drops.spawn(params, { x: 0.38 + Math.random() * 0.28, z: 0.22, dropMm: 4.8 });
    }
    if (s.clearToken !== this.lastClear) {
      this.lastClear = s.clearToken;
      this.waves.clear();
      this.drops.reset();
    }
  }

  private tick(dt: number) {
    this.consumeTokens();
    const { params, paused, view } = useRainStore.getState();
    const scale = paused || this.reduced ? 0 : params.timeScale;
    const step = Math.min(0.033, dt) * scale;
    this.acc += step;
    const fixed = 1 / 60;
    let guard = 0;
    while (this.acc >= fixed && guard < 4) {
      this.acc -= fixed;
      guard++;
      this.simulate(fixed, params);
    }
    this.stats.aloft = this.drops.aloft();
    this.stats.impactsPerSec = this.drops.impactsPerSec();
    this.stats.meanWe = this.drops.meanWe();
    this.stats.fps = this.fpsEma;
    this.stats.impacts = this.drops.impactCount;
    this.draw(view, params.splashGain);
  }

  private simulate(dt: number, params: RainParams) {
    this.waves.step(dt, params.waveSpeed * (0.7 + 0.3 * params.tension), params.damping);
    this.drops.step(dt, params, (u, v, we, _speed, radiusM) => {
      const { gx, gz } = screenToGround(u, v);
      const amp = (0.012 + Math.min(0.11, we / 1800)) * params.splashGain;
      const rad = 0.018 + radiusM * 8 + Math.min(0.06, we / 4000);
      this.waves.impulse(gx, gz, rad, amp);
    });
  }

  private draw(view: ViewMode, splashGain: number) {
    const bytes = this.waves.encode();
    const displace = view === "height" ? 0.004 : 0.016;
    const spec = view === "cinematic" ? 0.55 * splashGain : 0.8;
    this.renderer?.draw(bytes, this.waves.cols, this.waves.rows, MODE_INDEX[view], displace, spec);
    this.drawFx(view);
  }

  private drawFx(view: ViewMode) {
    const ctx = this.fxCtx;
    const w = this.fx.width;
    const h = this.fx.height;
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = "round";

    for (const d of this.drops.drops) {
      if (!d.live) continue;
      const z = d.z;
      const sc = perspectiveScale(z);
      const x = d.x * w;
      const y = d.y * h;
      const len = (10 + d.trail * 420 * sc) * (h / 720);
      const thick = Math.max(0.6, d.radiusM * 1400 * sc) * (w / 1280);
      const alpha =
        view === "energy"
          ? 0.55 + Math.min(0.4, d.radiusM * 80)
          : 0.18 + 0.35 * sc;
      if (view === "energy") {
        const t = Math.min(1, d.radiusM / 0.0025);
        ctx.strokeStyle = `rgba(${Math.round(80 + t * 160)}, ${Math.round(170 - t * 40)}, ${Math.round(255 - t * 80)}, ${alpha})`;
      } else {
        ctx.strokeStyle = `rgba(210, 226, 255, ${alpha})`;
      }
      ctx.lineWidth = thick;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - d.vx * 2.4, y - len);
      ctx.stroke();
    }

    for (const s of this.drops.splashes) {
      if (!s.live) continue;
      const t = 1 - s.life / s.maxLife;
      const x = s.x * w;
      const y = s.y * h;
      ctx.fillStyle = `rgba(230, 236, 255, ${0.55 * t})`;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.7, s.size * t * (w / 900)), 0, Math.PI * 2);
      ctx.fill();
    }

    for (const f of this.drops.flashes) {
      if (!f.live) continue;
      const t = 1 - f.life / 0.16;
      const x = f.x * w;
      const y = f.y * h;
      const r = (6 + Math.min(18, f.we * 0.04)) * t * (w / 1280);
      const g = view === "energy" ? Math.min(255, 40 + f.we) : 210;
      ctx.fillStyle = `rgba(255, ${Math.round(g)}, 230, ${0.45 * t})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
