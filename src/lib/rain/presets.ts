import type { PresetId, RainParams } from "./types";

export type { PresetId };

export type Preset = {
  id: PresetId;
  label: string;
  blurb: string;
  params: RainParams;
};

const base: RainParams = {
  rainRate: 8,
  dropMm: 1.8,
  gravity: 9.81,
  wind: 0.4,
  drag: 1,
  waveSpeed: 1,
  damping: 0.985,
  tension: 1,
  splashGain: 1,
  timeScale: 1,
};

export const PRESETS: Record<PresetId, Preset> = {
  still: {
    id: "still",
    label: "Still",
    blurb: "Empty plate. Tap the asphalt to place a single impact.",
    params: { ...base, rainRate: 0, wind: 0, dropMm: 2.4, splashGain: 1.25 },
  },
  drizzle: {
    id: "drizzle",
    label: "Drizzle",
    blurb: "Fine drops near terminal velocity. Quiet capillary rings.",
    params: { ...base, rainRate: 1.4, dropMm: 0.9, wind: 0.2, splashGain: 0.55, damping: 0.99 },
  },
  "three-am": {
    id: "three-am",
    label: "Three AM",
    blurb: "Cinematic moderate rain. Neon catching every ring.",
    params: { ...base },
  },
  downpour: {
    id: "downpour",
    label: "Downpour",
    blurb: "Fat drops, high Weber numbers, busy splash crowns.",
    params: {
      ...base,
      rainRate: 22,
      dropMm: 2.6,
      wind: 1.1,
      splashGain: 1.35,
      damping: 0.978,
    },
  },
  storm: {
    id: "storm",
    label: "Storm",
    blurb: "Driven rain. Wind shears the column; waves stay up.",
    params: {
      ...base,
      rainRate: 38,
      dropMm: 3.1,
      wind: 4.8,
      drag: 0.85,
      splashGain: 1.5,
      waveSpeed: 1.15,
      damping: 0.972,
    },
  },
};

export const PRESET_ORDER: PresetId[] = ["still", "drizzle", "three-am", "downpour", "storm"];
