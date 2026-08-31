const HORA_RECORDATORIO = '09:00:00'

function formatoICSFecha(fechaISO: string, hora: string): string {
  return `${fechaISO.replace(/-/g, '')}T${hora.replace(/:/g, '')}`
}

function formatoICSAhora(): string {
  return new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

/** Evento de calendario (.ics) con alarma para recordar la siguiente dosis. */
export function crearRecordatorioICS(fechaProximaDosis: string): string {
  const inicio = formatoICSFecha(fechaProximaDosis, HORA_RECORDATORIO)

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Seguimiento Semaglutida//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${crypto.randomUUID()}@seguimiento-semaglutida`,
    `DTSTAMP:${formatoICSAhora()}`,
    `DTSTART:${inicio}`,
    'DURATION:PT30M',
    'SUMMARY:Aplicar siguiente dosis de semaglutida',
    'DESCRIPTION:Recordatorio automático: han pasado 7 días desde tu última inyección.',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Aplicar siguiente dosis de semaglutida',
    'TRIGGER:PT0S',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n')
}

export function descargarICS(contenido: string, nombreArchivo: string): void {
  const blob = new Blob([contenido], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombreArchivo
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
