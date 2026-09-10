export function makePool<T>(count: number, create: () => T): T[] {
  const out = new Array<T>(count);
  for (let i = 0; i < count; i++) out[i] = create();
  return out;
}

export function acquire<T extends { live: boolean }>(pool: T[]): T | null {
  for (let i = 0; i < pool.length; i++) {
    if (!pool[i].live) return pool[i];
  }
  return null;
}
