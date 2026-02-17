export function computeOffsets(count: number) {
  if (count <= 1) return [50];

  const gap = 20;
  const center = 50;

  const offsets: number[] = [];

  for (let i = 0; i < count; i++) {
    const shift = (i - (count - 1) / 2) * gap;
    offsets.push(center + shift);
  }

  return offsets;
}
