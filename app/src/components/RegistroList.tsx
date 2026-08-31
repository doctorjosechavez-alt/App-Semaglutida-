import type { Registro } from '../types'
import { formatearFecha } from '../utils'

interface Props {
  registros: Registro[]
  onEliminar: (id: string) => void
}

export default function RegistroList({ registros, onEliminar }: Props) {
  const ordenados = [...registros].sort((a, b) => b.fecha.localeCompare(a.fecha))

  return (
    <div className="tarjeta">
      <h2>Historial</h2>
      {ordenados.length === 0 ? (
        <p className="texto-suave">Todavía no tienes registros. Agrega el primero arriba.</p>
      ) : (
        <ul className="lista-registros">
          {ordenados.map((r) => (
            <li key={r.id} className="fila-registro">
              <div className="fila-info">
                <span className="fila-fecha">{formatearFecha(r.fecha)}</span>
                <span className="fila-detalle">
                  {r.dosisMg} mg · {r.pesoKg} kg
                </span>
              </div>
              <button
                type="button"
                className="boton-eliminar"
                aria-label="Eliminar registro"
                onClick={() => onEliminar(r.id)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
