export function wait(time: number = 0) {
  return new Promise((r) => setTimeout(r, time));
}
