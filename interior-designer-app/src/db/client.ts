import * as SQLite from "expo-sqlite";

// Punto único de acceso a la base de datos local. Toda la capa de datos
// (repositorios en src/features/*/*.repository.ts) pasa por aquí, para que
// el día que se agregue sync remoto (Supabase/Firebase) solo haya que
// envolver o sustituir este archivo, sin tocar las pantallas.

const DB_NAME = "interior_designer.db";

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;
  dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
  return dbInstance;
}

// Migraciones numeradas y ordenadas: cada entrada corre una sola vez,
// registrada en la tabla schema_migrations. Nuevos cambios de esquema se
// agregan como 002_*.sql, 003_*.sql, etc. — nunca se edita 001 una vez
// publicado.
const MIGRATIONS: { id: string; sql: string }[] = [
  // El contenido real de cada .sql se importa como texto (ver metro config /
  // babel transform para *.sql, o se inlinea aquí como plantilla) al
  // implementar esta capa.
];

export async function runMigrations(): Promise<void> {
  const db = await getDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);

  for (const migration of MIGRATIONS) {
    const already = await db.getFirstAsync(
      "SELECT id FROM schema_migrations WHERE id = ?",
      migration.id
    );
    if (already) continue;

    await db.execAsync("BEGIN TRANSACTION;");
    try {
      await db.execAsync(migration.sql);
      await db.runAsync(
        "INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?)",
        migration.id,
        new Date().toISOString()
      );
      await db.execAsync("COMMIT;");
    } catch (err) {
      await db.execAsync("ROLLBACK;");
      throw err;
    }
  }
}
