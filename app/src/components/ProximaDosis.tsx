import { useEffect, useState } from 'react'
import { crearRecordatorioICS, descargarICS } from '../calendario'
import type { Registro } from '../types'
import { diasHasta, formatearFecha, sumarDias } from '../utils'

interface Props {
  registros: Registro[]
}

function textoEstado(dias: number): string {
  if (dias === 0) return 'Hoy toca tu siguiente dosis'
  if (dias === 1) return 'Mañana toca tu siguiente dosis'
  if (dias > 1) return `Faltan ${dias} días`
  const atraso = Math.abs(dias)
  return atraso === 1 ? 'Atrasada por 1 día' : `Atrasada por ${atraso} días`
}

export default function ProximaDosis({ registros }: Props) {
  const [permiso, setPermiso] = useState<NotificationPermission | 'no-soportado'>(
    'Notification' in window ? Notification.permission : 'no-soportado',
  )
  const [avisado, setAvisado] = useState(false)

  const ultimo = [...registros].sort((a, b) => b.fecha.localeCompare(a.fecha))[0]
  const proximaFecha = ultimo ? sumarDias(ultimo.fecha, 7) : null
  const dias = proximaFecha ? diasHasta(proximaFecha) : 0
  const vencida = dias <= 0

  useEffect(() => {
    if (!proximaFecha || !vencida || avisado) return
    if (permiso !== 'granted') return
    new Notification('Seguimiento de Semaglutida', {
      body: textoEstado(dias),
      tag: 'proxima-dosis',
    })
    setAvisado(true)
  }, [proximaFecha, vencida, dias, permiso, avisado])

  if (!ultimo || !proximaFecha) return null

  function activarAvisos() {
    Notification.requestPermission().then(setPermiso)
  }

  function agregarACalendario() {
    if (!proximaFecha) return
    const ics = crearRecordatorioICS(proximaFecha)
    descargarICS(ics, 'proxima-dosis-semaglutida.ics')
  }

  return (
    <div className={`tarjeta proxima-dosis ${vencida ? 'vencida' : ''}`}>
      <h2>Próxima dosis</h2>
      <p className="proxima-dosis-fecha">{formatearFecha(proximaFecha)}</p>
      <p className={`proxima-dosis-estado ${vencida ? 'vencida' : ''}`}>{textoEstado(dias)}</p>

      <div className="proxima-dosis-acciones">
        <button type="button" className="boton-secundario" onClick={agregarACalendario}>
          Añadir alarma al calendario
        </button>
        {permiso === 'default' && (
          <button type="button" className="boton-secundario" onClick={activarAvisos}>
            Activar aviso en la app
          </button>
        )}
      </div>
    </div>
  )
}
