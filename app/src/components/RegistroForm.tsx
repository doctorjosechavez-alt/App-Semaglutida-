import { useState, type FormEvent } from 'react'
import type { Registro } from '../types'
import { hoyISO } from '../utils'

interface Props {
  onAgregar: (registro: Registro) => void
}

const DOSIS_COMUNES = [0.25, 0.5, 1, 1.7, 2, 2.4]

export default function RegistroForm({ onAgregar }: Props) {
  const [fecha, setFecha] = useState(hoyISO())
  const [dosisMg, setDosisMg] = useState('')
  const [pesoKg, setPesoKg] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const dosis = Number(dosisMg)
    const peso = Number(pesoKg)

    if (!fecha) {
      setError('Elige la fecha de la inyección.')
      return
    }
    if (!dosisMg || Number.isNaN(dosis) || dosis <= 0) {
      setError('Ingresa una dosis válida en mg.')
      return
    }
    if (!pesoKg || Number.isNaN(peso) || peso <= 0) {
      setError('Ingresa un peso válido en kg.')
      return
    }

    setError('')
    onAgregar({
      id: crypto.randomUUID(),
      fecha,
      dosisMg: dosis,
      pesoKg: peso,
    })
    setDosisMg('')
    setPesoKg('')
  }

  return (
    <form className="tarjeta formulario" onSubmit={handleSubmit}>
      <h2>Nueva inyección</h2>

      <label className="campo">
        <span>Fecha</span>
        <input
          type="date"
          value={fecha}
          max={hoyISO()}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </label>

      <label className="campo">
        <span>Dosis (mg)</span>
        <input
          type="number"
          inputMode="decimal"
          step="0.05"
          min="0"
          placeholder="p. ej. 0.5"
          list="dosis-comunes"
          value={dosisMg}
          onChange={(e) => setDosisMg(e.target.value)}
          required
        />
        <datalist id="dosis-comunes">
          {DOSIS_COMUNES.map((d) => (
            <option key={d} value={d} />
          ))}
        </datalist>
      </label>

      <label className="campo">
        <span>Peso (kg)</span>
        <input
          type="number"
          inputMode="decimal"
          step="0.1"
          min="0"
          placeholder="p. ej. 82.5"
          value={pesoKg}
          onChange={(e) => setPesoKg(e.target.value)}
          required
        />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" className="boton-primario">
        Guardar registro
      </button>
    </form>
  )
}
