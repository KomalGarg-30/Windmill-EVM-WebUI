type ClassValue = string | false | 0 | undefined | null | ClassValue[];

export function cn(...inputs: ClassValue[]) {
  return inputs
    .flat()
    .filter((x): x is string => typeof x === 'string' && !!x)
    .join(' ');
}
