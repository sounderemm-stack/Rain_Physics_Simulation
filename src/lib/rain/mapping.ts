/** Screen UV: origin bottom-left, y=0 near road, y=1 sky. */

export function screenToGround(u: number, v: number): { gx: number; gz: number } {
  const gz = Math.min(1, Math.max(0, v / 0.88));
  const z = gz ** 0.85;
  const persp = 1.02 * (1 - z) + 0.36 * z;
  const gx = 0.5 + (u - 0.5) / Math.max(0.2, persp);
  return { gx, gz: z };
}

export function groundToScreen(gx: number, gz: number): { u: number; v: number } {
  const z = Math.min(1, Math.max(0, gz));
  const persp = 1.02 * (1 - z) + 0.36 * z;
  const u = 0.5 + (gx - 0.5) * persp;
  const v = z ** (1 / 0.85) * 0.88;
  return { u, v };
}

export function isRoad(u: number, vBottom: number): boolean {
  if (vBottom < 0.03 || vBottom > 0.9) return false;
  const { gx, gz } = screenToGround(u, vBottom);
  if (gx < -0.08 || gx > 1.1) return false;
  if (gz > 0.9 && (u < 0.16 || u > 0.84)) return false;
  return true;
}

export function perspectiveScale(z: number): number {
  return 0.45 + 0.9 * (1 - z);
}
