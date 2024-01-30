import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Random, MersenneTwister19937 } from "random-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randomWithSeed(seed: number, min = 0, max = 1) {
  return new Random(MersenneTwister19937.seed(seed)).integer(min, max);
}

// source: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
export function hashStringToNumber(input: string): number {
  let hash = 0;
  if (input.length === 0) return hash;
  for (let i = 0; i < input.length; i++) {
    const chr = input.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export function titleCase(text: string) {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function splitCamelCase(text: string) {
  return text.replace(/([a-z])([A-Z])/g, "$1 $2");
}
