import { acquire, makePool } from "./pool";
import { perspectiveScale } from "./mapping";
import {
  CD_DROP,
  FALL_HEIGHT_M,
  RHO_AIR,
  RHO_WATER,
  SIGMA_WATER,
  type Drop,
  type Flash,
  type RainParams,
  type Ring,
  type Splash,
} from "./types";

export function emptyDrop(): Drop {
  return {
    live: false,
    x: 0,
    y: 0,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    radiusM: 0.001,
    mass: 0,
    age: 0,
    trail: 0,
  };
}

export function emptySplash(): Splash {
  return {
    live: false,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    life: 0,
    maxLife: 0,
    size: 1,
  };
}

export function emptyFlash(): Flash {
  return { live: false, x: 0, y: 0, life: 0, we: 0 };
}

export function emptyRing(): Ring {
  return { live: false, x: 0, y: 0, z: 0, age: 0, maxAge: 1, maxR: 0.04, we: 0 };
}

export function terminalVelocity(radiusM: number, mass: number, dragMul: number, g: number) {
  const area = Math.PI * radiusM * radiusM;
  const cd = CD_DROP * dragMul;
  const den = cd * RHO_AIR * area;
  if (den <= 1e-8) return 12;
  return Math.sqrt((2 * mass * g) / den);
}

function massOf(radiusM: number) {
  return RHO_WATER * (4 / 3) * Math.PI * radiusM * radiusM * radiusM;
}

export function weber(radiusM: number, speed: number, tensionMul: number) {
  const d = radiusM * 2;
  const sigma = SIGMA_WATER * Math.max(0.15, tensionMul);
  return (RHO_WATER * speed * speed * d) / sigma;
}

export class DropSystem {
  readonly drops: Drop[];
  readonly splashes: Splash[];
  readonly flashes: Flash[];
  readonly rings: Ring[];
  spawnAcc = 0;
  impactWindow = 0;
  impactCount = 0;
  weAccum = 0;
  weHits = 0;

  constructor() {
    this.drops = makePool(1600, emptyDrop);
    this.splashes = makePool(900, emptySplash);
    this.flashes = makePool(120, emptyFlash);
    this.rings = makePool(220, emptyRing);
  }

  reset() {
    for (const d of this.drops) d.live = false;
    for (const s of this.splashes) s.live = false;
    for (const f of this.flashes) f.live = false;
    for (const r of this.rings) r.live = false;
    this.spawnAcc = 0;
    this.impactWindow = 0;
    this.impactCount = 0;
    this.weAccum = 0;
    this.weHits = 0;
  }

  aloft() {
    let n = 0;
    for (const d of this.drops) if (d.live) n++;
    return n;
  }

  spawn(params: RainParams, forced?: { x: number; z: number; dropMm?: number }) {
    const d = acquire(this.drops);
    if (!d) return null;
    const mean = (forced?.dropMm ?? params.dropMm) / 1000;
    const u = Math.random();
    const diam = forced
      ? mean * 2
      : Math.min(0.006, Math.max(0.00035, -Math.log(1 - u * 0.98) * mean));
    const r = diam / 2;
    const mass = massOf(r);
    const z = forced?.z ?? Math.random() ** 1.35;
    d.live = true;
    d.x = forced?.x ?? Math.random();
    d.y = forced ? -0.08 : -0.12 * Math.random();
    d.z = z;
    d.radiusM = r;
    d.mass = mass;
    d.age = 0;
    const vt = terminalVelocity(r, mass, params.drag, params.gravity);
    d.vy = vt * (0.55 + Math.random() * 0.5);
    d.vx = params.wind * (0.35 + (0.0009 / Math.max(r, 0.0004)) * 0.15);
    d.vz = 0;
    d.trail = 0.018 + r * 18;
    return d;
  }

