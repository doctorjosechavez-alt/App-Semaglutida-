export function formatearFecha(fecha: string): string {
  const [anio, mes, dia] = fecha.split('-').map(Number)
  const d = new Date(anio, mes - 1, dia)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function hoyISO(): string {
  return aISO(new Date())
}

function aISO(d: Date): string {
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

export function sumarDias(fecha: string, dias: number): string {
  const [anio, mes, dia] = fecha.split('-').map(Number)
  const d = new Date(anio, mes - 1, dia + dias)
  return aISO(d)
}

/** Días desde hoy hasta `fecha` (negativo si `fecha` ya pasó). */
export function diasHasta(fecha: string): number {
  const [anio, mes, dia] = fecha.split('-').map(Number)
  const objetivo = new Date(anio, mes - 1, dia)
  const hoy = new Date()
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  const msPorDia = 24 * 60 * 60 * 1000
  return Math.round((objetivo.getTime() - inicioHoy.getTime()) / msPorDia)
}

/** Días transcurridos desde `fecha` hasta hoy (negativo si `fecha` es futura). */
export function diasDesde(fecha: string): number {
  return -diasHasta(fecha)
}

/** Vida media de eliminación de la semaglutida, en días (~165 horas, FDA/Novo Nordisk). */
export const VIDA_MEDIA_DIAS = 165 / 24

/** % de concentración restante de una dosis, `dias` después de aplicada (decaimiento de primer orden). */
export function concentracionRelativa(dias: number): number {
  return 100 * Math.pow(0.5, dias / VIDA_MEDIA_DIAS)
}
