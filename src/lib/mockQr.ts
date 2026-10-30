/**
 * Generates a deterministic, QR-looking 21x21 matrix from a seed string.
 * Visual mock only — it is not a scannable QR code.
 */
export function mockQrMatrix(seed: string, size = 21): boolean[][] {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rand = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 1000) / 1000;
  };

  const m = Array.from({ length: size }, () => Array.from({ length: size }, () => rand() > 0.52));

  const finder = (r0: number, c0: number) => {
    for (let r = -1; r <= 7; r++)
      for (let c = -1; c <= 7; c++) {
        const rr = r0 + r, cc = c0 + c;
        if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
        const ring = Math.max(Math.abs(r - 3), Math.abs(c - 3));
        m[rr][cc] = ring !== 2 && ring !== 4;
      }
  };
  finder(0, 0);
  finder(0, size - 7);
  finder(size - 7, 0);
  return m;
}

export function makeCredentialId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return `NGE-${new Date().getFullYear()}-${id}`;
}
