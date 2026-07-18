import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function getProficiencyColor(level: string) {
  switch (level.toLowerCase()) {
    case "advanced":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "intermediate":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    default:
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  }
}

export function getDifficultyColor(level: string) {
  switch (level.toLowerCase()) {
    case "advanced":
      return "text-red-400";
    case "intermediate":
      return "text-amber-400";
    default:
      return "text-emerald-400";
  }
}
