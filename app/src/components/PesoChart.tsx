import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Registro } from '../types'
import { formatearFecha } from '../utils'

interface Props {
  registros: Registro[]
}

export default function PesoChart({ registros }: Props) {
  const datos = [...registros]
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .map((r) => ({ fecha: r.fecha, peso: r.pesoKg }))

  const pesos = datos.map((d) => d.peso)
  const min = pesos.length ? Math.min(...pesos) : 0
  const max = pesos.length ? Math.max(...pesos) : 0
  const margen = Math.max(1, (max - min) * 0.15)

  if (datos.length < 2) {
    return (
      <div className="tarjeta">
        <h2>Progreso de peso</h2>
        <p className="texto-suave">
          Agrega al menos dos registros para ver tu gráfico de avance.
        </p>
      </div>
    )
  }

  return (
    <div className="tarjeta">
      <h2>Progreso de peso</h2>
      <div className="contenedor-grafico">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={datos} margin={{ top: 8, right: 16, bottom: 0, left: -12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--borde)" />
            <XAxis
              dataKey="fecha"
              tickFormatter={formatearFecha}
              stroke="var(--texto-suave)"
              tick={{ fontSize: 11 }}
              minTickGap={24}
            />
            <YAxis
              domain={[min - margen, max + margen]}
              stroke="var(--texto-suave)"
              tick={{ fontSize: 11 }}
              width={40}
            />
            <Tooltip
              labelFormatter={(v) => formatearFecha(String(v))}
              formatter={(value) => [`${value} kg`, 'Peso']}
              contentStyle={{
                background: 'var(--superficie)',
                border: '1px solid var(--borde)',
                borderRadius: 8,
                color: 'var(--texto)',
              }}
            />
            <Line
              type="monotone"
              dataKey="peso"
              stroke="#1d6fd8"
              strokeWidth={3}
              dot={{ r: 3, fill: '#1d6fd8' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
