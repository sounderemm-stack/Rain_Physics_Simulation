import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, r as Slot, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as RotateCcw, c as Gauge, i as SlidersHorizontal, l as Droplet, n as Waves, o as Play, s as Pause, t as X } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Root } from "../_libs/radix-ui__react-separator.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-1DWnLmhT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-[opacity,background-color,transform] duration-150 ease-out active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:opacity-90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-muted",
			outline: "border border-border bg-transparent hover:bg-secondary",
			ghost: "hover:bg-secondary"
		},
		size: {
			default: "h-11 px-4 text-sm",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5 text-sm",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Separator = import_react.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	decorative,
	orientation,
	className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className),
	...props
}));
Separator.displayName = Root.displayName;
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none items-center select-none", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1 w-full grow overflow-hidden rounded-full bg-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full border border-border bg-primary shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" })]
}));
Slider.displayName = Slider$1.displayName;
var PARAM_META = {
	rainRate: {
		label: "Rain rate",
		unit: "mm/h",
		min: 0,
		max: 50,
		step: .5,
		formula: "N(D) = N₀ e^{−ΛD},  Λ ≈ 4.1 R^{−0.21}",
		body: "Marshall–Palmer size spectrum. Higher R both adds drops and fattens the tail, so splash rate climbs faster than a linear count."
	},
	dropMm: {
		label: "Mean diameter",
		unit: "mm",
		min: .4,
		max: 5,
		step: .1,
		formula: "m = ρ · ⁴⁄₃πr³",
		body: "Mass scales with the cube of radius. A 3 mm drop carries ~27× the water of a 1 mm drop and hits much harder."
	},
	gravity: {
		label: "Gravity",
		unit: "m/s²",
		min: 1.6,
		max: 24,
		step: .1,
		formula: "a = g − (½ C_d ρ_air A |v| v) / m",
		body: "Earth is 9.81. Try lunar 1.62 — drops hang, Weber numbers collapse, crowns almost vanish."
	},
	wind: {
		label: "Wind",
		unit: "m/s",
		min: -8,
		max: 8,
		step: .1,
		formula: "v_x → v_wind (small drops couple faster)",
		body: "Quadratic drag makes tiny drops ride the air. Large drops keep more of their vertical momentum, so the column shears."
	},
	drag: {
		label: "Drag Cd",
		unit: "×",
		min: .15,
		max: 2.2,
		step: .05,
		formula: "v_t = √(2mg / (C_d ρ_air A))",
		body: "Terminal velocity. Raindrops sit around C_d ≈ 0.5–0.8. Crank it and everything floats; drop it and impacts go violent."
	},
	waveSpeed: {
		label: "Wave speed",
		unit: "×",
		min: .25,
		max: 2.2,
		step: .05,
		formula: "∂²h/∂t² = c² ∇²h",
		body: "2-D wave equation on the puddle grid. Faster c sends rings out quicker. Real puddles mix gravity and capillary terms."
	},
	damping: {
		label: "Viscosity",
		unit: "",
		min: .94,
		max: .998,
		step: .001,
		formula: "v ← v · d,  each step",
		body: "Phenomenological viscosity. Closer to 1 and rings linger like thick oil-skin water; lower and the street goes quiet between hits."
	},
	tension: {
		label: "Surface tension",
		unit: "×",
		min: .2,
		max: 2.4,
		step: .05,
		formula: "We = ρ v² D / σ",
		body: "σ ≈ 0.072 N/m for clean water. Raise it and Weber numbers fall — drops prefer to deposit instead of throwing a crown."
	},
	splashGain: {
		label: "Splash gain",
		unit: "×",
		min: 0,
		max: 2.2,
		step: .05,
		formula: "n_crown ≈ clamp(We / 25)",
		body: "Visual multiplier on crown droplets and ripple impulse. Physics still decides whether a hit is a deposit (We < 40) or a splash."
	},
	timeScale: {
		label: "Time scale",
		unit: "×",
		min: .05,
		max: 1.6,
		step: .05,
		formula: "Δt_sim = Δt_frame · s",
		body: "Slow motion is the easiest way to read a Worthington jet. 0.25× lets a single drop finish its crown."
	}
};
var base = {
	rainRate: 8,
	dropMm: 1.8,
	gravity: 9.81,
	wind: .4,
	drag: 1,
	waveSpeed: 1,
	damping: .985,
	tension: 1,
	splashGain: 1,
	timeScale: 1
};
var PRESETS = {
	still: {
		id: "still",
		label: "Still",
		blurb: "Empty plate. Tap the asphalt to place a single impact.",
		params: {
			...base,
			rainRate: 0,
			wind: 0,
			dropMm: 2.4,
			splashGain: 1.25
		}
	},
	drizzle: {
		id: "drizzle",
		label: "Drizzle",
		blurb: "Fine drops near terminal velocity. Quiet capillary rings.",
		params: {
			...base,
			rainRate: 1.4,
			dropMm: .9,
			wind: .2,
			splashGain: .55,
			damping: .99
		}
	},
	"three-am": {
		id: "three-am",
		label: "Three AM",
		blurb: "Cinematic moderate rain. Neon catching every ring.",
		params: { ...base }
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
			damping: .978
		}
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
			drag: .85,
			splashGain: 1.5,
			waveSpeed: 1.15,
			damping: .972
		}
	}
};
var PRESET_ORDER = [
	"still",
	"drizzle",
	"three-am",
	"downpour",
	"storm"
];
var useRainStore = create((set) => ({
	params: { ...PRESETS["three-am"].params },
	preset: "three-am",
	view: "cinematic",
	paused: false,
	panelOpen: false,
	activeNote: null,
	dropToken: 0,
	clearToken: 0,
	setParam: (key, value) => set((s) => ({
		params: {
			...s.params,
			[key]: value
		},
		preset: "custom"
	})),
	applyPreset: (id) => set({
		params: { ...PRESETS[id].params },
		preset: id
	}),
	setView: (view) => set({ view }),
	togglePause: () => set((s) => ({ paused: !s.paused })),
	setPaused: (paused) => set({ paused }),
	setPanelOpen: (panelOpen) => set({ panelOpen }),
	setActiveNote: (activeNote) => set({ activeNote }),
	fireDropOne: () => set((s) => ({ dropToken: s.dropToken + 1 })),
	fireClear: () => set((s) => ({ clearToken: s.clearToken + 1 }))
}));
var GROUPS = [
	{
		title: "Atmosphere",
		keys: [
			"rainRate",
			"dropMm",
			"wind"
		]
	},
	{
		title: "Flight",
		keys: [
			"gravity",
			"drag",
			"timeScale"
		]
	},
	{
		title: "Surface",
		keys: [
			"waveSpeed",
			"damping",
			"tension",
			"splashGain"
		]
	}
];
var VIEWS = [
	{
		id: "cinematic",
		label: "Plate"
	},
	{
		id: "height",
		label: "Height"
	},
	{
		id: "energy",
		label: "Weber"
	}
];
function formatValue(key, value) {
	if (key === "damping") return value.toFixed(3);
	if (key === "gravity" || key === "rainRate") return value.toFixed(1);
	if (Number.isInteger(value)) return String(value);
	return value.toFixed(2);
}
function ParamSlider({ k, value }) {
	const meta = PARAM_META[k];
	const setParam = useRainStore((s) => s.setParam);
	const setActiveNote = useRainStore((s) => s.setActiveNote);
	const active = useRainStore((s) => s.activeNote) === k;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: cn("block py-2", active && "rounded-md bg-secondary/80 px-2"),
		onPointerDown: () => setActiveNote(k),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mb-1.5 flex items-baseline justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium text-foreground",
				children: meta.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono text-2xs tabular-nums text-muted-foreground",
				children: [formatValue(k, value), meta.unit ? ` ${meta.unit}` : ""]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
			min: meta.min,
			max: meta.max,
			step: meta.step,
			value: [value],
			onValueChange: (v) => setParam(k, v[0] ?? value),
			"aria-label": meta.label
		})]
	});
}
function ControlDock({ stats }) {
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
	const note = activeNote ? PARAM_META[activeNote] : PARAM_META.rainRate;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-2xs tracking-widest text-muted-foreground uppercase",
					children: "Field notes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-3xl leading-none tracking-wide text-foreground",
					children: note.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-mono text-2xs leading-relaxed text-accent",
					children: note.formula
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted-foreground",
					children: note.body
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: PRESET_ORDER.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: preset === id ? "default" : "outline",
					onClick: () => applyPreset(id),
					children: PRESETS[id].label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs leading-relaxed text-muted-foreground",
				children: preset === "custom" ? "Custom mix." : PRESETS[preset].blurb
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-1.5",
				children: VIEWS.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: view === v.id ? "default" : "secondary",
					onClick: () => setView(v.id),
					children: v.label
				}, v.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						variant: "secondary",
						onClick: togglePause,
						children: [paused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {}), paused ? "Play" : "Pause"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						variant: "secondary",
						onClick: fireDropOne,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplet, {}), "Drop"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						variant: "secondary",
						onClick: fireClear,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {}), "Reset"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto pr-1",
				children: GROUPS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-2xs tracking-widest text-muted-foreground uppercase",
						children: g.title
					}), g.keys.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamSlider, {
						k,
						value: params[k]
					}, k))]
				}, g.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-border pt-3 font-mono text-2xs tabular-nums",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waves, { className: "size-3" }),
						label: "Aloft",
						value: String(stats.aloft)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplet, { className: "size-3" }),
						label: "Impacts",
						value: `${stats.impactsPerSec.toFixed(1)}/s`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "size-3" }),
						label: "We",
						value: stats.meanWe.toFixed(0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Frame",
						value: `${stats.fps.toFixed(0)} fps`
					})
				]
			})
		]
	});
}
function Stat({ label, value, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
			className: "flex items-center gap-1.5 text-muted-foreground",
			children: [icon, label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "text-foreground",
			children: value
		})]
	});
}
function LiveStrip({ stats, params }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-2xs tabular-nums text-foreground/80",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				"R ",
				params.rainRate.toFixed(1),
				" mm/h"
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				"D ",
				params.dropMm.toFixed(1),
				" mm"
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["We ", stats.meanWe.toFixed(0)] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [stats.aloft, " aloft"] })
		]
	});
}
function makePool(count, create) {
	const out = new Array(count);
	for (let i = 0; i < count; i++) out[i] = create();
	return out;
}
function acquire(pool) {
	for (let i = 0; i < pool.length; i++) if (!pool[i].live) return pool[i];
	return null;
}
/** Screen UV: origin bottom-left, y=0 near road, y=1 sky. */
function screenToGround(u, v) {
	const z = Math.min(1, Math.max(0, v / .88)) ** .85;
	const persp = 1.02 * (1 - z) + .36 * z;
	return {
		gx: .5 + (u - .5) / Math.max(.2, persp),
		gz: z
	};
}
function isRoad(u, vBottom) {
	if (vBottom < .03 || vBottom > .9) return false;
	const { gx, gz } = screenToGround(u, vBottom);
	if (gx < -.08 || gx > 1.1) return false;
	if (gz > .9 && (u < .16 || u > .84)) return false;
	return true;
}
function perspectiveScale(z) {
	return .45 + .9 * (1 - z);
}
var RHO_WATER = 1e3;
var RHO_AIR = 1.225;
var SIGMA_WATER = .072;
var CD_DROP = .6;
var FALL_HEIGHT_M = 6.2;
function emptyDrop() {
	return {
		live: false,
		x: 0,
		y: 0,
		z: 0,
		vx: 0,
		vy: 0,
		vz: 0,
		radiusM: .001,
		mass: 0,
		age: 0,
		trail: 0
	};
}
function emptySplash() {
	return {
		live: false,
		x: 0,
		y: 0,
		vx: 0,
		vy: 0,
		life: 0,
		maxLife: 0,
		size: 1
	};
}
function emptyFlash() {
	return {
		live: false,
		x: 0,
		y: 0,
		life: 0,
		we: 0
	};
}
function terminalVelocity(radiusM, mass, dragMul, g) {
	const area = Math.PI * radiusM * radiusM;
	const den = CD_DROP * dragMul * RHO_AIR * area;
	if (den <= 1e-8) return 12;
	return Math.sqrt(2 * mass * g / den);
}
function massOf(radiusM) {
	return RHO_WATER * (4 / 3) * Math.PI * radiusM * radiusM * radiusM;
}
function weber(radiusM, speed, tensionMul) {
	const d = radiusM * 2;
	const sigma = SIGMA_WATER * Math.max(.15, tensionMul);
	return RHO_WATER * speed * speed * d / sigma;
}
var DropSystem = class {
	drops;
	splashes;
	flashes;
	spawnAcc = 0;
	impactWindow = 0;
	impactCount = 0;
	weAccum = 0;
	weHits = 0;
	constructor() {
		this.drops = makePool(1600, emptyDrop);
		this.splashes = makePool(900, emptySplash);
		this.flashes = makePool(120, emptyFlash);
	}
	reset() {
		for (const d of this.drops) d.live = false;
		for (const s of this.splashes) s.live = false;
		for (const f of this.flashes) f.live = false;
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
	spawn(params, forced) {
		const d = acquire(this.drops);
		if (!d) return null;
		const mean = (forced?.dropMm ?? params.dropMm) / 1e3;
		const r = (forced ? mean * 2 : Math.min(.006, Math.max(35e-5, -Math.log(1 - Math.random() * .98) * mean))) / 2;
		const mass = massOf(r);
		const z = forced?.z ?? Math.random() ** 1.35;
		d.live = true;
		d.x = forced?.x ?? Math.random();
		d.y = forced ? -.08 : -.12 * Math.random();
		d.z = z;
		d.radiusM = r;
		d.mass = mass;
		d.age = 0;
		d.vy = terminalVelocity(r, mass, params.drag, params.gravity) * (.55 + Math.random() * .5);
		d.vx = params.wind * (.35 + 9e-4 / Math.max(r, 4e-4) * .15);
		d.vz = 0;
		d.trail = .018 + r * 18;
		return d;
	}
	splashAt(x, y, we, speed, gain) {
		this.splashCrown(x, y, we, speed, gain);
		this.impactCount++;
		this.weAccum += we;
		this.weHits++;
	}
	splashCrown(x, y, we, speed, gain) {
		const n = Math.min(18, Math.floor(we / 28 * gain));
		for (let i = 0; i < n; i++) {
			const s = acquire(this.splashes);
			if (!s) break;
			const ang = Math.PI * .35 + Math.random() * Math.PI * .45;
			const dir = i / Math.max(1, n) * Math.PI * 2 + Math.random() * .4;
			const sp = speed * (.12 + Math.random() * .22) * gain;
			s.live = true;
			s.x = x;
			s.y = y;
			s.vx = Math.cos(dir) * sp * .08 * Math.cos(ang);
			s.vy = -Math.sin(ang) * sp * .05;
			s.life = 0;
			s.maxLife = .18 + Math.random() * .28;
			s.size = .6 + Math.random() * 1.4;
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
	step(dt, params, onImpact) {
		const g = params.gravity;
		const dragMul = params.drag;
		const wind = params.wind;
		if (params.rainRate > 0) {
			const flux = params.rainRate * (1.15 + 8 / Math.max(params.dropMm, .4));
			this.spawnAcc += flux * dt;
			const budget = 90 * dt * 60;
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
			const mag = .5 * cd * RHO_AIR * area * speed;
			const invM = 1 / d.mass;
			const fx = -mag * (d.vx - wind) * invM;
			const fy = g - mag * d.vy * invM;
			d.vx += fx * dt;
			d.vy += fy * dt;
			const scale = perspectiveScale(d.z);
			const fall = FALL_HEIGHT_M;
			d.x += d.vx / 14 * dt;
			d.y += d.vy / fall * dt * (.65 + .55 * scale);
			const groundY = .9 - d.z * .68;
			if (d.y >= groundY || d.y > 1.08 || d.x < -.18 || d.x > 1.18) {
				d.live = false;
				if (d.y >= groundY && d.x > -.04 && d.x < 1.04) {
					const spd = Math.hypot(d.vx, d.vy);
					const we = weber(d.radiusM, spd, params.tension);
					this.impactCount++;
					this.weAccum += we;
					this.weHits++;
					if (we > 12) this.splashCrown(d.x, d.y, we, spd, params.splashGain);
					onImpact(d.x, 1 - d.y, we, spd, d.radiusM);
				}
			}
		}
		for (const s of this.splashes) {
			if (!s.live) continue;
			s.life += dt;
			s.vy += g * .08 * dt;
			s.x += s.vx * dt;
			s.y += s.vy * dt;
			if (s.life >= s.maxLife) s.live = false;
		}
		for (const f of this.flashes) {
			if (!f.live) continue;
			f.life += dt;
			if (f.life > .16) f.live = false;
		}
		this.impactWindow += dt;
	}
	meanWe() {
		if (this.weHits < 1) return 0;
		return this.weAccum / this.weHits;
	}
	impactsPerSec() {
		if (this.impactWindow < .35) return this.impactCount / Math.max(this.impactWindow, .001);
		const r = this.impactCount / this.impactWindow;
		this.impactCount *= .35;
		this.impactWindow *= .35;
		this.weAccum *= .6;
		this.weHits = Math.floor(this.weHits * .6);
		return r;
	}
};
var VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;
var FRAG = `
precision mediump float;
uniform sampler2D uStreet;
uniform sampler2D uHeight;
uniform vec2 uTexel;
uniform float uDisplace;
uniform float uSpec;
uniform int uMode;
varying vec2 vUv;

vec2 toGround(vec2 uv) {
  float gz = clamp(uv.y / 0.88, 0.0, 1.0);
  gz = pow(gz, 0.85);
  float persp = mix(1.02, 0.36, gz);
  float gx = 0.5 + (uv.x - 0.5) / max(persp, 0.2);
  return vec2(gx, gz);
}

float sampleH(vec2 g) {
  if (g.x < 0.0 || g.x > 1.0 || g.y < 0.0 || g.y > 1.0) return 0.0;
  float encoded = texture2D(uHeight, g).r;
  return (encoded - 0.5) * 0.284;
}

void main() {
  vec2 uv = vUv;
  vec2 g = toGround(uv);
  float h = sampleH(g);
  float hx = sampleH(g + vec2(uTexel.x, 0.0)) - sampleH(g - vec2(uTexel.x, 0.0));
  float hy = sampleH(g + vec2(0.0, uTexel.y)) - sampleH(g - vec2(0.0, uTexel.y));
  vec3 n = normalize(vec3(-hx * 18.0, -hy * 18.0, 1.0));

  vec2 duv = n.xy * uDisplace * (0.45 + 0.7 * (1.0 - g.y));
  vec2 suv = vec2(uv.x + duv.x, uv.y + duv.y);
  suv = clamp(suv, 0.0, 1.0);
  vec3 street = texture2D(uStreet, suv).rgb;

  if (uMode == 1) {
    float t = h * 6.0 + 0.5;
    vec3 lo = vec3(0.03, 0.05, 0.12);
    vec3 mid = vec3(0.15, 0.55, 0.72);
    vec3 hi = vec3(0.92, 0.9, 0.82);
    vec3 col = mix(lo, mid, clamp(t * 2.0, 0.0, 1.0));
    col = mix(col, hi, clamp(t * 2.0 - 1.0, 0.0, 1.0));
    gl_FragColor = vec4(col, 1.0);
    return;
  }

  vec3 l1 = normalize(vec3(0.45, 0.72, 0.52));
  vec3 l2 = normalize(vec3(-0.55, 0.4, 0.4));
  float spec1 = pow(max(dot(n, l1), 0.0), 48.0);
  float spec2 = pow(max(dot(n, l2), 0.0), 28.0);
  vec3 neon = mix(vec3(0.35, 0.55, 1.0), vec3(1.0, 0.38, 0.62), clamp(uv.x * 1.1, 0.0, 1.0));
  vec3 amber = vec3(1.0, 0.62, 0.28);
  vec3 add = neon * spec1 * uSpec + amber * spec2 * uSpec * 0.55;
  float wet = 1.0 + abs(h) * 1.4;
  vec3 color = street * wet + add;
  if (uMode == 2) {
    color = street * 0.55 + add * 1.4;
    color += vec3(0.1, 0.55, 0.7) * abs(h) * 3.5;
  }
  gl_FragColor = vec4(color, 1.0);
}
`;
function compile(gl, type, src) {
	const sh = gl.createShader(type);
	if (!sh) throw new Error("shader");
	gl.shaderSource(sh, src);
	gl.compileShader(sh);
	if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
		const log = gl.getShaderInfoLog(sh);
		gl.deleteShader(sh);
		throw new Error(log || "compile");
	}
	return sh;
}
var StreetRenderer = class {
	gl;
	program;
	streetTex;
	heightTex;
	loc;
	cols = 192;
	rows = 128;
	ready = false;
	constructor(canvas) {
		const gl = canvas.getContext("webgl", {
			alpha: false,
			antialias: false,
			preserveDrawingBuffer: false,
			powerPreference: "high-performance"
		});
		if (!gl) throw new Error("WebGL unavailable");
		this.gl = gl;
		const vs = compile(gl, gl.VERTEX_SHADER, VERT);
		const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
		const prog = gl.createProgram();
		if (!prog) throw new Error("program");
		gl.attachShader(prog, vs);
		gl.attachShader(prog, fs);
		gl.bindAttribLocation(prog, 0, "aPos");
		gl.linkProgram(prog);
		if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || "link");
		this.program = prog;
		const buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-1,
			-1,
			3,
			-1,
			-1,
			3
		]), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
		this.streetTex = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.streetTex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([
			7,
			8,
			12
		]));
		this.heightTex = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.heightTex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		this.loc = {
			street: gl.getUniformLocation(prog, "uStreet"),
			height: gl.getUniformLocation(prog, "uHeight"),
			texel: gl.getUniformLocation(prog, "uTexel"),
			displace: gl.getUniformLocation(prog, "uDisplace"),
			spec: gl.getUniformLocation(prog, "uSpec"),
			mode: gl.getUniformLocation(prog, "uMode")
		};
		this.loadStreet();
	}
	loadStreet() {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => {
			const gl = this.gl;
			gl.bindTexture(gl.TEXTURE_2D, this.streetTex);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
			this.ready = true;
		};
		img.src = "/street.jpg";
	}
	resize(width, height, dpr) {
		const gl = this.gl;
		const w = Math.max(1, Math.floor(width * dpr));
		const h = Math.max(1, Math.floor(height * dpr));
		if (gl.canvas.width !== w || gl.canvas.height !== h) {
			gl.canvas.width = w;
			gl.canvas.height = h;
		}
		gl.viewport(0, 0, w, h);
	}
	draw(heightBytes, cols, rows, mode, displace, spec) {
		const gl = this.gl;
		this.cols = cols;
		this.rows = rows;
		gl.bindTexture(gl.TEXTURE_2D, this.heightTex);
		gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, cols, rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, heightBytes);
		gl.useProgram(this.program);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.streetTex);
		gl.uniform1i(this.loc.street, 0);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.heightTex);
		gl.uniform1i(this.loc.height, 1);
		gl.uniform2f(this.loc.texel, 1 / cols, 1 / rows);
		gl.uniform1f(this.loc.displace, displace);
		gl.uniform1f(this.loc.spec, spec);
		gl.uniform1i(this.loc.mode, mode);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}
	destroy() {
		const gl = this.gl;
		gl.deleteTexture(this.streetTex);
		gl.deleteTexture(this.heightTex);
		gl.deleteProgram(this.program);
	}
};
var WaveField = class {
	cols;
	rows;
	height;
	vel;
	bytes;
	constructor(cols = 192, rows = 128) {
		this.cols = cols;
		this.rows = rows;
		const n = cols * rows;
		this.height = new Float32Array(n);
		this.vel = new Float32Array(n);
		this.bytes = new Uint8Array(n * 4);
	}
	clear() {
		this.height.fill(0);
		this.vel.fill(0);
	}
	impulse(gx, gz, radius, amp) {
		const { cols, rows, height, vel } = this;
		const cx = gx * (cols - 1);
		const cy = gz * (rows - 1);
		const r = Math.max(1.2, radius * cols);
		const r2 = r * r;
		const x0 = Math.max(1, Math.floor(cx - r - 1));
		const x1 = Math.min(cols - 2, Math.ceil(cx + r + 1));
		const y0 = Math.max(1, Math.floor(cy - r - 1));
		const y1 = Math.min(rows - 2, Math.ceil(cy + r + 1));
		for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
			const dx = x - cx;
			const dy = (y - cy) * 1.15;
			const d2 = dx * dx + dy * dy;
			if (d2 > r2) continue;
			const k = Math.exp(-d2 / (r2 * .28));
			const i = y * cols + x;
			height[i] += amp * k;
			vel[i] += amp * 6 * k;
		}
	}
	step(dt, speed, damping) {
		const { cols, rows, height: h, vel: v } = this;
		const c2 = 14 * speed * (14 * speed);
		const damp = Math.pow(damping, dt * 60);
		const maxV = 2.5;
		for (let y = 1; y < rows - 1; y++) {
			const row = y * cols;
			for (let x = 1; x < cols - 1; x++) {
				const i = row + x;
				const lap = h[i - 1] + h[i + 1] + h[i - cols] + h[i + cols] - 4 * h[i];
				v[i] += lap * c2 * dt;
				v[i] *= damp;
				if (v[i] > maxV) v[i] = maxV;
				else if (v[i] < -2.5) v[i] = -2.5;
			}
		}
		for (let i = 0; i < h.length; i++) h[i] += v[i] * dt;
		const fade = .86;
		for (let x = 0; x < cols; x++) {
			h[x] *= fade;
			v[x] *= fade;
			h[(rows - 1) * cols + x] *= fade;
			v[(rows - 1) * cols + x] *= fade;
		}
		for (let y = 0; y < rows; y++) {
			h[y * cols] *= fade;
			v[y * cols] *= fade;
			h[y * cols + cols - 1] *= fade;
			v[y * cols + cols - 1] *= fade;
		}
	}
	encode() {
		const { height, bytes } = this;
		for (let i = 0; i < height.length; i++) {
			const e = 128 + height[i] * 900;
			const b = e < 0 ? 0 : e > 255 ? 255 : e;
			const o = i * 4;
			bytes[o] = b;
			bytes[o + 1] = b;
			bytes[o + 2] = b;
			bytes[o + 3] = 255;
		}
		return bytes;
	}
};
var MODE_INDEX = {
	cinematic: 0,
	height: 1,
	energy: 2
};
var RainEngine = class {
	glCanvas;
	fx;
	fxCtx;
	renderer = null;
	waves = new WaveField(192, 128);
	drops = new DropSystem();
	raf = 0;
	last = 0;
	acc = 0;
	running = false;
	fpsEma = 60;
	lastDrop = 0;
	lastClear = 0;
	reduced = false;
	stats = {
		aloft: 0,
		impacts: 0,
		impactsPerSec: 0,
		meanWe: 0,
		fps: 60
	};
	constructor(glCanvas, fx) {
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
		const loop = (now) => {
			if (!this.running) return;
			const raw = Math.min(.05, (now - this.last) / 1e3);
			this.last = now;
			this.fpsEma = this.fpsEma * .9 + (raw > 0 ? 1 / raw : 60) * .1;
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
	pointer(clientX, clientY) {
		const rect = this.fx.getBoundingClientRect();
		const u = (clientX - rect.left) / rect.width;
		const vTop = (clientY - rect.top) / rect.height;
		const vBottom = 1 - vTop;
		if (!isRoad(u, vBottom)) return;
		const { gx, gz } = screenToGround(u, vBottom);
		this.waves.impulse(gx, gz, .05, .1);
		this.drops.splashAt(u, vTop, 160, 9, 1.2);
	}
	consumeTokens() {
		const s = useRainStore.getState();
		if (s.dropToken !== this.lastDrop) {
			this.lastDrop = s.dropToken;
			const params = s.params;
			this.drops.spawn(params, {
				x: .38 + Math.random() * .28,
				z: .22,
				dropMm: 4.8
			});
		}
		if (s.clearToken !== this.lastClear) {
			this.lastClear = s.clearToken;
			this.waves.clear();
			this.drops.reset();
		}
	}
	tick(dt) {
		this.consumeTokens();
		const { params, paused, view } = useRainStore.getState();
		const scale = paused || this.reduced ? 0 : params.timeScale;
		const step = Math.min(.033, dt) * scale;
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
	simulate(dt, params) {
		this.waves.step(dt, params.waveSpeed * (.7 + .3 * params.tension), params.damping);
		this.drops.step(dt, params, (u, v, we, _speed, radiusM) => {
			const { gx, gz } = screenToGround(u, v);
			const amp = (.012 + Math.min(.11, we / 1800)) * params.splashGain;
			const rad = .018 + radiusM * 8 + Math.min(.06, we / 4e3);
			this.waves.impulse(gx, gz, rad, amp);
		});
	}
	draw(view, splashGain) {
		const bytes = this.waves.encode();
		const displace = view === "height" ? .004 : .016;
		const spec = view === "cinematic" ? .55 * splashGain : .8;
		this.renderer?.draw(bytes, this.waves.cols, this.waves.rows, MODE_INDEX[view], displace, spec);
		this.drawFx(view);
	}
	drawFx(view) {
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
			const thick = Math.max(.6, d.radiusM * 1400 * sc) * (w / 1280);
			const alpha = view === "energy" ? .55 + Math.min(.4, d.radiusM * 80) : .18 + .35 * sc;
			if (view === "energy") {
				const t = Math.min(1, d.radiusM / .0025);
				ctx.strokeStyle = `rgba(${Math.round(80 + t * 160)}, ${Math.round(170 - t * 40)}, ${Math.round(255 - t * 80)}, ${alpha})`;
			} else ctx.strokeStyle = `rgba(210, 226, 255, ${alpha})`;
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
			ctx.fillStyle = `rgba(230, 236, 255, ${.55 * t})`;
			ctx.beginPath();
			ctx.arc(x, y, Math.max(.7, s.size * t * (w / 900)), 0, Math.PI * 2);
			ctx.fill();
		}
		for (const f of this.drops.flashes) {
			if (!f.live) continue;
			const t = 1 - f.life / .16;
			const x = f.x * w;
			const y = f.y * h;
			const r = (6 + Math.min(18, f.we * .04)) * t * (w / 1280);
			const g = view === "energy" ? Math.min(255, 40 + f.we) : 210;
			ctx.fillStyle = `rgba(255, ${Math.round(g)}, 230, ${.45 * t})`;
			ctx.beginPath();
			ctx.arc(x, y, r, 0, Math.PI * 2);
			ctx.fill();
		}
	}
};
var ZERO_STATS = {
	aloft: 0,
	impacts: 0,
	impactsPerSec: 0,
	meanWe: 0,
	fps: 0
};
function RainLab() {
	const hostRef = (0, import_react.useRef)(null);
	const glRef = (0, import_react.useRef)(null);
	const fxRef = (0, import_react.useRef)(null);
	const engineRef = (0, import_react.useRef)(null);
	const [stats, setStats] = (0, import_react.useState)(ZERO_STATS);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [hint, setHint] = (0, import_react.useState)(true);
	const paused = useRainStore((s) => s.paused);
	const panelOpen = useRainStore((s) => s.panelOpen);
	const params = useRainStore((s) => s.params);
	const togglePause = useRainStore((s) => s.togglePause);
	const setPanelOpen = useRainStore((s) => s.setPanelOpen);
	const applyPreset = useRainStore((s) => s.applyPreset);
	const fireDropOne = useRainStore((s) => s.fireDropOne);
	const fireClear = useRainStore((s) => s.fireClear);
	const setView = useRainStore((s) => s.setView);
	(0, import_react.useEffect)(() => {
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
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const tag = e.target?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA") return;
			if (e.code === "Space") {
				e.preventDefault();
				togglePause();
			} else if (e.key === "d" || e.key === "D") fireDropOne();
			else if (e.key === "r" || e.key === "R") fireClear();
			else if (e.key === "1" || e.key === "2" || e.key === "3" || e.key === "4" || e.key === "5") applyPreset(PRESET_ORDER[Number(e.key) - 1]);
			else if (e.key === "h" || e.key === "H") {
				const order = [
					"cinematic",
					"height",
					"energy"
				];
				const cur = useRainStore.getState().view;
				setView(order[(order.indexOf(cur) + 1) % order.length]);
			} else if (e.key === "Escape") setPanelOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		applyPreset,
		fireClear,
		fireDropOne,
		setPanelOpen,
		setView,
		togglePause
	]);
	const onPointer = (e) => {
		if (e.target.closest("[data-ui]")) return;
		engineRef.current?.pointer(e.clientX, e.clientY);
		setHint(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		ref: hostRef,
		className: "relative h-dvh w-full overflow-hidden bg-background text-foreground",
		onPointerDown: onPointer,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: glRef,
				className: "absolute inset-0 h-full w-full"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: fxRef,
				className: "absolute inset-0 h-full w-full"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-ui": true,
				className: "pointer-events-none absolute inset-0 flex flex-col justify-between p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] md:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-2xs tracking-[0.28em] text-foreground/70 uppercase",
							children: "Rain physics lab"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl leading-none tracking-wide text-foreground md:text-5xl",
							children: "Three AM Pavement"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-sm text-sm text-foreground/70",
							children: "Ballistic drops, capillary-gravity ripples, splash crowns. Tap the asphalt."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-auto flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "icon",
							variant: "secondary",
							"aria-label": paused ? "Play" : "Pause",
							onClick: togglePause,
							children: paused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "icon",
							variant: "secondary",
							className: "lg:hidden",
							"aria-label": panelOpen ? "Close controls" : "Open controls",
							onClick: () => setPanelOpen(!panelOpen),
							children: panelOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, {})
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-end justify-between gap-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveStrip, {
							stats,
							params
						}), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-foreground/60",
							children: "Click a puddle · Space pauses · D drops one"
						}) : null]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				"data-ui": true,
				className: "pointer-events-auto absolute top-4 right-4 bottom-4 hidden w-80 lg:flex",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-full w-full flex-col rounded-2xl border border-border bg-card p-5 text-card-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlDock, { stats })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-ui": true,
				className: cn("pointer-events-auto absolute inset-x-0 bottom-0 lg:hidden", panelOpen ? "flex" : "hidden"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex max-h-[78dvh] w-full flex-col rounded-t-2xl border border-border bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-card-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlDock, { stats })
				})
			}),
			!ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center bg-background",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl tracking-wide",
					children: "Loading plate"
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "sr-only",
				children: [
					"Presets ",
					PRESETS["three-am"].label,
					". Simulation running at ",
					stats.fps.toFixed(0),
					" frames per second."
				]
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RainLab, {});
}
//#endregion
export { Home as component };
