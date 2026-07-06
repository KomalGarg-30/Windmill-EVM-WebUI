export function cn(...inputs: any[]) {
  return inputs
    .flat()
    .filter((x) => typeof x === 'string' && x)
    .join(' ');
}
