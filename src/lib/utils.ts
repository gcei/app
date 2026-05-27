import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Retorna a data de HOJE no formato do `<input type="date">` (YYYY-MM-DD)
 * usando o fuso LOCAL. Não use `toISOString()` aqui: ele converte para UTC e
 * pode devolver o dia errado em fusos atrás de UTC (ex.: UTC-3).
 */
export function todayDateInput() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
