import { useEffect, useState } from 'react'
import PesoChart from './components/PesoChart'
import RegistroForm from './components/RegistroForm'
import RegistroList from './components/RegistroList'
import Resumen from './components/Resumen'
import { cargarRegistros, guardarRegistros } from './storage'
import type { Registro } from './types'
import './App.css'

export default function App() {
  const [registros, setRegistros] = useState<Registro[]>(() => cargarRegistros())

  useEffect(() => {
    guardarRegistros(registros)
  }, [registros])

  function agregarRegistro(registro: Registro) {
    setRegistros((prev) => [...prev, registro])
  }

  function eliminarRegistro(id: string) {
    setRegistros((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="app">
      <header className="encabezado">
        <h1>Seguimiento de Semaglutida</h1>
        <p className="texto-suave">Fecha, dosis y peso en un solo lugar.</p>
      </header>

      <main className="contenido">
        <RegistroForm onAgregar={agregarRegistro} />
        <Resumen registros={registros} />
        <PesoChart registros={registros} />
        <RegistroList registros={registros} onEliminar={eliminarRegistro} />
      </main>
    </div>
  )
}
