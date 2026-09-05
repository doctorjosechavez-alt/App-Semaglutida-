import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Registro } from '../types'
import { concentracionRelativa, diasDesde } from '../utils'

interface Props {
  registros: Registro[]
}

const PASO_DIAS = 0.25

function generarCurva() {
  const puntos = []
  for (let dia = 0; dia <= 7; dia += PASO_DIAS) {
    puntos.push({ dia: Math.round(dia * 100) / 100, concentracion: Math.round(concentracionRelativa(dia) * 10) / 10 })
  }
  return puntos
}

const datosCurva = generarCurva()

export default function ConcentracionChart({ registros }: Props) {
  const ultimo = [...registros].sort((a, b) => b.fecha.localeCompare(a.fecha))[0]
  const diasTranscurridos = ultimo ? diasDesde(ultimo.fecha) : null
  const dentroDeLaSemana = diasTranscurridos !== null && diasTranscurridos >= 0 && diasTranscurridos <= 7

  return (
    <div className="tarjeta">
      <h2>Concentración estimada entre dosis</h2>
      <p className="texto-suave">
        Referencia teórica según la vida media de la semaglutida (~7 días). Es una
        aproximación educativa, no una medición real ni un sustituto de indicación
        médica.
      </p>
      <div className="contenedor-grafico">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={datosCurva} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--borde)" />
            <XAxis
              dataKey="dia"
              type="number"
              domain={[0, 7]}
              ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
              stroke="var(--texto-suave)"
              tick={{ fontSize: 11 }}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              stroke="var(--texto-suave)"
              tick={{ fontSize: 11 }}
              width={46}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              labelFormatter={(v) => `Día ${v}`}
              formatter={(value) => [`${value}%`, 'Concentración']}
              contentStyle={{
                background: 'var(--superficie)',
                border: '1px solid var(--borde)',
                borderRadius: 8,
                color: 'var(--texto)',
              }}
            />
            <Line type="monotone" dataKey="concentracion" stroke="#1d6fd8" strokeWidth={3} dot={false} />
            {dentroDeLaSemana && (
              <ReferenceDot
                x={diasTranscurridos}
                y={Math.round(concentracionRelativa(diasTranscurridos!) * 10) / 10}
                r={6}
                fill="#d0392b"
                stroke="#fff"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {dentroDeLaSemana ? (
        <p className="texto-suave">
          Hoy (día {diasTranscurridos}): ≈{Math.round(concentracionRelativa(diasTranscurridos!))}% de la
          concentración de tu última dosis.
        </p>
      ) : diasTranscurridos !== null && diasTranscurridos > 7 ? (
        <p className="texto-suave">
          Ya pasaron más de 7 días desde tu última dosis registrada.
        </p>
      ) : null}
    </div>
  )
}
