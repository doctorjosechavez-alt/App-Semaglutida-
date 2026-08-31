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
