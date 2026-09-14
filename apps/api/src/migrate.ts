import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { fileURLToPath } from 'node:url';
import { db, pool } from './db/index.js';

/** Applies pending migrations; run on deploy before starting the server. */
const migrationsFolder = fileURLToPath(new URL('../drizzle', import.meta.url));

await migrate(db, { migrationsFolder });
await pool.end();
console.log('Migrations applied');
