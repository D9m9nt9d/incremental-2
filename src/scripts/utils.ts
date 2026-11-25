export function removeFromArray<T>(array: T[], index: number): T[] {
  if (!Number.isInteger(index) || index < 0 || index >= array.length) {
    return [...array];
  }
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number, places: number = 2): number {
  const factor = 10 ** places;
  const value = Math.random() * (max - min) + min;
  return Math.round(value * factor) / factor;
}