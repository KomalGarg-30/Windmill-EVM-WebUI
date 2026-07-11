export function cn(...inputs: unknown[]) {
  return inputs
    .flat()
    .filter((x) => typeof x === 'string' && x)
    .join(' ');
}
