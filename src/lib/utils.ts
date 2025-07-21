import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string) => {
  if (!name) {
    return "?";
  }

  const words = name.split(" ");

  let initials = "";
  words.forEach((word) => {
    initials += word[0].toUpperCase();
  });

  return initials.substring(0, 2);
};
