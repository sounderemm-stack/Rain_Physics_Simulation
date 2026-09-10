export type ViewMode = "cinematic" | "height" | "energy";

export type RainParams = {
  /** Rainfall intensity, millimetres per hour. */
  rainRate: number;
  /** Mean drop diameter in millimetres. */
  dropMm: number;
  /** Gravity, m/s². */
  gravity: number;
  /** Cross-wind, m/s. Positive blows to the right. */
  wind: number;
  /** Quadratic-drag coefficient multiplier (1 = typical raindrop). */
  drag: number;
  /** Surface wave speed scale. */
  waveSpeed: number;
  /** Wave amplitude decay per second, 0–1. */
  damping: number;
  /** Surface-tension scale, drives capillary ripples. */
  tension: number;
  /** Splash / crown energy multiplier. */
  splashGain: number;
  /** Simulation clock, 1 = realtime. */
  timeScale: number;
};

export type PresetId = "still" | "drizzle" | "three-am" | "downpour" | "storm";

export type RainStats = {
  aloft: number;
  impacts: number;
  impactsPerSec: number;
  meanWe: number;
  fps: number;
};

export type Drop = {
  live: boolean;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radiusM: number;
  mass: number;
  age: number;
  trail: number;
};

export type Splash = {
  live: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
};

export type Flash = {
  live: boolean;
  x: number;
  y: number;
  life: number;
  we: number;
};

export type Ring = {
  live: boolean;
  x: number;
  y: number;
  z: number;
  age: number;
  maxAge: number;
  maxR: number;
  we: number;
};

export const RHO_WATER = 1000;
export const RHO_AIR = 1.225;
export const SIGMA_WATER = 0.072;
export const CD_DROP = 0.6;
export const FALL_HEIGHT_M = 6.2;
