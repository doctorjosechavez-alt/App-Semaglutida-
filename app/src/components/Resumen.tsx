import type { Registro } from '../types'

interface Props {
  registros: Registro[]
}

export default function Resumen({ registros }: Props) {
  if (registros.length === 0) return null

  const ordenados = [...registros].sort((a, b) => a.fecha.localeCompare(b.fecha))
  const primero = ordenados[0]
  const ultimo = ordenados[ordenados.length - 1]
  const diferencia = ultimo.pesoKg - primero.pesoKg

  return (
    <div className="tarjeta resumen">
      <div className="resumen-item">
        <span className="resumen-etiqueta">Peso inicial</span>
        <span className="resumen-valor">{primero.pesoKg} kg</span>
      </div>
      <div className="resumen-item">
        <span className="resumen-etiqueta">Peso actual</span>
        <span className="resumen-valor">{ultimo.pesoKg} kg</span>
      </div>
      <div className="resumen-item">
        <span className="resumen-etiqueta">Cambio total</span>
        <span className={`resumen-valor ${diferencia <= 0 ? 'positivo' : 'negativo'}`}>
          {diferencia > 0 ? '+' : ''}
          {diferencia.toFixed(1)} kg
        </span>
      </div>
    </div>
  )
}
