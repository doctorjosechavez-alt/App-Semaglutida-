# Propuesta inicial — Estudio de Obra (app de la diseñadora de interiores)

Esta es la propuesta de **estructura de carpetas** y **modelo de datos**
pedida antes de escribir pantallas. El código ya creado en este commit es
solo el esqueleto del proyecto (config, esquema SQLite, tema visual) — nada
de pantallas todavía.

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
      seed/                # datos fijos: medidas estándar
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
                               #   camera.ts    (expo-camera)
                               #   audio.ts     (expo-av, notas de voz)
                               #   calendar.ts  (expo-calendar)
                               #   fileStorage.ts (expo-file-system /
                               #                   expo-media-library)
    hooks/
    utils/
```

**Por qué así:** cada módulo de negocio (`features/*`) es dueño de su
repositorio de datos, tipos y pantallas — así se puede tocar "Pendientes"
sin arriesgar "Pinturas". `db/` es la única capa que sabe que existe SQLite;
si más adelante se conecta Supabase/Firebase, se reemplaza o envuelve ahí
adentro y las pantallas no cambian.

## Modelo de datos (SQLite — `src/db/migrations/001_init.sql`)

6 tablas, ya escritas en el archivo de migración:

1. **`clients`** — ficha del cliente/proyecto: nombre, dirección de obra,
   contacto, notas, `status` (cotizacion / en_obra / entregado / pausado /
   cancelado). Todo lo demás cuelga de `client_id`.
2. **`paints`** — pinturas por cliente y área (área es texto libre, ej.
   "Cocina"): marca, código de color, nombre de color, acabado, nota.
3. **`standard_measures`** — biblioteca fija de medidas estándar
   (categoría, ítem, valor en texto tipo "105–110 cm", más min/max
   numérico opcional para poder ordenar). Se puebla una sola vez desde
   `src/db/seed/`; la app nunca escribe ahí desde la UI. **Te pido la lista
   completa de valores para poblarla** — mientras tanto dejo la tabla vacía
   con 2-3 filas de ejemplo para probar el buscador.
4. **`materials`** — materiales/acabados por cliente: tipo (tela, piso,
   madera, mármol/piedra, mueble, otro), referencia, proveedor, detalle
   libre.
5. **`field_notes`** — notas de campo: tipo (foto/video/voz/texto),
   `file_uri` (archivo guardado en el almacenamiento propio de la app, para
   que funcione sin conexión y sin depender de permisos de galería),
   `media_library_id` opcional si además se copia a la galería del
   teléfono, descripción corta, fecha del recorrido.
6. **`tasks`** — pendientes: prioridad (alta/media/baja), fecha,
   `done`/`archived`, y `calendar_event_id` para poder editar o borrar el
   evento que se creó en el calendario nativo del teléfono.

IDs son `TEXT` (UUID), no autoincrement — pensando en que el día de mañana
se sincronice entre dispositivos, un ID generado en el teléfono no choca
con el de otro.

## Notas de viabilidad técnica

- **Transcripción automática de notas de voz → texto: no viable en la v1.**
  Requeriría un modelo de reconocimiento de voz corriendo en el teléfono
  (pesado, o de calidad pobre offline) o mandar el audio a un servicio en
  la nube (necesita internet, que es justo lo que no hay en obra).
  **Alternativa simple para v1:** al grabar una nota de voz, la app pide un
  título/descripción corta escrita a mano (2-3 palabras, ej. "medida muro
  cocina") — eso ya es buscable. Si más adelante hay conexión disponible
  en la oficina, se puede agregar un botón "Transcribir" que llame a un
  servicio en la nube solo cuando haya wifi, sin bloquear el flujo offline.
- **Fotos/videos:** se graban con `expo-camera` y se guardan primero en el
  almacenamiento propio de la app (`expo-file-system`, funciona 100%
  offline). Opcionalmente, y solo si el teléfono tiene el permiso dado, se
  copian también a la galería (`expo-media-library`) para que la usuaria
  pueda compartirlos directo desde Fotos con un contratista. Si más
  adelante se agrega sync, esos archivos son lo primero que pesa — se
  puede pensar compresión de video en ese momento.
- **Calendario nativo:** `expo-calendar` sí permite crear/editar/borrar
  eventos reales en el calendario del teléfono (no un link). Se guarda el
  `calendar_event_id` en `tasks` para poder mantenerlo sincronizado si la
  fecha del pendiente cambia.

## Pendiente de tu confirmación antes de seguir con pantallas

1. ¿La estructura y las 6 tablas cubren todo lo que necesitas, o falta/sobra
   algo (ej. ¿"área" debería ser una lista fija por cliente en vez de texto
   libre)?
2. La lista completa de medidas estándar para poblar `standard_measures`.
3. ¿Confirmas el enfoque de notas de voz (descripción escrita corta, sin
   transcripción automática en v1)?

Con eso confirmado, sigo con navegación + primeras pantallas (Clientes y
ficha de cliente).
