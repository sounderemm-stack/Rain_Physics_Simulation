import type { RainParams } from "./types";

export type ParamKey = keyof RainParams;

export const PARAM_META: Record<
  ParamKey,
  {
    label: string;
    unit: string;
    min: number;
    max: number;
    step: number;
    formula: string;
    body: string;
  }
> = {
  rainRate: {
    label: "Rain rate",
    unit: "mm/h",
    min: 0,
    max: 50,
    step: 0.5,
    formula: "N(D) = N₀ e^{−ΛD},  Λ ≈ 4.1 R^{−0.21}",
    body: "Marshall–Palmer size spectrum. Higher R both adds drops and fattens the tail, so splash rate climbs faster than a linear count.",
  },
  dropMm: {
    label: "Mean diameter",
    unit: "mm",
    min: 0.4,
    max: 5,
    step: 0.1,
    formula: "m = ρ · ⁴⁄₃πr³",
    body: "Mass scales with the cube of radius. A 3 mm drop carries ~27× the water of a 1 mm drop and hits much harder.",
  },
  gravity: {
    label: "Gravity",
    unit: "m/s²",
    min: 1.6,
    max: 24,
    step: 0.1,
    formula: "a = g − (½ C_d ρ_air A |v| v) / m",
    body: "Earth is 9.81. Try lunar 1.62 — drops hang, Weber numbers collapse, crowns almost vanish.",
  },
  wind: {
    label: "Wind",
    unit: "m/s",
    min: -8,
    max: 8,
    step: 0.1,
    formula: "v_x → v_wind (small drops couple faster)",
    body: "Quadratic drag makes tiny drops ride the air. Large drops keep more of their vertical momentum, so the column shears.",
  },
  drag: {
    label: "Drag Cd",
    unit: "×",
    min: 0.15,
    max: 2.2,
    step: 0.05,
    formula: "v_t = √(2mg / (C_d ρ_air A))",
    body: "Terminal velocity. Raindrops sit around C_d ≈ 0.5–0.8. Crank it and everything floats; drop it and impacts go violent.",
  },
  waveSpeed: {
    label: "Wave speed",
    unit: "×",
    min: 0.25,
    max: 2.2,
    step: 0.05,
    formula: "∂²h/∂t² = c² ∇²h",
    body: "2-D wave equation on the puddle grid. Faster c sends rings out quicker. Real puddles mix gravity and capillary terms.",
  },
  damping: {
    label: "Viscosity",
    unit: "",
    min: 0.94,
    max: 0.998,
    step: 0.001,
    formula: "v ← v · d,  each step",
    body: "Phenomenological viscosity. Closer to 1 and rings linger like thick oil-skin water; lower and the street goes quiet between hits.",
  },
  tension: {
    label: "Surface tension",
    unit: "×",
    min: 0.2,
    max: 2.4,
    step: 0.05,
    formula: "We = ρ v² D / σ",
    body: "σ ≈ 0.072 N/m for clean water. Raise it and Weber numbers fall — drops prefer to deposit instead of throwing a crown.",
  },
  splashGain: {
    label: "Splash gain",
    unit: "×",
    min: 0,
    max: 2.2,
    step: 0.05,
    formula: "n_crown ≈ clamp(We / 25)",
    body: "Visual multiplier on crown droplets and ripple impulse. Physics still decides whether a hit is a deposit (We < 40) or a splash.",
  },
  timeScale: {
    label: "Time scale",
    unit: "×",
    min: 0.05,
    max: 1.6,
    step: 0.05,
    formula: "Δt_sim = Δt_frame · s",
    body: "Slow motion is the easiest way to read a Worthington jet. 0.25× lets a single drop finish its crown.",
  },
};
