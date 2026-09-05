# Seguimiento de Semaglutida

App web (PWA) para registrar cada inyección de semaglutida —fecha, dosis en mg
y peso el día de la aplicación— y ver el avance en un gráfico lineal de peso.

Los datos se guardan solo en el dispositivo (localStorage del navegador); no
se envían a ningún servidor.

## Desarrollo local

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
npm run preview
```

## Instalar en un iPhone

1. Publica la app (ver "Despliegue" en el README raíz del repositorio) para
   obtener una URL, o sirve `npm run preview` en tu red local.
2. Abre esa URL en Safari en el iPhone.
3. Toca el botón de compartir → **"Añadir a pantalla de inicio"**.
4. Se instalará como una app normal, con ícono propio y sin la barra de Safari.

## Estructura

- `src/types.ts` — modelo de datos de un registro.
- `src/storage.ts` — persistencia en `localStorage`.
- `src/components/RegistroForm.tsx` — formulario para agregar un registro.
- `src/components/RegistroList.tsx` — historial de registros.
- `src/components/PesoChart.tsx` — gráfico lineal de peso (recharts).
- `src/components/Resumen.tsx` — resumen de peso inicial/actual/cambio.
- `src/components/ProximaDosis.tsx` — recordatorio de la siguiente dosis (fecha de
  la última inyección + 7 días exactos).
- `src/components/ConcentracionChart.tsx` — curva de referencia de la
  concentración de semaglutida durante los 7 días entre dosis.
- `src/calendario.ts` — genera el archivo `.ics` para añadir la alarma al
  Calendario del iPhone.

## Recordatorio de la siguiente dosis

La app calcula automáticamente la fecha de la siguiente dosis (7 días exactos
después de tu última inyección registrada) y ofrece dos formas de recordarlo:

1. **"Añadir alarma al calendario"** — descarga un archivo `.ics` con una
   alarma a las 9:00 a. m. de ese día. Al abrirlo en el iPhone se agrega como
   evento con recordatorio en la app Calendario, que sí puede avisarte aunque
   la app/pestaña esté cerrada.
2. **"Activar aviso en la app"** — pide permiso de notificaciones del
   navegador y muestra un aviso dentro de la app cuando la dosis ya está
   vencida. Solo funciona mientras abres la app (Safari/PWA en iOS no permite
   que una web programe notificaciones nativas en segundo plano sin un
   servidor push), así que la opción del calendario es la más confiable.

## Curva de concentración

Muestra una referencia teórica de cómo decae la concentración de semaglutida
entre una inyección y la siguiente, calculada con la vida media de eliminación
del fármaco (~165 horas / ~7 días, según la información de prescripción de
Ozempic/Wegovy de la FDA): `C(t) = 100% × 0.5^(t / 6.9 días)`. Si hay una
inyección registrada dentro de los últimos 7 días, marca en la curva el punto
correspondiente a "hoy". Es solo una aproximación educativa (no modela
absorción ni la acumulación por dosis semanales repetidas) y no sustituye
indicación médica.
