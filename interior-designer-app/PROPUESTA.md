# Propuesta — Estudio de Obra (app de la diseñadora de interiores)

Estructura de carpetas y modelo de datos, ya ajustados según tu revisión.
El código en este commit sigue siendo solo esqueleto (config, esquema
SQLite, tema visual, contrato del servicio de transcripción) — todavía sin
pantallas.

## Cambios de esta revisión

1. **Área ahora es un catálogo fijo**, no texto libre — tabla `areas`
   (mismo patrón que `standard_measures`: se puebla una vez desde
   `src/db/seed/areas.ts`, no editable desde la UI). `paints` y
   `field_notes` ahora referencian `area_id` en vez de guardar texto.
   Lista inicial en `src/db/seed/areas.ts` (24 áreas típicas de vivienda —
   Sala, Cocina, Baño principal, Terraza, etc.). Si falta alguna, dímelo y
   la agrego.
2. **`standard_measures` ya tiene la lista completa poblada** en
   `src/db/seed/standardMeasures.ts` (antes solo había 3 de ejemplo — esas
   3 eran las únicas que el buscador iba a encontrar). Son ~34 medidas
   cubriendo tomacorrientes, interruptores, mesones de cocina, lavamanos,
   baños, barras de cortina, lámparas colgantes, manijas de puertas,
   clósets y muebles, con valores de referencia general de diseño de
   interiores/ergonomía. **Son valores estándar de la industria, no
   normativa oficial de ningún país** — conviene que los revises y me
   digas qué agregar, quitar o ajustar antes de la primera build.
3. **Transcripción automática de voz: sí se incluye**, con reconocimiento
   *on-device* (ver detalle abajo) — con manejo explícito del caso en que
   el teléfono no lo soporte, para no dejar la app bloqueada en obra sin
   señal.

## Estructura de carpetas

```
interior-designer-app/
  app.json                # config de Expo (permisos cámara/mic/calendario)
  package.json
  tsconfig.json
  babel.config.js
  app/                     # rutas de expo-router (se llenará al hacer pantallas)
  assets/
    fonts/                 # Fraunces + Source Serif 4
    images/
  src/
    db/
      migrations/
        001_init.sql       # esquema completo, ver abajo
      seed/
        areas.ts           # catálogo fijo de áreas
        standardMeasures.ts # catálogo fijo de medidas estándar
      client.ts            # apertura de la DB + runner de migraciones
    theme/
      colors.ts            # #FAF7F1, #2A2823, #A85C3B, #34556B
      typography.ts        # Fraunces (títulos) / Source Serif 4 (cuerpo)
    features/               # un módulo por dominio, cada uno con su
      clients/              # repositorio de datos + pantallas + tipos
      paints/
      materials/
      standardMeasures/
      fieldNotes/
      tasks/
    components/             # UI compartida (botones grandes, cards, chips
                             # de prioridad, etc.)
    navigation/              # navegación raíz (stack por cliente)
    services/                 # wrappers de APIs nativas:
                               #   camera.ts        (expo-camera)
                               #   audio.ts         (expo-av, notas de voz)
                               #   calendar.ts      (expo-calendar)
                               #   fileStorage.ts   (expo-file-system /
                               #                     expo-media-library)
                               #   transcription.ts (expo-speech-recognition,
                               #                     ya con el contrato escrito)
    hooks/
    utils/
```

**Por qué así:** cada módulo de negocio (`features/*`) es dueño de su
repositorio de datos, tipos y pantallas — así se puede tocar "Pendientes"
sin arriesgar "Pinturas". `db/` es la única capa que sabe que existe SQLite;
si más adelante se conecta Supabase/Firebase, se reemplaza o envuelve ahí
adentro y las pantallas no cambian.

## Modelo de datos (SQLite — `src/db/migrations/001_init.sql`)

7 tablas:

1. **`clients`** — ficha del cliente/proyecto: nombre, dirección de obra,
   contacto, notas, `status` (cotizacion / en_obra / entregado / pausado /
   cancelado). Todo lo demás cuelga de `client_id`.
