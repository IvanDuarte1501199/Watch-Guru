import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { fileURLToPath } from 'node:url';
import { db } from './index.js';

/** Applies pending SQL migrations from apps/api/drizzle. Safe to run on every boot. */
export async function runMigrations() {
  const migrationsFolder = fileURLToPath(new URL('../../drizzle', import.meta.url));
  await migrate(db, { migrationsFolder });
}
