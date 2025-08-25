export function getPlantIndex(x: number, y: number) {
  return (6 - 1 - y) * 3 + x + 1;
}