  spawnRing(x: number, y: number, z: number, we: number, gain: number) {
    const count = we > 90 ? 3 : we > 40 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      const ring = acquire(this.rings);
      if (!ring) break;
      ring.live = true;
      ring.x = x;
      ring.y = y;
      ring.z = z;
      ring.age = -i * 0.09;
      ring.maxAge = 1.15 + Math.min(0.8, we / 220) * gain;
      ring.maxR = (0.028 + Math.min(0.09, we / 1400)) * gain * (1 + i * 0.12);
      ring.we = we;
    }
  }

  splashAt(x: number, y: number, z: number, we: number, speed: number, gain: number) {
    this.splashCrown(x, y, we, speed, gain);
    this.spawnRing(x, y, z, we, gain);
    this.impactCount++;
    this.weAccum += we;
    this.weHits++;
  }

  private splashCrown(
    x: number,
    y: number,
    we: number,
    speed: number,
    gain: number,
  ) {
    const n = Math.min(18, Math.floor((we / 28) * gain));
    for (let i = 0; i < n; i++) {
      const s = acquire(this.splashes);
      if (!s) break;
      const ang = Math.PI * 0.35 + Math.random() * Math.PI * 0.45;
      const dir = (i / Math.max(1, n)) * Math.PI * 2 + Math.random() * 0.4;
      const sp = speed * (0.12 + Math.random() * 0.22) * gain;
      s.live = true;
      s.x = x;
      s.y = y;
      s.vx = Math.cos(dir) * sp * 0.08 * Math.cos(ang);
      s.vy = -Math.sin(ang) * sp * 0.05;
      s.life = 0;
      s.maxLife = 0.18 + Math.random() * 0.28;
      s.size = 0.6 + Math.random() * 1.4;
    }
    const flash = acquire(this.flashes);
    if (flash) {
      flash.live = true;
      flash.x = x;
      flash.y = y;
      flash.life = 0;
      flash.we = we;
    }
  }

  step(
    dt: number,
    params: RainParams,
    onImpact: (u: number, v: number, we: number, speed: number, radiusM: number) => void,
  ) {
    const g = params.gravity;
    const dragMul = params.drag;
    const wind = params.wind;

    if (params.rainRate > 0) {
      const flux = params.rainRate * (0.4 + 1.8 / Math.max(params.dropMm, 0.4));
      this.spawnAcc += flux * dt;
      const budget = 70 * dt * 60;
      let n = 0;
      while (this.spawnAcc >= 1 && n < budget) {
        this.spawnAcc -= 1;
        n++;
        this.spawn(params);
      }
      if (this.spawnAcc > 40) this.spawnAcc = 40;
    }

    for (const d of this.drops) {
      if (!d.live) continue;
      d.age += dt;
      const area = Math.PI * d.radiusM * d.radiusM;
      const cd = CD_DROP * dragMul;
      const speed = Math.hypot(d.vx - wind, d.vy, d.vz);
      const mag = 0.5 * cd * RHO_AIR * area * speed;
      const invM = 1 / d.mass;
      const fx = -mag * (d.vx - wind) * invM;
      const fy = g - mag * d.vy * invM;
      d.vx += fx * dt;
      d.vy += fy * dt;
      const scale = perspectiveScale(d.z);
      const fall = FALL_HEIGHT_M;
      d.x += (d.vx / 14) * dt;
      d.y += (d.vy / fall) * dt * (0.65 + 0.55 * scale);

      const groundY = 0.9 - d.z * 0.68;
      if (d.y >= groundY || d.y > 1.08 || d.x < -0.18 || d.x > 1.18) {
        d.live = false;
        if (d.y >= groundY && d.x > -0.04 && d.x < 1.04) {
          const spd = Math.hypot(d.vx, d.vy);
          const we = weber(d.radiusM, spd, params.tension);
          this.impactCount++;
          this.weAccum += we;
          this.weHits++;
          if (we > 12) {
            this.splashCrown(d.x, d.y, we, spd, params.splashGain);
            this.spawnRing(d.x, d.y, d.z, we, params.splashGain);
          }
          onImpact(d.x, 1 - d.y, we, spd, d.radiusM);
        }
      }
    }

    for (const s of this.splashes) {
      if (!s.live) continue;
      s.life += dt;
      s.vy += g * 0.08 * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      if (s.life >= s.maxLife) s.live = false;
    }

    for (const f of this.flashes) {
      if (!f.live) continue;
      f.life += dt;
      if (f.life > 0.16) f.live = false;
    }

    for (const ring of this.rings) {
      if (!ring.live) continue;
      ring.age += dt;
      if (ring.age > ring.maxAge) ring.live = false;
    }

    this.impactWindow += dt;
  }

  meanWe() {
    if (this.weHits < 1) return 0;
    return this.weAccum / this.weHits;
  }

  impactsPerSec() {
    if (this.impactWindow < 0.35) return this.impactCount / Math.max(this.impactWindow, 0.001);
    const r = this.impactCount / this.impactWindow;
    this.impactCount *= 0.35;
    this.impactWindow *= 0.35;
    this.weAccum *= 0.6;
    this.weHits = Math.floor(this.weHits * 0.6);
    return r;
  }
}