2. **`areas`** — catálogo fijo (ver arriba).
3. **`paints`** — pinturas por cliente y `area_id`: marca, código de
   color, nombre de color, acabado, nota.
4. **`standard_measures`** — biblioteca fija de medidas estándar
   (categoría, ítem, valor en texto tipo "105–110 cm", más min/max
   numérico opcional para poder ordenar), ya poblada.
5. **`materials`** — materiales/acabados por cliente: tipo (tela, piso,
   madera, mármol/piedra, mueble, otro), referencia, proveedor, detalle
   libre.
6. **`field_notes`** — notas de campo: tipo (foto/video/voz/texto),
   `area_id` (opcional — una nota puede ser general), `file_uri` (archivo
   guardado en el almacenamiento propio de la app, para que funcione sin
   conexión), `media_library_id` opcional si además se copia a la galería,
   `transcript` + `transcript_status` (ver transcripción abajo),
   descripción corta, fecha del recorrido.
7. **`tasks`** — pendientes: prioridad (alta/media/baja), fecha,
   `done`/`archived`, y `calendar_event_id` para poder editar o borrar el
   evento que se creó en el calendario nativo del teléfono.

IDs son `TEXT` (UUID), no autoincrement — pensando en que el día de mañana
se sincronice entre dispositivos, un ID generado en el teléfono no choca
con el de otro.

## Transcripción automática de voz — cómo va a funcionar

Se usa reconocimiento de voz **en el propio dispositivo** (librería
`expo-speech-recognition`), no un servicio en la nube — así se mantiene
offline:

- **iPhone:** usa el dictado nativo de iOS en modo *on-device*. Funciona
  sin internet si el idioma español está descargado en Ajustes (lo cual es
  el caso por defecto en la inmensa mayoría de iPhones en español). Calidad
  buena para notas cortas tipo "medida muro cocina, 3.20 metros".
- **Android:** depende de si el teléfono tiene instalado el paquete de
  reconocimiento de voz offline para español (se configura una vez en
  Ajustes del sistema). Si no lo tiene y no hay señal, la transcripción
  simplemente no se puede hacer en ese momento.

Por eso el flujo es "mejor esfuerzo, nunca bloqueante":

1. Se graba la nota de voz normalmente y se guarda de inmediato
   (`transcript_status = 'pending'`) — grabar nunca depende de la
   transcripción.
2. En segundo plano se intenta transcribir on-device.
3. Si funciona → el texto queda guardado y es buscable
   (`transcript_status = 'done'`).
4. Si el teléfono no soporta reconocimiento offline en ese momento → queda
   `transcript_status = 'unavailable'` y la ficha de la nota simplemente
   muestra el campo de descripción manual como respaldo — nunca deja a la
   usuaria bloqueada en obra sin señal.

El contrato de esta función ya está escrito en
`src/services/transcription.ts`; la implementación con la librería nativa
se conecta junto con la pantalla de notas de campo.

## Otras notas de viabilidad técnica

- **Fotos/videos:** se graban con `expo-camera` y se guardan primero en el
  almacenamiento propio de la app (`expo-file-system`, funciona 100%
  offline). Opcionalmente, y solo si el teléfono tiene el permiso dado, se
  copian también a la galería (`expo-media-library`) para que la usuaria
  pueda compartirlos directo desde Fotos con un contratista.
- **Calendario nativo:** `expo-calendar` sí permite crear/editar/borrar
  eventos reales en el calendario del teléfono (no un link). Se guarda el
  `calendar_event_id` en `tasks` para poder mantenerlo sincronizado si la
  fecha del pendiente cambia.

## Pendiente antes de seguir con pantallas

1. Revisar la lista de `standardMeasures.ts` (¿agregar, quitar o ajustar
   algún valor?).
2. Revisar el catálogo de `areas.ts` (¿falta alguna área que uses seguido?).

Si no hay cambios, sigo con navegación + primeras pantallas (Clientes y
ficha de cliente).
