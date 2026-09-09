# Este repositorio contiene dos apps independientes

- [`app/`](./app) — **App Semaglutida**, descrita abajo.
- [`interior-designer-app/`](./interior-designer-app) — **Estudio de
  Obra**, app móvil (Expo/React Native) para uso personal de una
  diseñadora de interiores, offline-first. Ver la propuesta de estructura
  y modelo de datos en
  [`interior-designer-app/PROPUESTA.md`](./interior-designer-app/PROPUESTA.md).

---

# App Semaglutida

App para hacer seguimiento a la aplicación de semaglutida: registra la
**fecha** (día, mes, año), la **dosis** puesta y el **peso** con el que
llegaste ese día, y consulta un **gráfico lineal** con tu avance de peso.

El código de la app está en la carpeta [`app/`](./app) — es una PWA (React +
Vite) que guarda todo localmente en el propio dispositivo, sin backend ni
cuentas.

## Probarla en tu iPhone

### Opción A — Publicarla con GitHub Pages (recomendado)

1. En este repositorio en GitHub: **Settings → Pages → Build and deployment
   → Source: "GitHub Actions"**.
2. Al hacer push a `main`, el workflow `.github/workflows/deploy.yml` construye
   la app y la publica automáticamente. La URL queda visible en la sección
   **Actions** (o en Settings → Pages) tras el primer despliegue exitoso.
3. Abre esa URL en **Safari** desde el iPhone.
4. Toca el ícono de compartir (el cuadrado con la flecha hacia arriba) →
   **"Añadir a pantalla de inicio"**.
5. Listo: queda instalada como una app con su propio ícono, pantalla completa
   y funciona sin conexión.

### Opción B — Correrla en local

```bash
cd app
npm install
npm run dev
```

Más detalles de desarrollo en [`app/README.md`](./app/README.md).

## Qué registra

- Fecha de la inyección.
- Dosis aplicada (mg).
- Peso corporal (kg) ese día.
- Historial completo, editable (se pueden borrar registros).
- Resumen: peso inicial, peso actual y cambio total.
- Gráfico lineal de la evolución del peso en el tiempo.

Los datos viven únicamente en el navegador/dispositivo (localStorage); no se
envían a ningún servidor.
