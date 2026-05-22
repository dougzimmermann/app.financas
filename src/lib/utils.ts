import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function getCurrentMonthRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

export const INCOME_CATEGORIES = [
  "Salário",
  "Freelance",
  "Investimentos",
  "Aluguel",
  "Outros",
] as const;

export const EXPENSE_CATEGORIES = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Educação",
  "Lazer",
  "Roupas",
  "Assinaturas",
  "Outros",
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  Alimentação: "#3B82F6",
  Transporte: "#8B5CF6",
  Moradia: "#F59E0B",
  Saúde: "#EF4444",
  Educação: "#06B6D4",
  Lazer: "#EC4899",
  Roupas: "#F97316",
  Assinaturas: "#6366F1",
  Outros: "#6B7280",
  Salário: "#10B981",
  Freelance: "#059669",
  Investimentos: "#34D399",
  Aluguel: "#6EE7B7",
};
