export function toPriceCents(value: number) {
  return Math.round(value * 100);
}

export function fromPriceCents(value: number) {
  return value / 100;
}
