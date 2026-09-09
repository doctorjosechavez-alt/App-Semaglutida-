// Datos fijos de referencia (no editables desde la UI). Esta es solo una
// muestra de 3 filas para poder probar el buscador — falta la lista
// completa, que la usuaria va a proporcionar antes de la primera build.
//
// Cada fila se inserta una sola vez en standard_measures (ver
// src/db/migrations/001_init.sql) durante el seed inicial de la app.

export type StandardMeasureSeed = {
  category: string;
  item: string;
  valueText: string;
  valueMinCm?: number;
  valueMaxCm?: number;
  notes?: string;
};

export const STANDARD_MEASURES_SEED: StandardMeasureSeed[] = [
  {
    category: "Tomacorrientes",
    item: "Altura de tomacorriente sobre mesón de cocina",
    valueText: "105–110 cm desde el piso",
    valueMinCm: 105,
    valueMaxCm: 110,
  },
  {
    category: "Interruptores",
    item: "Altura de interruptor de luz",
    valueText: "110–120 cm desde el piso",
    valueMinCm: 110,
    valueMaxCm: 120,
  },
  {
    category: "Mesones de cocina",
    item: "Altura estándar de mesón",
    valueText: "90–92 cm desde el piso",
    valueMinCm: 90,
    valueMaxCm: 92,
  },
  // TODO: completar con la lista completa que aporte la usuaria
  // (lavamanos, barras de cortina, lámparas colgantes, manijas de
  // puertas, etc.)
];
