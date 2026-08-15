import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("pt-BR");
}

export function formatDateTime(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function monthLabel(month: number): string {
  const labels = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ];
  return labels[(month - 1) % 12] ?? "—";
}

export function seasonOfMonth(month: number): "verao" | "outono" | "inverno" | "primavera" {
  // Hemisfério Sul
  if (month >= 12 || month <= 2) return "verao";
  if (month >= 3 && month <= 5) return "outono";
  if (month >= 6 && month <= 8) return "inverno";
  return "primavera";
}

export function currentSeason(): "verao" | "outono" | "inverno" | "primavera" {
  return seasonOfMonth(new Date().getMonth() + 1);
}
