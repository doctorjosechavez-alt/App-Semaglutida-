import type { Registro } from './types'

const STORAGE_KEY = 'semaglutida-registros-v1'

export function cargarRegistros(): Registro[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data
  } catch {
    return []
  }
}

export function guardarRegistros(registros: Registro[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registros))
}
