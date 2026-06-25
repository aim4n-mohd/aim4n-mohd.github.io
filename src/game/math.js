export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const lerp = (a, b, t) => a + (b - a) * t;
export const rand = (min, max) => min + Math.random() * (max - min);
export const pick = (items) => items[Math.floor(Math.random() * items.length)];
export const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

export function stableId(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
