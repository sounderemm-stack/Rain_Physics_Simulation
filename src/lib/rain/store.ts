import { create } from "zustand";
import { PRESETS, type PresetId } from "./presets";
import type { RainParams, ViewMode } from "./types";

type RainState = {
  params: RainParams;
  preset: PresetId | "custom";
  view: ViewMode;
  paused: boolean;
  panelOpen: boolean;
  panelCollapsed: boolean;
  activeNote: string | null;
  dropToken: number;
  clearToken: number;
  setParam: (key: keyof RainParams, value: number) => void;
  applyPreset: (id: PresetId) => void;
  setView: (view: ViewMode) => void;
  togglePause: () => void;
  setPaused: (paused: boolean) => void;
  setPanelOpen: (open: boolean) => void;
  togglePanelCollapsed: () => void
  setActiveNote: (key: string | null) => void;
  fireDropOne: () => void;
  fireClear: () => void;
  togglePanelCollapsed: () => void;
};

export const useRainStore = create<RainState>((set) => ({
  params: { ...PRESETS["three-am"].params },
  preset: "three-am",
  view: "cinematic",
  paused: false,
  panelOpen: false,
  panelCollapsed: false,
  activeNote: null,
  dropToken: 0,
  clearToken: 0,
  setParam: (key, value) =>
    set((s) => ({
      params: { ...s.params, [key]: value },
      preset: "custom",
    })),
  applyPreset: (id) =>
    set({
      params: { ...PRESETS[id].params },
      preset: id,
    }),
  setView: (view) => set({ view }),
  togglePause: () => set((s) => ({ paused: !s.paused })),
  setPaused: (paused) => set({ paused }),
  setPanelOpen: (panelOpen) => set({ panelOpen }),
  togglePanelCollapsed: () => set((s) => ({ panelCollapsed: !s.panelCollapsed })),
  setActiveNote: (activeNote) => set({ activeNote }),
  fireDropOne: () => set((s) => ({ dropToken: s.dropToken + 1 })),
  fireClear: () => set((s) => ({ clearToken: s.clearToken + 1 })),
}));
