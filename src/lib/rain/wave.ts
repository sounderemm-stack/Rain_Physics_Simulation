export class WaveField {
  readonly cols: number;
  readonly rows: number;
  readonly height: Float32Array;
  readonly vel: Float32Array;
  readonly bytes: Uint8Array;


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

  impulse(gx: number, gz: number, radius: number, amp: number) {
    const { cols, rows, height, vel } = this;
    const cx = gx * (cols - 1);
    const cy = gz * (rows - 1);
    const r = Math.max(1.2, radius * cols);
    const r2 = r * r;
    const x0 = Math.max(1, Math.floor(cx - r - 1));
    const x1 = Math.min(cols - 2, Math.ceil(cx + r + 1));
    const y0 = Math.max(1, Math.floor(cy - r - 1));
    const y1 = Math.min(rows - 2, Math.ceil(cy + r + 1));
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const dx = x - cx;
        const dy = (y - cy) * 1.15;
        const d2 = dx * dx + dy * dy;
        if (d2 > r2) continue;
        const k = Math.exp(-d2 / (r2 * 0.28));
        const i = y * cols + x;
        height[i] += amp * k;
        vel[i] += amp * 6 * k;
      }
    }
  }

  step(dt: number, speed: number, damping: number) {
    const { cols, rows, height: h, vel: v } = this;
    const c2 = (14 * speed) * (14 * speed);
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
        else if (v[i] < -maxV) v[i] = -maxV;
      }
    }
    for (let i = 0; i < h.length; i++) {
      h[i] += v[i] * dt;
    }
    // Absorbing edges
    const fade = 0.86;
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
}
