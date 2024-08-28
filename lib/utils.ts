import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hasProperty<T extends object, K extends PropertyKey>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> {
  return key in obj;
}